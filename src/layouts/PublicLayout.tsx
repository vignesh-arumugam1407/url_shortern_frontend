
import { Link, Outlet, useLocation } from 'react-router-dom';

export const PublicLayout = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-background text-on-background flex flex-col relative w-full">
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-outline-variant/10">
                <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full">
                    <Link to="/" className="flex items-center gap-2 group">
                        <span className="text-2xl font-black tracking-tighter text-primary">ShortenIt</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex gap-6">
                            <Link to="/" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary' : 'text-slate-600'}`}>
                                Home
                            </Link>
                            <Link to="/features" className="text-sm font-medium text-slate-600 transition-colors hover:text-primary">
                                Features
                            </Link>
                            <Link to="/pricing" className="text-sm font-medium text-slate-600 transition-colors hover:text-primary">
                                Pricing
                            </Link>
                        </div>
                        <div className="h-6 w-px bg-outline-variant/30" />
                        <div className="flex gap-4">
                            <Link to="/login" className="text-sm py-2 px-4 inline-block font-bold text-slate-600 hover:text-primary transition-colors">Login</Link>
                            <Link to="/dashboard" className="bg-gradient-to-br from-primary to-primary-container text-white text-sm py-2 px-6 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all inline-block">Go to Dashboard</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow pt-24 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
                <Outlet />
            </main>
            
            {/* Footer */}
            <footer className="w-full py-8 text-center text-sm text-slate-400 mt-auto">
                <p>© 2024 ShortenIt Precision. All rights reserved.</p>
            </footer>
        </div>
    );
};
