import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Let's create an interface if using typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Automatic silent token refresh is handled natively by Firebase SDK `onAuthStateChanged`
      setUser(firebaseUser);
      setLoading(false);

      // If user is logged in natively, sync to the postgres DB via backend API
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          // We assume /api/auth/sync handles upserting into Postgres.
          // By calling it with the correct token attached, the backend verifies it.
          await fetch(`${API_URL}/api/auth/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0]
            })
          }).catch(console.error); // Fallback ignore inside effect
        } catch (error) {
          console.error("Error syncing user session to DB:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData.email;
        console.warn(`Attempting to link google account to existing email: ${email}`);
        // Handle linking if needed, but Firebase usually does this natively if you configure it in console.
        // Or we can rely on standard signInWithPopup automatically tying if configured correctly.
      }
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const logout = () => signOut(auth);

  const value = {
    user,
    loading,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
