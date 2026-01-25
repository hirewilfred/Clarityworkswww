
import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="min-h-screen indigo-gradient selection:bg-blue-500/30 overflow-x-hidden">
      <SEO 
        title="About ClarityWorks Studio | Strategy Before Tools" 
        description="Clarity Before Code. Strategy Before Tools. People Before Automation. We help organizations redesign how work gets done with Agentic AI."
      />

      {/* Hero Section */}
      <section className="relative pt-48 pb-24 lg:pt-64 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-10">
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-clarity-blue text-white uppercase tracking-widest">Our DNA</span>
            <span className="text-xs font-bold text-slate-400">Clarity Before Code</span>
          </div>
          <h1 className="text-6xl lg:text-9xl font-black tracking-tighter text-gradient mb-12 leading-[0.9]">
            Strategy Before <br /><span className="italic text-clarity-blue">Tools.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed mb-16 font-medium">
            ClarityWorks is an Agentic AI consulting firm that helps organizations redesign how work gets done by combining human expertise with autonomous AI agents.
          </p>
        </div>
      </section>

      {/* Why We Exist (Dark) */}
      <section className="relative z-10 px-6 pb-40">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 rounded-[4rem] blur-[80px] opacity-10 bg-clarity-blue group-hover:opacity-20 transition-opacity"></div>
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200" 
                className="relative rounded-[3.5rem] border border-white/10 shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-1000"
                alt="Strategy Session"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-tight">Most organizations are <span className="text-clarity-blue">overwhelmed</span> by AI noise.</h2>
              <div className="space-y-6 text-slate-400 text-lg leading-relaxed font-medium">
                <p>New tools promise productivity, but teams are left asking: Where does AI actually fit? What should it do? And how do we remain in control?</p>
                <p>ClarityWorks was founded to answer those questions with clarity, structure, and discipline. We focus on building practical, governed AI systems that operate alongside people to improve efficiency.</p>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div>
                  <p className="text-4xl font-black text-white mb-2">100%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Consulting First</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-white mb-2">Agentic</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Core Focus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy (White Section) */}
      <section className="bg-white text-slate-900 relative z-20 rounded-t-[5rem] py-32 lg:py-48 shadow-[0_-50px_100px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-4 block">Our Differentiation</span>
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter">What Makes Us <span className="italic text-clarity-blue">Different.</span></h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {[
              {
                title: "Consulting-First",
                desc: "We do not start with technology. We start with your workflows, your people, and your business outcomes.",
                icon: "fa-comments-alt"
              },
              {
                title: "Agentic vs. Basic",
                desc: "We design AI agents that observe, decide within boundaries, and take action—not just basic chatbots.",
                icon: "fa-microchip"
              },
              {
                title: "Amplify, Not Replace",
                desc: "AI should offload repetitive work so your teams can focus on strategy, leadership, and creativity.",
                icon: "fa-users"
              }
            ].map((item, i) => (
              <div key={i} className="p-12 bg-slate-50 rounded-[3.5rem] border border-slate-100 hover:shadow-2xl transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-clarity-blue mb-8 group-hover:bg-clarity-blue group-hover:text-white transition-all">
                  <i className={`fas ${item.icon} text-2xl`}></i>
                </div>
                <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audiences & Beliefs */}
      <section className="bg-white text-slate-900 relative z-20 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-8 block">Domain Focus</span>
              <h3 className="text-4xl font-black mb-10 tracking-tight">Who We <span className="text-clarity-blue italic">Partner With.</span></h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "SMB & Mid-Market Enterprises",
                  "Professional Services Firms",
                  "IT & Managed Service Providers",
                  "Healthcare Practices",
                  "Financial Services & Insurance",
                  "Operations-Driven Teams"
                ].map((val, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl font-bold text-sm">
                    <div className="w-2 h-2 rounded-full bg-clarity-blue"></div>
                    {val}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-12 bg-slate-900 rounded-[4rem] text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-clarity-blue/10 rounded-bl-full"></div>
              <h3 className="text-3xl font-black mb-8 leading-tight">Our Core Belief</h3>
              <p className="text-2xl font-bold italic text-slate-300 leading-tight mb-8">"The future of work is not human or AI. It is human + AI, working together."</p>
              <p className="text-slate-400 font-medium">Organizations that succeed will not be the ones with the most tools—but the ones with the clearest strategy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Cycle (Dark) */}
      <section className="relative z-10 py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-4 block">The Studio Methodology</span>
            <h2 className="text-6xl font-black text-white tracking-tighter">Every engagement follows a <span className="italic text-clarity-blue">clear model.</span></h2>
          </div>
          <div className="grid md:grid-cols-5 gap-8">
            {[
              { title: "Discover", desc: "Understand workflows & goals." },
              { title: "Design", desc: "Define Human+AI roles." },
              { title: "Build", desc: "Deploy agents incrementally." },
              { title: "Deploy", desc: "Integrate into operations." },
              { title: "Optimize", desc: "Scale and improve over time." }
            ].map((step, i) => (
              <div key={i} className="glass-panel p-8 rounded-[2.5rem] border-white/5 text-center group hover:border-white/20 transition-all">
                <div className="text-4xl font-black text-white/5 mb-4 group-hover:text-clarity-blue transition-colors">0{i+1}</div>
                <h4 className="font-black text-white mb-2">{step.title}</h4>
                <p className="text-slate-500 text-xs font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 pb-40 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-12 leading-tight">Ready for <span className="text-clarity-blue">Clarity?</span></h2>
          <p className="text-xl text-slate-400 mb-16 font-medium">If you’re exploring how Agentic AI could support your team—but want strategy before commitment—we’re here to help.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/ai-assessment" className="bg-white text-slate-900 px-12 py-6 rounded-2xl font-black hover:bg-clarity-blue hover:text-white transition-all shadow-xl">
              Book Discovery Session
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
