
import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const CaseStudyCard: React.FC<{
  category: string;
  title: string;
  desc: string;
  result: string;
  image: string;
  isLight?: boolean;
}> = ({ category, title, desc, result, image, isLight }) => (
  <div className={`glass-panel rounded-[3.5rem] border-white/5 transition-all duration-700 hover:border-white/20 group hover:-translate-y-4 flex flex-col h-full shadow-2xl overflow-hidden ${isLight ? 'bg-white border-slate-100 text-slate-900 shadow-xl' : ''}`}>
    <div className="h-64 relative overflow-hidden">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.8] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-[1500ms] ease-out"
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? 'from-white via-white/40' : 'from-[#050614] via-[#050614]/40'} to-transparent`}></div>
    </div>

    <div className="p-10 lg:p-12 flex-grow flex flex-col">
      <div className="flex-grow">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-clarity-blue mb-4">{category}</p>
        <h3 className={`text-2xl font-black mb-6 tracking-tight leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>{title}</h3>
        <p className={`text-sm mb-8 leading-relaxed font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{desc}</p>
      </div>
      <div className={`mt-auto pt-8 border-t ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
        <p className="text-[10px] font-black uppercase tracking-widest text-clarity-orange mb-2">Measured Outcome</p>
        <p className={`text-xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{result}</p>
      </div>
    </div>
  </div>
);

const CaseStudies: React.FC = () => {
  return (
    <div className="min-h-screen indigo-gradient selection:bg-blue-500/30 overflow-x-hidden">
      <SEO
        title="AI Case Studies | Realtors, Dentists & Automation"
        description="Discover how ClarityWorks Studio transforms real estate, dental practices, and modern businesses with agentic AI and intelligent automation."
      />

      {/* FULL-BLEED CINEMATIC SPOTLIGHT: Real Estate */}
      <section className="relative min-h-screen flex items-center px-6 z-10 overflow-hidden">
        {/* Full Bleed Background Image */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2400"
            className="w-full h-full object-cover grayscale contrast-125 brightness-[0.25] scale-105"
            alt="Luxury Real Estate"
          />
          {/* Deep Gradient Masks */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050614] via-transparent to-[#050614]"></div>
          <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#050614] via-[#050614]/80 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full py-32 lg:py-48">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full mb-12 backdrop-blur-md">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-clarity-blue text-white tracking-widest uppercase shadow-lg shadow-blue-500/20">Studio Feature</span>
              <span className="text-xs font-bold text-slate-300 tracking-tight uppercase tracking-widest">Elevate Realty Group</span>
            </div>

            <h1 className="text-6xl lg:text-[11rem] font-black tracking-tighter text-gradient mb-12 leading-[0.8] animate-in fade-in slide-in-from-left-12 duration-1000">
              Property <br /><span className="italic text-clarity-blue">Velocity.</span>
            </h1>

            <div className="grid lg:grid-cols-5 gap-16 items-start">
              <div className="lg:col-span-3">
                <p className="text-xl lg:text-3xl text-slate-300 leading-relaxed mb-12 font-medium">
                  We built a custom AI agent for Elevate Realty that instantly handles property inquiries, matches buyers to listings, and schedules viewings autonomously 24/7.
                </p>
                <div className="flex flex-wrap gap-16">
                  <div className="group">
                    <p className="text-7xl font-black text-white group-hover:text-clarity-blue transition-colors duration-500">3x</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">Lead Conversion Rate</p>
                  </div>
                  <div className="h-20 w-px bg-white/10 hidden sm:block"></div>
                  <div className="group">
                    <p className="text-7xl font-black text-white group-hover:text-clarity-blue transition-colors duration-500">0min</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">Response Time</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 pt-4">
                <div className="glass-panel p-10 rounded-[3.5rem] border-white/10 backdrop-blur-3xl shadow-2xl relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-clarity-blue/10 rounded-bl-full"></div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-clarity-blue/20 flex items-center justify-center">
                      <i className="fas fa-quote-left text-clarity-blue text-xs"></i>
                    </div>
                    <div>
                      <p className="font-black text-white text-sm">Marcus Vance</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Principal Broker</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed font-bold italic">
                    "Our agents used to spend hours qualifying leads and playing phone tag. The AI now does the heavy lifting, serving up ready-to-close clients straight to our calendars."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section - Dental */}
      <section className="bg-white text-slate-900 relative z-20 rounded-t-[5rem] py-32 lg:py-48 shadow-[0_-50px_100px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-6 block">Healthcare Automation</span>
              <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.95]">Intelligent <br /><span className="text-clarity-blue italic">Patient Care.</span></h2>
              <p className="text-slate-600 text-xl font-medium leading-relaxed mb-12">
                We deployed an intelligent voice and SMS scheduling assistant for SmileCare Dental, eliminating front-desk bottlenecks and missed appointments.
              </p>
              <div className="space-y-8">
                {[
                  { title: "Smart Scheduling & Rescheduling", desc: "AI autonomously books, modifies, and cancels appointments directly within the existing EMR system." },
                  { title: "Post-Op Follow-up", desc: "Automated check-ins ensure patients follow recovery protocols, escalating only complex issues to human staff." },
                  { title: "No-Show Reduction", desc: "Predictive reminders and frictionless digital rescheduling reduced empty chair time dramatically." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-clarity-blue group-hover:text-white transition-all duration-500">
                      <i className="fas fa-tooth text-xs"></i>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-[4rem] overflow-hidden shadow-2xl bg-slate-100 aspect-square group">
              <img
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2000ms]"
                alt="Modern Dental Clinic"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-12 left-12 right-12">
                <p className="text-[10px] font-black uppercase tracking-widest text-clarity-blue mb-2">Technical Implementation</p>
                <h3 className="text-3xl font-black text-white">Voice & SMS Agents</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="relative z-10 py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-4 block">Industry Solutions</span>
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-white">Transforming <span className="italic text-clarity-blue">Business.</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <CaseStudyCard
              category="Real Estate"
              title="Luxury Property Matchmaker"
              desc="Deploying an AI assistant that learned property portfolios to instantly match high-net-worth buyers with unlisted estates."
              result="40% Faster Closing"
              image="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
            />
            <CaseStudyCard
              category="Dental Practice"
              title="Orthodontic Patient Acquisition"
              desc="An automated funnel that educates prospective patients 24/7, answering specific treatment questions and booking free consultations."
              result="65% More Consults"
              image="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800"
            />
            <CaseStudyCard
              category="Trending: AI Content"
              title="Automated Content Agency"
              desc="Integrating AI for a trending digital brand to completely automate video script generation, voiceover creation, and social distribution."
              result="10x Content Output"
              image="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800"
            />
          </div>
        </div>
      </section>

      {/* Final CTA Bridge */}
      <section className="relative z-10 py-20 pb-40 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-12">Ready to evolve your <span className="text-clarity-blue">Business?</span></h2>
          <Link to="/ai-assessment" className="inline-flex items-center gap-4 bg-white text-[#050614] px-12 py-6 rounded-2xl font-black text-lg hover:bg-clarity-blue hover:text-white transition-all shadow-2xl">
            Start Strategy Discovery
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;
