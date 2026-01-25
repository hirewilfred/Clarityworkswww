
import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const ServiceCard: React.FC<{ 
  title: string; 
  purpose: string;
  whatWeDo: string[];
  whatYouGet: string[];
  image: string;
}> = ({ title, purpose, whatWeDo, whatYouGet, image }) => (
  <div className="glass-panel rounded-[3.5rem] border-white/5 transition-all duration-500 hover:border-white/20 group hover:-translate-y-4 flex flex-col h-full shadow-2xl hover:shadow-[0_40px_100px_rgba(92,124,255,0.15)] overflow-hidden cursor-default">
    <div className="h-64 relative overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.7] group-hover:grayscale-0 group-hover:brightness-110 group-hover:scale-105 transition-transform duration-[1500ms] ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050614] via-[#050614]/60 to-transparent"></div>
    </div>

    <div className="p-10 lg:p-12 flex-grow flex flex-col">
      <div className="flex-grow">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-clarity-blue mb-2">Purpose: {purpose}</p>
        <h3 className="text-3xl font-black text-white mb-8 tracking-tight leading-tight">{title}</h3>
        
        <div className="space-y-8">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Core Focus</h4>
            <ul className="space-y-3">
              {whatWeDo.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-400 font-medium">
                  <i className="fas fa-arrow-right text-[10px] mt-1 text-clarity-blue/40"></i>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="pt-6 border-t border-white/5">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-clarity-blue mb-4">Strategic Value</h4>
            <ul className="space-y-3">
              {whatYouGet.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300 font-bold italic">
                  <i className="fas fa-sparkles text-[10px] mt-1 text-clarity-blue/50"></i>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Services: React.FC = () => {
  return (
    <div className="min-h-screen indigo-gradient selection:bg-blue-500/30 overflow-x-hidden">
      <SEO 
        title="Agentic AI Consulting Services" 
        description="ClarityWorks helps organizations redesign how work gets done using Agentic AI—autonomous AI systems that reason, plan, and take action."
      />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 z-10">
        <div className="fixed top-[-10%] right-[-10%] w-[1000px] h-[1000px] rounded-full pointer-events-none z-0 glow-sphere blur-[150px] bg-blue-600/5"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full mb-12">
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-clarity-blue text-white tracking-widest uppercase shadow-[0_0_20px_rgba(92,124,255,0.4)]">Consulting Practice</span>
            <span className="text-xs font-bold text-slate-400 tracking-tight uppercase tracking-widest">Autonomous Intelligence</span>
          </div>
          <h1 className="text-6xl lg:text-9xl font-black tracking-tighter text-gradient mb-12 leading-[0.9]">
            Agentic AI <br /><span className="italic text-clarity-blue">Consulting.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed mb-16 font-medium">
            Redesigning the future of work through autonomous AI systems that reason, plan, and act alongside your human workforce.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-white text-slate-900 relative z-20 rounded-t-[5rem] py-32 lg:pt-48 lg:pb-32 shadow-[0_-50px_100px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center mb-12">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-4 block">Our Philosophy</span>
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter mb-10 leading-[1.0]">Most organizations don’t need <span className="text-clarity-blue italic">more AI tools.</span></h2>
              <p className="text-xl lg:text-2xl text-slate-600 font-medium leading-relaxed">
                They need clarity on where AI fits, how it should operate, and how humans remain in control. ClarityWorks approaches Agentic AI as an operating model, not a technology experiment.
              </p>
            </div>
            <div className="bg-slate-50 p-16 rounded-[4rem] border border-slate-100 shadow-2xl relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-clarity-blue/5 rounded-bl-full"></div>
              <h3 className="text-3xl font-black mb-8 leading-tight">Strategy, workflow redesign, and <span className="text-clarity-blue italic">responsible deployment.</span></h3>
              <p className="text-slate-500 font-bold">Delivering measurable business value while strengthening—not disrupting—your teams.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Grid */}
      <section className="relative z-10 py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-4 block">Service Framework</span>
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-white">Core <span className="italic text-clarity-blue">Services.</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <ServiceCard 
              image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"
              title="Strategy & Readiness"
              purpose="Establish a clear foundation for AI adoption."
              whatWeDo={["AI maturity and readiness assessment", "Workflow and task complexity analysis", "Human vs AI role design", "Data and systems evaluation"]}
              whatYouGet={["Clear AI adoption roadmap", "Prioritized use cases", "Cost, risk, and ROI estimates"]}
            />
            <ServiceCard 
              image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200"
              title="Workflow Redesign"
              purpose="Rebuild workflows for human + AI collaboration."
              whatWeDo={["End-to-end workflow mapping", "Bottleneck and failure-point identification", "Agentic task decomposition", "Human escalation design"]}
              whatYouGet={["AI-ready workflow blueprints", "Defined human checkpoints", "Measurable efficiency improvements"]}
            />
            <ServiceCard 
              image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200"
              title="Solution Architecture"
              purpose="Design scalable, secure AI systems."
              whatWeDo={["Single vs multi-agent design", "Integration planning (CRM, ERP, ITSM)", "Memory and knowledge architecture", "Cost optimization planning"]}
              whatYouGet={["Production-ready AI architecture", "Vendor-agnostic design", "Clear implementation scope"]}
            />
            <ServiceCard 
              image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200"
              title="Custom Agent Advisory"
              purpose="Define agent behavior and responsibilities."
              whatWeDo={["Agent role definition (Sales, Support, Ops)", "Decision boundaries & autonomy levels", "Tool access and action permissions", "Failure handling logic"]}
               whatYouGet={["Clearly defined AI agent roles", "Reduced risk of AI misuse", "Trustworthy agent behavior"]}
            />
            <ServiceCard 
              image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200"
              title="Governance & Risk"
              purpose="Ensure safe and ethical AI adoption."
              whatWeDo={["AI usage and governance frameworks", "Data privacy and access controls", "Compliance alignment (SOC 2, PIPEDA)", "Internal AI policies"]}
              whatYouGet={["Reduced legal and operational risk", "Clear accountability", "Employee trust and adoption"]}
            />
            <ServiceCard 
              image="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200"
              title="AgentOps Advisory"
              purpose="Maintain AI agent reliability and efficiency."
              whatWeDo={["Agent performance monitoring", "Cost and efficiency optimization", "Drift detection and correction", "Quarterly impact reviews"]}
              whatYouGet={["Long-term AI reliability", "Sustained ROI", "Continuous improvement"]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-40 px-6 text-center">
        <div className="max-w-4xl auto">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-clarity-blue mb-6 block">Immediate Discovery</span>
          <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-12 leading-tight">Ready to explore how Agentic AI <span className="text-clarity-blue italic">fits?</span></h2>
          <p className="text-slate-400 text-xl font-medium mb-16 leading-relaxed">
            Book a discovery session to identify high-impact opportunities and define a clear path forward for your organization.
          </p>
          <Link to="/ai-assessment" className="inline-flex items-center gap-4 bg-white text-[#050614] px-12 py-6 rounded-2xl font-black text-lg hover:bg-clarity-blue hover:text-white transition-all shadow-2xl group">
            Book Discovery Session
            <i className="fas fa-calendar-check group-hover:rotate-12 transition-transform"></i>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
