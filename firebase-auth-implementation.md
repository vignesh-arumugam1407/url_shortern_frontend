# Firebase Authentication Implementation Plan

## 1. Environment & Dependencies Setup
- **Frontend (`/`)**: Install `firebase`. Add `VITE_FIREBASE_*` configuration variables to `.env`.
- **Backend (`/server`)**: Install `firebase-admin`. Add `serviceAccountKey.json` and configure `FIREBASE_PROJECT_ID` in `.env`.

## 2. Frontend Implementation (`src/`)
- **`lib/firebase.ts`**: Initialize the Firebase App and Export `auth` and `googleProvider`.
- **`contexts/AuthContext.tsx`**: Create a global React Context listener for `onAuthStateChanged`. This will handle silent token refreshing automatically and hold the user's session state globally.
- **`pages/Login.tsx` & `pages/Register.tsx`**: Bind standard email/password fields to Firebase and add a "Sign in with Google" button. 
- **API Interceptor**: Ensure that any requests sent to the Express backend include the Firebase JWT (`await user.getIdToken()`) in the `Authorization: Bearer <token>` header.

## 3. Backend Implementation (`server/`)
- **`config/firebase.js`**: Initialize Firebase Admin using `admin.initializeApp` and the service account credentials.
- **`middleware/auth.js`**: Create a robust middleware function to verify `Bearer <token>` passed from the frontend securely using `admin.auth().verifyIdToken()`.
- **`routes/auth.js`**: Implement a `/sync` endpoint. Upon a successful login/register on the frontend, it posts the Firebase `uid`, `email`, and `name` to the backend. The backend strictly verifies the token, and then uses Prisma to `upsert` the user into PostgreSQL — satisfying the account linking functionality.

## 4. Final Review
- Verify that Google login safely links into the same PostgreSQL user.
