
import React, { useState } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const AccordionItem: React.FC<{ title: string; icon: string; children: React.ReactNode; isOpen: boolean; onClick: () => void }> = ({ title, icon, children, isOpen, onClick }) => {
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isOpen ? 'bg-clarity-blue text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-slate-400 group-hover:bg-white/10'}`}>
            <i className={`fas ${icon} text-lg`}></i>
          </div>
          <span className={`text-xl font-bold transition-colors ${isOpen ? 'text-white' : 'text-slate-400'}`}>{title}</span>
        </div>
        <i className={`fas fa-chevron-down transition-transform duration-300 ${isOpen ? 'rotate-180 text-clarity-orange' : 'text-slate-600'}`}></i>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
        <div className="pl-16 text-slate-400 leading-relaxed text-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

const ManagedIT: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const features = [
    {
      title: "24/7/365 Studio Help Desk",
      icon: "fa-headset",
      description: "Our North American support team is always on standby. We provide immediate expert assistance to keep your team productive through elite white-glove service."
    },
    {
      title: "Hybrid Cloud Orchestration",
      icon: "fa-cloud",
      description: "Scale with confidence. We manage Azure, AWS, and private environments, ensuring optimal performance for both traditional apps and AI inference workloads."
    },
    {
      title: "Disaster Recovery & Continuity",
      icon: "fa-database",
      description: "Protect your most valuable asset. Our multi-site backup strategy ensures business continuity in minutes, not days."
    },
    {
      title: "Strategic IT Roadmapping",
      icon: "fa-map-signs",
      description: "We act as your Virtual Studio Lead, aligning technical investments with your long-term business goals."
    }
  ];

  return (
    <div className="min-h-screen indigo-gradient selection:bg-blue-500/30 overflow-x-hidden pt-48">
      <SEO 
        title="Managed IT & Studio Operations" 
        description="Elite managed IT support, cloud orchestration, and business continuity by ClarityWorks Studio."
      />
      
      <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none z-0 glow-sphere blur-[100px] bg-blue-600/10"></div>

      <section className="relative pb-24 px-6 z-10">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500 text-white uppercase tracking-widest">Operationally Resilient</span>
            <span className="text-xs font-bold text-slate-400 tracking-tight">Studio Grade Managed IT</span>
          </div>
          <h1 className="text-6xl lg:text-9xl font-black tracking-tighter text-gradient mb-8 leading-[0.9]">
            Resilient <span className="italic text-clarity-blue">Infrastructure.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
            Focus on your creative and business growth while our studio handles the heavy lifting of your technical foundation with 24/7 proactive care.
          </p>
        </div>
      </section>

      {/* White Section: Service Framework */}
      <section className="bg-white text-slate-900 relative z-20 rounded-t-[5rem] py-32 shadow-[0_-50px_100px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-start">
            <div>
              <span className="inline-block px-5 py-2 rounded-full bg-clarity-blue/5 text-clarity-blue font-black text-[10px] uppercase tracking-[0.3em] mb-8">Capabilities</span>
              <h2 className="text-5xl font-black tracking-tighter mb-10 leading-[1.1]">Elite Delivery <br/><span className="text-clarity-blue italic">Framework.</span></h2>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <AccordionItem
                    key={index}
                    title={feature.title}
                    icon={feature.icon}
                    isOpen={openIndex === index}
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    {feature.description}
                  </AccordionItem>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-[4rem] blur opacity-10 group-hover:opacity-20 transition-all duration-1000 bg-clarity-blue"></div>
                <div className="relative bg-slate-50 rounded-[4rem] overflow-hidden border border-slate-100 h-[500px] shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200" 
                    className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 transition-all duration-[2000ms]"
                    alt="Operations"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
                  <div className="absolute bottom-12 left-12">
                    <p className="text-clarity-blue font-black uppercase tracking-[0.4em] text-[10px] mb-4">Studio Uptime</p>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">99.99% Guaranteed</h3>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">Response Time</p>
                  <p className="text-5xl font-black text-slate-900 tracking-tighter">15<span className="text-xl text-slate-300">min</span></p>
                </div>
                <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">Studio Staff</p>
                  <p className="text-5xl font-black text-slate-900 tracking-tighter">80<span className="text-xl text-slate-300">+</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Section: Process */}
      <section className="relative z-10 py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-4 block">The Lifecycle</span>
            <h2 className="text-6xl font-black text-white tracking-tighter">Studio <span className="text-clarity-blue italic">Implementation.</span></h2>
          </div>
          <div className="grid md:grid-cols-4 gap-12">
            {[
              { step: "01", title: "Audit", icon: "fa-comments", desc: "Elite discovery of your current stack." },
              { step: "02", title: "Design", icon: "fa-drafting-compass", desc: "Building a scalable AI foundation." },
              { step: "03", title: "Deploy", icon: "fa-rocket", desc: "Zero-downtime implementation." },
              { step: "04", title: "Scale", icon: "fa-tools", desc: "24/7 proactive Studio maintenance." }
            ].map(item => (
              <div key={item.step} className="group glass-panel p-10 rounded-[3rem] border-white/5 text-center hover:border-white/20 transition-all hover:-translate-y-2">
                <div className="text-5xl font-black text-white/10 mb-6 group-hover:text-clarity-blue transition-colors">{item.step}</div>
                <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto flex items-center justify-center mb-8 border border-white/10 group-hover:bg-clarity-blue transition-all">
                  <i className={`fas ${item.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="font-black text-white text-lg mb-4">{item.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManagedIT;
