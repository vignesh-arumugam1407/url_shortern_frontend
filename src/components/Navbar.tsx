import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link as LinkIcon, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl mt-6 px-6 py-4 flex items-center justify-between z-50 sticky top-4"
    >
      <Link to="/" className="flex items-center gap-2 group">
        <div className="p-2 bg-neon-purple/20 rounded-xl group-hover:bg-neon-purple/40 transition-colors">
          <LinkIcon className="w-6 h-6 text-neon-blue group-hover:text-neon-pink transition-colors" />
        </div>
        <span className="text-xl font-bold tracking-wider text-gradient">
          Astra.ly
        </span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        <div className="flex gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-neon-blue ${location.pathname === link.path ? 'text-neon-blue' : 'text-gray-300'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div className="flex gap-4">
          <Link to="/login" className="btn-outline text-sm py-2 px-4 inline-block">Login</Link>
          <Link to="/register" className="btn-primary text-sm py-2 px-4 shadow-neon-purple/50 inline-block">Sign Up</Link>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden text-gray-300 hover:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-20 left-0 w-full glass-card flex flex-col gap-4 p-6 md:hidden"
        >
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-gray-300 hover:text-neon-blue"
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px w-full bg-white/10 my-2" />
          <Link to="/login" onClick={() => setIsOpen(false)} className="btn-outline text-center">Login</Link>
          <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary text-center">Sign Up</Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
