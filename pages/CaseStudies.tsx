
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
        title="Winery & Agriculture AI Case Studies" 
        description="Discover how ClarityWorks Studio transforms boutique wineries and agricultural estates using Agentic AI and autonomous viticulture logic."
      />

      {/* FULL-BLEED CINEMATIC SPOTLIGHT: Kingstead Winery */}
      <section className="relative min-h-screen flex items-center px-6 z-10 overflow-hidden">
        {/* Full Bleed Vineyard Background Image */}
        <div className="absolute inset-0 pointer-events-none z-0">
           <img 
             src="https://images.unsplash.com/photo-1506377247377-2a5b3b0ca3ef?auto=format&fit=crop&q=80&w=2400" 
             className="w-full h-full object-cover grayscale contrast-125 brightness-[0.25] scale-105" 
             alt="Scenic Vineyard at Golden Hour"
           />
           {/* Deep Gradient Masks */}
           <div className="absolute inset-0 bg-gradient-to-b from-[#050614] via-transparent to-[#050614]"></div>
           <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#050614] via-[#050614]/80 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 w-full py-32 lg:py-48">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full mb-12 backdrop-blur-md">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-clarity-blue text-white tracking-widest uppercase shadow-lg shadow-blue-500/20">Studio Feature</span>
              <span className="text-xs font-bold text-slate-300 tracking-tight uppercase tracking-widest">Kingstead Winery & Estate</span>
            </div>
            
            <h1 className="text-6xl lg:text-[11rem] font-black tracking-tighter text-gradient mb-12 leading-[0.8] animate-in fade-in slide-in-from-left-12 duration-1000">
              Harvest <br /><span className="italic text-clarity-blue">Autonomy.</span>
            </h1>

            <div className="grid lg:grid-cols-5 gap-16 items-start">
              <div className="lg:col-span-3">
                <p className="text-xl lg:text-3xl text-slate-300 leading-relaxed mb-12 font-medium">
                  We engineered an autonomous intelligence layer for Kingstead Winery to orchestrate complex harvest logistics, fermentation safety, and multi-region export compliance.
                </p>
                <div className="flex flex-wrap gap-16">
                  <div className="group">
                    <p className="text-7xl font-black text-white group-hover:text-clarity-blue transition-colors duration-500">42%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">Operational Yield</p>
                  </div>
                  <div className="h-20 w-px bg-white/10 hidden sm:block"></div>
                  <div className="group">
                    <p className="text-7xl font-black text-white group-hover:text-clarity-blue transition-colors duration-500">2.4k</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">Annual Labor Hours Reclaimed</p>
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
                      <p className="font-black text-white text-sm">Linda Kingstead</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Proprietor, Oak & Vine</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed font-bold italic">
                    "The autonomous agents deployed by ClarityWorks Studio have become the backbone of our cellar operations. We are now scaling without sacrificing the soul of our vintage."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="bg-white text-slate-900 relative z-20 rounded-t-[5rem] py-32 lg:py-48 shadow-[0_-50px_100px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-6 block">Viticulture Logic</span>
              <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.95]">Predictive Cellar <br/><span className="text-clarity-blue italic">Engineering.</span></h2>
              <p className="text-slate-600 text-xl font-medium leading-relaxed mb-12">
                We converted legacy vineyard tribal knowledge into a multi-agent framework that predicts peak-ripeness windows and flags cellar risks in real-time.
              </p>
              <div className="space-y-8">
                {[
                  { title: "Brix & Ripeness Monitoring", desc: "Autonomous drones and sensors feeding Agentic logic to pinpoint harvest within a 4-hour window." },
                  { title: "Automated Compliance", desc: "Agents that manage global export documents and chemical residue certifications autonomously." },
                  { title: "Direct-to-Consumer Concierge", desc: "Luxury AI agents providing bespoke tasting experiences and personalized cellar management for VIP members." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-clarity-blue group-hover:text-white transition-all duration-500">
                      <i className="fas fa-leaf text-xs"></i>
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
                  src="https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?auto=format&fit=crop&q=80&w=1200" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2000ms]"
                  alt="Winemaking Laboratory"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-12 left-12 right-12">
                   <p className="text-[10px] font-black uppercase tracking-widest text-clarity-blue mb-2">Technical Implementation</p>
                   <h3 className="text-3xl font-black text-white">Agentic Vineyard Analytics</h3>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Boutique Portfolio Section */}
      <section className="relative z-10 py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-4 block">Agricultural Vertical</span>
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-white">Agricultural <span className="italic text-clarity-blue">Success.</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <CaseStudyCard 
              category="Orchard Management"
              title="Sun-Drenched Estates: Robotic Orchestration"
              desc="Deploying Agentic AI to manage autonomous harvesting fleets across 500+ acres of organic stone fruit."
              result="35% Waste Reduction"
              image="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800"
            />
            <CaseStudyCard 
              category="Dairy Technology"
              title="Alpine Dairy: Precision Health Node"
              desc="Real-time biological monitoring and autonomous nutrition adjustments for heritage dairy operations."
              result="98% Health Uptime"
              image="https://images.unsplash.com/photo-1547448415-e9f5b28e570d?auto=format&fit=crop&q=80&w=800"
            />
            <CaseStudyCard 
              category="Luxury Hospitality"
              title="Estate Concierge: Digital Butler"
              desc="AI agents managing visitor logistics and personalized wine pairings for luxury vineyard retreats."
              result="5x Member Growth"
              image="https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&q=80&w=800"
            />
          </div>
        </div>
      </section>

      {/* Final CTA Bridge */}
      <section className="relative z-10 py-20 pb-40 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-12">Ready to evolve your <span className="text-clarity-blue">Estate?</span></h2>
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
