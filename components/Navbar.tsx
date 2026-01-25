
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#050614]/90 backdrop-blur-md border-b border-white/10 py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-12">
            <Link to="/" className="flex items-center group">
              <img src="/logos/ClarityWorks_logoWH.png" alt="ClarityWorks Studio Logo" className="h-32 md:h-40 group-hover:scale-105 transition-transform" />
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/services" className="text-slate-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors">Services</Link>
              <Link to="/agent-studio" className="text-clarity-blue hover:text-white text-sm font-black uppercase tracking-widest transition-colors">Agent Studio</Link>
              <Link to="/training" className="text-slate-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors">Workshops</Link>
              <Link to="/pricing" className="text-slate-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors">Pricing</Link>
              <Link to="/about" className="text-slate-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors">About Us</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/ai-assessment" className="text-clarity-blue hover:text-white text-xs font-black uppercase tracking-[0.2em] transition-all">
              AI Audit
            </Link>
            {user ? (
              <Link to="/dashboard" className="bg-white text-[#050614] px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-clarity-blue hover:text-white transition-all">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="bg-white/10 border border-white/20 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-[#050614] transition-all">
                Client Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#050614] border-t border-white/10 py-8 px-6 space-y-6 shadow-2xl animate-in slide-in-from-top duration-300">
          <Link to="/services" className="block text-slate-300 text-lg font-black uppercase tracking-widest" onClick={() => setIsOpen(false)}>Services</Link>
          <Link to="/agent-studio" className="block text-clarity-blue text-lg font-black uppercase tracking-widest" onClick={() => setIsOpen(false)}>Agent Studio</Link>
          <Link to="/training" className="block text-slate-300 text-lg font-black uppercase tracking-widest" onClick={() => setIsOpen(false)}>Workshops</Link>
          <Link to="/pricing" className="block text-slate-300 text-lg font-black uppercase tracking-widest" onClick={() => setIsOpen(false)}>Pricing</Link>
          <Link to="/about" className="block text-slate-300 text-lg font-black uppercase tracking-widest" onClick={() => setIsOpen(false)}>About Our Studio</Link>
          <div className="pt-6">
            <Link to="/agent-studio" className="w-full bg-clarity-blue text-white py-4 rounded-xl font-black uppercase tracking-widest text-center block" onClick={() => setIsOpen(false)}>Deploy Agent</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
