
import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const TrainingCard: React.FC<{
  image: string;
  title: string;
  desc: string;
  bullets: string[];
  delay: string;
}> = ({ image, title, desc, bullets, delay }) => (
  <div className={`glass-panel rounded-[3.5rem] border-white/5 transition-all duration-700 hover:border-white/20 group hover:-translate-y-4 flex flex-col h-full shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-12 ${delay}`}>
    <div className="h-80 relative overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.7] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-[1500ms] ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050614] via-[#050614]/40 to-transparent"></div>
      <div className="absolute bottom-6 left-6 right-6">
        <div className="inline-flex px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
          <span className="text-[9px] font-black text-white uppercase tracking-widest">Enrolling Now</span>
        </div>
      </div>
    </div>

    <div className="p-10 lg:p-12 flex-grow flex flex-col">
      <div className="flex-grow">
        <h3 className="text-3xl font-black text-white mb-6 tracking-tight leading-tight group-hover:text-clarity-blue transition-colors duration-500">{title}</h3>
        <p className="text-slate-400 mb-8 leading-relaxed font-medium text-sm">{desc}</p>
        <ul className="space-y-4 mb-10">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-xs font-bold text-slate-300 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-clarity-blue mt-1.5 group-hover:scale-150 transition-transform duration-500"></div>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <Link to="/ai-assessment" className="w-full py-5 rounded-2xl bg-white/5 text-white font-black uppercase tracking-widest text-xs text-center hover:bg-clarity-blue hover:shadow-xl transition-all border border-white/10">
        Secure Seat
      </Link>
    </div>
  </div>
);

const Training: React.FC = () => {
  return (
    <div className="min-h-screen indigo-gradient selection:bg-blue-500/30 overflow-x-hidden">
      <SEO 
        title="AI Training & Workshops | Studio Enablement" 
        description="Empower your leadership and teams with executive briefings, AI literacy, and governance training by ClarityWorks Studio."
      />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 z-10">
        <div className="fixed top-[-10%] right-[-10%] w-[1000px] h-[1000px] rounded-full pointer-events-none z-0 glow-sphere blur-[150px] bg-blue-600/5"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full mb-12">
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-clarity-blue text-white tracking-widest uppercase shadow-[0_0_20px_rgba(92,124,255,0.4)]">Knowledge Transfer</span>
            <span className="text-xs font-bold text-slate-400 tracking-tight uppercase tracking-widest">Studio Grade Enablement</span>
          </div>
          <h1 className="text-6xl lg:text-9xl font-black tracking-tighter text-gradient mb-12 leading-[0.9]">
            Intelligence <br /><span className="italic text-clarity-blue">Enablement.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-16 font-medium">
            Bridging the gap between raw AI capability and operational excellence. We train your human workforce to orchestrate the autonomous future.
          </p>
        </div>
      </section>

      {/* Workshop Cards Section */}
      <section className="relative z-10 py-32 lg:pb-48 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-4 block">Studio Curriculum</span>
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-white">Human + AI <span className="italic text-clarity-blue">Mastery.</span></h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            <TrainingCard 
              image="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200"
              title="Executive AI Briefings"
              desc="Strategic sessions designed for C-Suite and Board members to navigate the risk, ROI, and long-term impact of Agentic AI."
              bullets={["Feasibility Audits", "Investment Roadmaps", "Competitive Analysis"]}
              delay="delay-0"
            />
            <TrainingCard 
              image="https://images.unsplash.com/photo-1542744173-8e7e5381bb6e?auto=format&fit=crop&q=80&w=1200"
              title="Team AI Enablement"
              desc="Hands-on workshops to empower department heads and managers to identify and deploy autonomous workflows."
              bullets={["Workflow Redesign", "Tool Integration", "Productivity Metrics"]}
              delay="delay-200"
            />
            <TrainingCard 
              image="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200"
              title="AI Literacy Workshops"
              desc="Non-technical training for the entire workforce to foster trust and encourage adoption of AI tools across the org."
              bullets={["Prompt Engineering", "Hallucination Safety", "AI Ethics Basics"]}
              delay="delay-400"
            />
          </div>
        </div>
      </section>

      {/* Engagement Models (White) */}
      <section className="bg-white text-slate-900 relative z-20 rounded-t-[5rem] py-32 lg:py-48 shadow-[0_-50px_100px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-6 block">Engagement Models</span>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-8 leading-tight">Tailored Studio <br /><span className="text-clarity-blue italic">Sessions.</span></h2>
              <p className="text-slate-600 text-xl font-medium leading-relaxed mb-12">
                Whether it's a 2-hour high-level discovery or a multi-day technical deep dive, our workshops are built to deliver immediate actionable value.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "The Briefing", time: "2 Hours", desc: "Feasibility and ROI overview for leadership." },
                  { title: "The Blueprint", time: "1-2 Days", desc: "Detailed technical mapping of AI agents." },
                  { title: "The Workforce", time: "Weekly", desc: "Continuous training and AgentOps support." }
                ].map((tier, i) => (
                  <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:bg-white transition-all hover:shadow-xl">
                    <div>
                      <p className="text-[10px] font-black text-clarity-blue uppercase tracking-widest mb-1">{tier.time}</p>
                      <h4 className="text-lg font-black text-slate-900">{tier.title}</h4>
                      <p className="text-slate-500 text-sm font-medium">{tier.desc}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-clarity-blue group-hover:text-white transition-all">
                      <i className="fas fa-arrow-right text-xs"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 rounded-[4rem] blur-[60px] opacity-10 bg-clarity-blue group-hover:opacity-20 transition-all duration-1000"></div>
              <div className="relative bg-white rounded-[4rem] p-4 overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
                  className="rounded-[3rem] grayscale group-hover:grayscale-0 transition-all duration-[2000ms]"
                  alt="Workshop Session"
                />
                <div className="absolute bottom-12 left-12 p-8 bg-white/90 rounded-3xl backdrop-blur-3xl shadow-2xl">
                   <p className="text-slate-900 text-2xl font-black mb-1">Human-Centric</p>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Training Philosophy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-40 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-12 leading-tight">Build an <span className="text-clarity-blue">Elite Workforce.</span></h2>
          <Link to="/ai-assessment" className="inline-flex items-center gap-4 bg-white text-[#050614] px-12 py-6 rounded-2xl font-black text-lg hover:bg-clarity-blue hover:text-white transition-all shadow-2xl group">
            Book Workshop Discovery
            <i className="fas fa-calendar-alt group-hover:rotate-12 transition-transform"></i>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Training;
