import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API_URL from '../lib/api';

interface LinkRecord {
    id: string;
    originalUrl: string;
    shortCode: string;
    clicks: number;
    createdAt: string;
}

const Dashboard = () => {
    const { user } = useAuth();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState<LinkRecord[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fetchHistory = async () => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            const res = await fetch(`${API_URL}/api/url/history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLinks(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user]);

    const handleShorten = async () => {
        if (!url || !user) return;
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
                setUrl('');
                await fetchHistory(); // refresh the list
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Error shortening URL", error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (id: string, shortCode: string) => {
        navigator.clipboard.writeText(`${API_URL}/${shortCode}`);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

    return (
        <React.Fragment>
            <section className="mb-12">
                <div className="relative bg-surface-container-low rounded-[2rem] p-10 lg:p-16 overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="relative z-10 max-w-3xl">
                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface mb-4">Precision URL Shortening</h1>
                        <p className="text-on-surface-variant text-lg mb-10 max-w-xl">Transform long, complex strings into clean, actionable links. Built for scale, optimized for performance.</p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <input 
                                    className="w-full bg-surface-container-lowest border-none rounded-xl px-6 py-5 text-on-surface text-lg shadow-sm focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-400 outline-none" 
                                    placeholder="Paste your long URL here" 
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
                                />
                            </div>
                            <button 
                                onClick={handleShorten}
                                disabled={loading || !url}
                                className="bg-gradient-to-br from-primary to-primary-container text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-75 flex justify-center items-center cursor-pointer"
                            >
                                {loading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Shorten"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/5">
                    <p className="text-sm font-semibold text-on-surface-variant mb-2">Total Links Shortened</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-on-surface">{links.length}</h3>
                        <span className="text-xs font-bold text-tertiary-container bg-tertiary-fixed-dim px-2 py-0.5 rounded-full">ALL</span>
                    </div>
                </div>
                <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/5">
                    <p className="text-sm font-semibold text-on-surface-variant mb-2">Total Clicks</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-on-surface">{totalClicks}</h3>
                        <span className="text-xs font-bold text-tertiary-container bg-tertiary-fixed-dim px-2 py-0.5 rounded-full">ALL</span>
                    </div>
                </div>
                <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/5 opacity-50">
                    <p className="text-sm font-semibold text-on-surface-variant mb-2">Average CTR</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-on-surface">--</h3>
                        <span className="text-xs font-bold text-surface-variant border border-surface-variant px-2 py-0.5 rounded-full">PRO</span>
                    </div>
                </div>
                <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/5 opacity-50">
                    <p className="text-sm font-semibold text-on-surface-variant mb-2">Active Campaigns</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-on-surface">--</h3>
                        <span className="text-xs font-bold text-surface-variant border border-surface-variant px-2 py-0.5 rounded-full">PRO</span>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Recent Shortened Links</h2>
                        <p className="text-on-surface-variant text-sm">Manage and track your latest shortened URLs</p>
                    </div>
                </div>
                
                <div className="flex flex-col gap-5">
                    {links.slice(0, 5).map((link) => (
                        <div key={link.id} className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md border border-outline-variant/5 group">
                            <div className="flex items-center gap-5 flex-1 min-w-0">
                                <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center text-primary-container shrink-0">
                                    <span className="material-symbols-outlined">link</span>
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-lg font-bold text-primary truncate hover:underline">
                                            <a href={`${API_URL}/${link.shortCode}`} target="_blank" rel="noreferrer">
                                                shorten.it/{link.shortCode}
                                            </a>
                                        </h4>
                                        <span className={`w-2 h-2 rounded-full bg-tertiary-fixed-dim`} title="Active"></span>
                                    </div>
                                    <p className="text-sm text-slate-400 truncate max-w-md font-medium" title={link.originalUrl}>{link.originalUrl}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 shrink-0">
                                <div className="text-right">
                                    <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Clicks</p>
                                    <p className="text-xl font-black text-on-surface">{link.clicks}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => copyToClipboard(link.id, link.shortCode)}
                                        className="p-3 bg-surface-container text-primary rounded-xl hover:bg-primary-fixed transition-colors flex items-center gap-2 font-bold text-sm cursor-pointer w-[100px] justify-center"
                                    >
                                        <span className="material-symbols-outlined text-lg">{copiedId === link.id ? 'check_circle' : 'content_copy'}</span> {copiedId === link.id ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {links.length === 0 && (
                        <div className="text-center py-10 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/30">
                            <p className="text-on-surface-variant font-medium">You haven't shortened any links yet.</p>
                        </div>
                    )}
                </div>
            </section>
        </React.Fragment>
    );
};

export default Dashboard;
