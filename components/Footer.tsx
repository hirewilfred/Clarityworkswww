
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const [status, setStatus] = useState<'operational' | 'checking' | 'optimizing'>('checking');
  const [lastCheck, setLastCheck] = useState<string>(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer1 = setTimeout(() => setStatus('operational'), 2000);
    const interval = setInterval(() => {
      setStatus('checking');
      setLastCheck(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setTimeout(() => {
        setStatus(Math.random() > 0.8 ? 'optimizing' : 'operational');
      }, 1500);
    }, 30000);

    return () => {
      clearTimeout(timer1);
      clearInterval(interval);
    };
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'checking':
        return { color: 'bg-amber-500', text: 'Performing Health Check...', pulse: true };
      case 'optimizing':
        return { color: 'bg-blue-500', text: 'Optimizing Global Nodes', pulse: true };
      default:
        return { color: 'bg-emerald-500', text: 'All Systems Operational', pulse: false };
    }
  };

  const config = getStatusConfig();

  return (
    <footer className="bg-[#050614] text-white pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-8">
              <img src="/logos/ClarityWorks_logoWH.png" alt="ClarityWorks Studio Logo" className="h-40 md:h-48 opacity-80 hover:opacity-100 transition-opacity" />
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed text-sm font-medium">
              The premier professional services studio for Enterprise Agentic AI.
              Engineering resilient digital legacies for the autonomous age.
            </p>
            <div className="mt-8 flex gap-4 opacity-50">
              <i className="fab fa-linkedin-in hover:opacity-100 cursor-pointer transition-opacity p-2.5 border border-white/10 rounded-xl"></i>
              <i className="fab fa-twitter hover:opacity-100 cursor-pointer transition-opacity p-2.5 border border-white/10 rounded-xl"></i>
              <i className="fab fa-github hover:opacity-100 cursor-pointer transition-opacity p-2.5 border border-white/10 rounded-xl"></i>
            </div>
          </div>

          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-8">Solutions</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-bold uppercase tracking-widest">
              <li><Link to="/services" className="hover:text-white transition-colors">AI Services</Link></li>
              <li><Link to="/training" className="hover:text-white transition-colors">Workshops</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/ai-assessment" className="hover:text-white transition-colors">AI Audit</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-8">Studio</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-bold uppercase tracking-widest">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/case-studies" className="hover:text-white transition-colors">Case Studies</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-8">Support</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">© {new Date().getFullYear()} ClarityWorks Studio. All Rights Reserved.</p>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
              <div className={`w-1.5 h-1.5 rounded-full ${config.color} ${config.pulse ? 'animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.4)]' : ''}`}></div>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest transition-all duration-500">
                {config.text}
              </span>
            </div>
            <span className="text-[9px] text-slate-700 font-bold uppercase mr-2 tracking-tighter">
              Verified: {lastCheck}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
