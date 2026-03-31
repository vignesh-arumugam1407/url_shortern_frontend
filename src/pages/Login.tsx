import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { loginWithEmail, loginWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            await loginWithEmail(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto -mt-20">
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-surface-container-lowest relative overflow-hidden rounded-[2rem] p-8 shadow-xl border border-outline-variant/10"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px]" />
                
                <div className="text-center mb-8 relative z-10">
                    <h2 className="text-3xl font-extrabold text-on-surface mb-2 tracking-tight">Welcome Back</h2>
                    <p className="text-on-surface-variant text-sm">Log in to manage your active links.</p>
                </div>

                <div className="relative z-10 space-y-4 mb-6">
                    <button 
                        onClick={handleGoogleLogin}
                        className="w-full h-12 flex items-center justify-center gap-3 bg-white text-on-surface font-semibold rounded-xl border border-outline-variant/15 hover:bg-surface-variant/20 transition-all shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>
                    
                    <div className="flex items-center gap-3 text-sm text-outline">
                        <div className="h-px bg-outline-variant/20 flex-1"></div>
                        <span>or email</span>
                        <div className="h-px bg-outline-variant/20 flex-1"></div>
                    </div>
                </div>

                <form className="space-y-4 relative z-10" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-error-container text-on-error-container text-sm p-3 rounded-xl border border-error/20">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-bold text-on-surface mb-1.5 ml-1">Email</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-surface-container-low border-none rounded-xl px-4 h-12 text-on-surface shadow-inner focus:ring-4 focus:ring-primary/10 hover:bg-surface-variant/50 transition-all outline-none" 
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-on-surface mb-1.5 ml-1">Password</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-surface-container-low border-none rounded-xl px-4 h-12 text-on-surface shadow-inner focus:ring-4 focus:ring-primary/10 hover:bg-surface-variant/50 transition-all outline-none" 
                            placeholder="••••••••"
                        />
                    </div>

                    <button disabled={loading} type="submit" className="bg-gradient-to-br from-primary to-primary-container text-white w-full py-3 h-12 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm mt-4 flex items-center justify-center disabled:opacity-75 disabled:scale-100">
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : 'Sign In'}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-on-surface-variant relative z-10">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary hover:text-primary-container font-bold transition-colors">
                        Register here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
