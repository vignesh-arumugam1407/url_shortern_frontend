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

const Analytics = () => {
    const { user } = useAuth();
    const [links, setLinks] = useState<LinkRecord[]>([]);
    
    useEffect(() => {
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
        fetchHistory();
    }, [user]);

    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
    const mostClicked = links.length ? [...links].sort((a, b) => b.clicks - a.clicks)[0] : null;

    return (
        <React.Fragment>
            <section className="mb-8">
                <h1 className="text-3xl font-extrabold text-on-surface">Traffic Analytics</h1>
                <p className="text-on-surface-variant">Dive deeper into how your audiences interact with your links.</p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/5 hover:border-primary/20 transition-colors">
                    <p className="text-sm font-semibold text-on-surface-variant mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl text-primary">touch_app</span> 
                        Total Global Clicks
                    </p>
                    <h3 className="text-4xl font-black text-on-surface">{totalClicks}</h3>
                </div>
                
                <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/5 hover:border-primary/20 transition-colors">
                    <p className="text-sm font-semibold text-on-surface-variant mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl text-primary">emoji_events</span> 
                        Top Performing Link
                    </p>
                    {mostClicked ? (
                        <div>
                            <h3 className="text-2xl font-black text-on-surface truncate pb-1">shorten.it/{mostClicked.shortCode}</h3>
                            <p className="text-sm text-tertiary font-bold">{mostClicked.clicks} clicks</p>
                        </div>
                    ) : (
                        <h3 className="text-xl font-medium text-slate-400">No data yet</h3>
                    )}
                </div>

                <div className="bg-gradient-to-br from-primary-container to-primary-fixed text-on-primary-container p-8 rounded-2xl shadow-sm border border-primary/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="material-symbols-outlined text-6xl">bar_chart</span>
                    </div>
                    <p className="text-sm font-semibold mb-2 relative z-10">Pro Insights</p>
                    <h3 className="text-2xl font-black mb-3 relative z-10">Unlock Maps & Devices</h3>
                    <button className="bg-white text-primary text-sm font-bold py-2 px-4 rounded-lg shadow-sm hover:scale-105 transition-transform active:scale-95 cursor-pointer relative z-10">
                        Upgrade to Pro
                    </button>
                </div>
            </section>

            <section>
                <div className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/10 text-center">
                    <div className="bg-surface-container inline-flex p-4 rounded-full mb-4 text-primary">
                        <span className="material-symbols-outlined text-4xl">monitoring</span>
                    </div>
                    <h2 className="text-xl font-bold text-on-surface mb-2">Detailed Charts Coming Soon</h2>
                    <p className="text-on-surface-variant max-w-md mx-auto">We are actively building time-series graphs to show your click volume over time. Stay tuned!</p>
                </div>
            </section>
        </React.Fragment>
    );
};

export default Analytics;
