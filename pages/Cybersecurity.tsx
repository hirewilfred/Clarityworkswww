
import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const Cybersecurity: React.FC = () => {
  return (
    <div className="min-h-screen indigo-gradient selection:bg-blue-500/30 overflow-x-hidden pt-48">
      <SEO 
        title="ZeroTrust Security Studio" 
        description="Elite ZeroTrust architecture, identity protection, and real-time threat response by ClarityWorks Studio."
      />
      
      <div className="fixed top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full pointer-events-none z-0 glow-sphere blur-[120px] bg-blue-600/10"></div>

      <section className="relative pb-24 px-6 z-10">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-clarity-blue text-white uppercase tracking-widest">Enterprise Defense</span>
            <span className="text-xs font-bold text-slate-400 tracking-tight">ZeroTrust Studio Architecture</span>
          </div>
          <h1 className="text-6xl lg:text-9xl font-black tracking-tighter text-gradient mb-8 leading-[0.9]">
            Never Trust. <br /><span className="italic text-clarity-orange">Always Verify.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
            ClarityWorks Studio assumes breach and verifies every request, ensuring your critical data and AI weights remain vaulted behind identity-centric security.
          </p>
        </div>
      </section>

      {/* White Section: Defense Framework */}
      <section className="bg-white text-slate-900 relative z-20 rounded-t-[5rem] py-40 shadow-[0_-50px_100px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center mb-32">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-6 block">Defense in Depth</span>
              <h2 className="text-5xl lg:text-7xl font-black tracking-tight mb-8 leading-[0.9]">Sleep better knowing your data is <span className="italic text-clarity-orange">vaulted.</span></h2>
              <p className="text-xl text-slate-500 leading-relaxed font-medium">
                We combine studio-grade engineering with ZeroTrust frameworks to create a security posture that doesn't just block attacks—it renders them irrelevant.
              </p>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 rounded-[4rem] blur-[60px] opacity-10 bg-clarity-blue group-hover:opacity-20 transition-all duration-1000"></div>
              <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl border-slate-100 border">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2000ms]" 
                  alt="Security"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Identity Governance", icon: "fa-fingerprint", desc: "Granular access controls and MFA across all entry points." },
              { title: "Micro-Segmentation", icon: "fa-network-wired", desc: "Isolating workloads to prevent lateral movement of threats." },
              { title: "Behavioral AI Analysis", icon: "fa-eye", desc: "AI-driven detection that identifies anomalies before data exfiltration." },
              { title: "Endpoint Security", icon: "fa-microchip", desc: "Securing every device that touches your Studio network." },
              { title: "Data Encapsulation", icon: "fa-vault", desc: "Ensuring sensitive intellectual property is encrypted and audited." },
              { title: "Threat Hunting", icon: "fa-radar", desc: "Proactive investigation into hidden indicators of compromise." }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 hover:shadow-xl transition-all group flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-clarity-blue/10 flex items-center justify-center text-clarity-blue mb-8 group-hover:bg-clarity-blue group-hover:text-white transition-all">
                  <i className={`fas ${feature.icon} text-xl`}></i>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-grow font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Final CTA */}
      <section className="relative z-10 py-40 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-black text-white tracking-tighter mb-12">Protect your <span className="text-clarity-blue">Autonomous Future.</span></h2>
          <Link to="/ai-assessment" className="inline-flex items-center gap-4 bg-white text-[#050614] px-12 py-6 rounded-2xl font-black text-lg hover:bg-clarity-blue hover:text-white transition-all shadow-2xl">
            Start Security Audit
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Cybersecurity;
