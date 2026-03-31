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

const Links = () => {
    const { user } = useAuth();
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

    const copyToClipboard = (id: string, shortCode: string) => {
        navigator.clipboard.writeText(`${API_URL}/${shortCode}`);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <React.Fragment>
            <section className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-on-surface">My Links</h1>
                    <p className="text-on-surface-variant">Manage and organize all your shortened links.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input 
                            type="text" 
                            placeholder="Search links..." 
                            className="bg-surface-container-low border-none pl-10 pr-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none w-full md:w-64"
                        />
                    </div>
                </div>
            </section>

            <section className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/10 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low text-xs uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/10">
                                <th className="px-6 py-4 font-bold">Short Link</th>
                                <th className="px-6 py-4 font-bold">Original Destination</th>
                                <th className="px-6 py-4 font-bold">Clicks</th>
                                <th className="px-6 py-4 font-bold">Date Created</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/5">
                            {links.map((link) => (
                                <tr key={link.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                <span className="material-symbols-outlined text-sm">link</span>
                                            </div>
                                            <a href={`${API_URL}/${link.shortCode}`} target="_blank" rel="noreferrer" className="font-bold text-primary hover:underline">
                                                shorten.it/{link.shortCode}
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-500 truncate max-w-[200px] xl:max-w-xs font-medium" title={link.originalUrl}>
                                            {link.originalUrl}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center justify-center bg-surface-container px-3 py-1 rounded-full">
                                            <span className="text-sm font-bold text-on-surface">{link.clicks}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-slate-500 font-medium">
                                            {new Date(link.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => copyToClipboard(link.id, link.shortCode)}
                                            className={`p-2 rounded-lg transition-colors inline-block ${copiedId === link.id ? 'bg-tertiary-fixed text-tertiary-container' : 'text-slate-400 hover:text-primary hover:bg-primary/10'}`}
                                            title="Copy"
                                        >
                                            <span className="material-symbols-outlined text-lg">{copiedId === link.id ? 'check' : 'content_copy'}</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {links.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-on-surface-variant">
                                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">link_off</span>
                                        <p>You haven't generated any links yet.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </React.Fragment>
    );
};

export default Links;
