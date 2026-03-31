import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API_URL from '../lib/api';

const Home = () => {
    const [url, setUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { user } = useAuth();

    const handleShorten = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            navigate('/login');
            return;
        }

        if (!url) return;
        
        setLoading(true);
        try {
            const token = await user.getIdToken();
            const response = await fetch(`${API_URL}/api/url/shorten`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ originalUrl: url })
            });
            const data = await response.json();
            
            if (response.ok) {
                setShortUrl(data.shortUrl);
            } else {
                alert(data.error || 'Check backend connection');
            }
        } catch (error) {
            console.error("Error shortening URL", error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center -mt-20">
            
            <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-16 space-y-6"
            >
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface">
                    Precision URL <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Shortening.</span>
                </h1>
                <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                    Transform long, complex strings into clean, actionable links. Built for scale, optimized for performance.
                </p>
            </motion.div>

            <motion.form 
                onSubmit={handleShorten}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-2xl relative"
            >
                <div className="bg-surface-container-lowest rounded-[2rem] p-4 lg:p-6 shadow-xl border border-outline-variant/10 flex flex-col sm:flex-row gap-4 relative z-10">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-outline">link</span>
                        </div>
                        <input 
                            type="url"
                            required
                            placeholder="Paste your long URL here..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full bg-surface-container-low border-none rounded-xl pl-12 pr-4 py-4 text-on-surface text-lg shadow-inner focus:ring-4 focus:ring-primary/10 hover:bg-surface-variant/50 transition-all placeholder:text-slate-400 outline-none"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-gradient-to-br from-primary to-primary-container text-white py-4 sm:w-48 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:scale-100"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>{user ? "Shorten" : "Login to Shorten"}</span>
                                <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">
                                    {user ? "content_cut" : "login"}
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </motion.form>

            <AnimatePresence>
                {shortUrl && (
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="mt-8 relative w-full max-w-2xl z-20"
                    >
                        <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md border border-outline-variant/10">
                            <div className="flex items-center gap-3 w-full overflow-hidden">
                                <div className="p-2 bg-primary-fixed rounded-lg shrink-0">
                                    <span className="material-symbols-outlined text-primary">arrow_forward</span>
                                </div>
                                <a href={shortUrl} target="_blank" rel="noreferrer" className="text-xl font-medium text-on-surface truncate hover:text-primary transition-colors">
                                    {shortUrl.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                            
                            <button 
                                onClick={copyToClipboard}
                                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all shrink-0 w-full sm:w-auto
                                    ${copied ? "bg-tertiary-fixed-dim text-tertiary-container shadow-sm" : "bg-surface-container hover:bg-surface-container-high text-primary"}
                                `}
                            >
                                <span className="material-symbols-outlined">{copied ? 'check_circle' : 'content_copy'}</span>
                                <span>{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
