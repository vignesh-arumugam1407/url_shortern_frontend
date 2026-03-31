import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { name: 'Analytics', path: '/analytics', icon: 'leaderboard' },
  { name: 'Links', path: '/links', icon: 'link' },
  { name: 'Settings', path: '/settings', icon: 'settings' },
];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none">
        <div className="flex justify-between items-center px-6 py-3 w-full">
          <div className="flex items-center gap-8">
            <button 
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="text-xl font-black tracking-tighter text-blue-800 dark:text-blue-400">ShortenIt</span>
            <div className="hidden md:flex items-center gap-6">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                <input 
                  className="pl-10 pr-4 py-1.5 bg-slate-50 dark:bg-slate-950 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 w-64 outline-none transition-all" 
                  placeholder="Search links..." 
                  type="text"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100/50 rounded-full transition-colors hidden sm:block">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100/50 rounded-full transition-colors hidden sm:block">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <div className="h-8 w-8 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden border border-outline-variant/15">
              <img 
                alt="User ProfileAvatar" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS2MTt41OKc1gt4CYnCyR17KEe2gkxpSYGRPh6aE5x6uM2u_xvLe2M0vzJJQ3MnR1VvnlzwgtiJDs0nY7Wi3Hd__kpzbR0KM61o2DiTRtkGmsOR5wu7F36mnMhFOLmJhrE39c_7tQPORc60qV42g3R-vAWguHlsqzPBPpa9foQNmaq-MXWzh_h0FSpErw4gqs497VKj8p7p7DV0jPMfgXNYyob-L6RKvrC_FgWXkbOWeQUxT26N-y9zgWTyoGDNbCWMEdjX5xTi4Iv"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* SideNavBar */}
      <aside className={`fixed left-0 top-0 pt-20 bg-slate-50 dark:bg-slate-950 border-r border-slate-200/15 dark:border-slate-800/15 h-screen w-64 flex-col transition-transform duration-300 z-40 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:flex`}>
        <div className="px-6 mb-6 mt-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Main Menu</p>
        </div>
        <nav className="flex flex-col gap-2 py-4 flex-grow">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link 
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium hover:translate-x-1'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                <span className="font-sans text-sm">{item.name}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-auto p-4 flex flex-col gap-2 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
          <div className="bg-gradient-to-br from-primary to-primary-container text-white p-4 rounded-xl mb-4">
            <p className="text-xs font-bold mb-1 uppercase tracking-widest opacity-80">Pro Plan</p>
            <p className="text-[10px] opacity-90 mb-3">Unlock custom domains and deep analytics.</p>
            <button 
              onClick={() => alert("Upgrade functionality is coming soon! Thank you for your interest.")}
              className="w-full py-2 bg-white text-primary text-[10px] font-bold rounded-lg hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
            >
              Upgrade Now
            </button>
          </div>
          <Link to="/support" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 mx-2 rounded-lg duration-200 text-sm font-medium">
            <span className="material-symbols-outlined">contact_support</span>
            Support
          </Link>
          <button 
            onClick={async () => {
              await logout();
              window.location.href = '/login';
            }} 
            className="flex items-center w-full gap-3 px-4 py-3 text-slate-500 hover:text-error hover:bg-error-container/20 mx-2 rounded-lg duration-200 text-sm font-medium cursor-pointer"
          >
            <span className="material-symbols-outlined">logout</span>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="md:ml-64 pt-24 pb-12 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="w-full py-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/30">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 md:ml-64">
          <span className="text-sm font-bold text-slate-300 mb-4 md:mb-0">ShortenIt Precision</span>
          <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
            <Link to="#" className="text-xs text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all">Privacy Policy</Link>
            <Link to="#" className="text-xs text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all">Terms of Service</Link>
            <Link to="#" className="text-xs text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all">API Documentation</Link>
            <Link to="#" className="text-xs text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all">System Status</Link>
          </div>
          <p className="text-xs text-slate-400 opacity-80">© 2024 ShortenIt Precision.</p>
        </div>
      </footer>
    </div>
  );
};
