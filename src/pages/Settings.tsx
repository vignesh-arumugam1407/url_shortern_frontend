import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    const [name, setName] = useState(user?.displayName || '');
    const [saved, setSaved] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <React.Fragment>
            <section className="mb-8">
                <h1 className="text-3xl font-extrabold text-on-surface">Account Settings</h1>
                <p className="text-on-surface-variant">Update your profile, billing, and system preferences.</p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
                        <h2 className="text-xl font-bold text-on-surface mb-6">Profile Information</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-on-surface mb-1.5 ml-1">Display Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-surface-container-low border-none rounded-xl px-4 h-12 text-on-surface focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-on-surface mb-1.5 ml-1">Email Address</label>
                                <input 
                                    type="email" 
                                    disabled
                                    value={user?.email || ''}
                                    className="w-full bg-surface-container border-none rounded-xl px-4 h-12 text-on-surface-variant cursor-not-allowed outline-none"
                                />
                                <p className="text-xs text-on-surface-variant mt-1 ml-1 scale-95 origin-left">Email address cannot be changed for OAuth accounts.</p>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-primary/90 transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">{saved ? 'check' : 'save'}</span>
                                    {saved ? 'Saved' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="bg-gradient-to-br from-primary-container to-primary-fixed text-on-primary-container rounded-2xl p-6 shadow-sm border border-primary/10">
                        <h2 className="text-lg font-bold mb-2">Pro Subscription</h2>
                        <p className="text-sm opacity-90 mb-4">You are currently on the Free tier. Upgrade to unlock custom domains.</p>
                        <button className="w-full bg-white text-primary font-bold py-2.5 rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all outline-none">
                            View Pricing
                        </button>
                    </section>

                    <section className="bg-error-container text-on-error-container rounded-2xl p-6 shadow-sm border border-error/20">
                        <h2 className="text-lg font-bold mb-2">Danger Zone</h2>
                        <p className="text-sm opacity-90 mb-4">Permanently delete your account and all associated links.</p>
                        <button className="w-full bg-error text-white font-bold py-2.5 rounded-xl shadow-lg shadow-error/20 hover:bg-error/90 outline-none transition-colors">
                            Delete Account
                        </button>
                    </section>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Settings;
