
import React from 'react';
import SEO from '../components/SEO';
import FAQ from '../components/FAQ';
import type { FAQItem } from '../components/FAQ';
import { Link } from 'react-router-dom';

const pricingFAQs: FAQItem[] = [
  { question: "What's included in the Foundation Essentials package?", answer: "The $2,500 Foundation Essentials package includes an AI Readiness Assessment, redesign of 2 priority workflows, 1 custom AI agent with a single tool, a light knowledge base of up to 20 documents, a basic governance template, and training for up to 10 staff. Delivered in approximately 2 weeks." },
  { question: "Do you offer payment plans or monthly billing?", answer: "Our consulting packages are one-time fixed-fee engagements. For ongoing support, we offer AgentOps Managed Service plans starting at $750/month that include agent monitoring, optimization, and continuous improvement." },
  { question: "What's the difference between a one-time package and AgentOps?", answer: "One-time packages (Foundation, Catalyst, Digital Workforce) cover the initial strategy, design, and deployment of AI agents. AgentOps Managed Service is an ongoing monthly subscription for monitoring, tuning, and optimizing agents after deployment." },
  { question: "Can I start small and scale up later?", answer: "Absolutely. Most clients start with Foundation Essentials to prove value with quick wins, then scale to Operational Catalyst or Digital Workforce as they see measurable results. Each tier builds on the previous one." },
  { question: "What ROI can I expect from these packages?", answer: "Foundation Essentials typically saves 5-10 hours per week. Operational Catalyst delivers 20-40% reduction in admin workload. Digital Workforce can reduce low-impact tasks by 40-60%, enabling you to scale without adding headcount." },
  { question: "Do you offer custom pricing for enterprise clients?", answer: "Yes. The Digital Workforce package at $12.5k+ is our starting point for enterprise engagements. For larger deployments spanning multiple departments or requiring custom integrations, we create tailored proposals based on scope and complexity." },
  { question: "What does the web development pricing include?", answer: "Our web development packages start at $2,500 for a responsive 5-page website with CMS and lead capture. The Growth tier at $6,500 includes custom web applications with database architecture and API integrations. The Pro tier at $12.5k+ covers cross-platform mobile apps with advanced admin panels." },
];

const PricingCard: React.FC<{
  tier: string;
  name: string;
  price: string;
  timeline: string;
  bestFor: string;
  deliverables: string[];
  outcomes: string[];
  accentColor: string;
  isPopular?: boolean;
  isLight?: boolean;
}> = ({ tier, name, price, timeline, bestFor, deliverables, outcomes, accentColor, isPopular, isLight }) => (
  <div className={`relative rounded-[3.5rem] p-10 lg:p-12 flex flex-col h-full transition-all duration-700 group hover:-translate-y-4 ${isLight ? 'bg-white border-2 border-slate-300 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.2)] hover:shadow-[0_45px_100px_-20px_rgba(0,0,0,0.3)]' : 'glass-panel border-2 border-white/20 hover:border-white/30 shadow-2xl shadow-black/50'}`}>
    {isPopular && (
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-clarity-blue text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl z-10">
        Most Popular Choice
      </div>
    )}
    
    <div className="mb-10">
      {/* Tier label removed */}
      <h3 className={`text-3xl font-black mb-2 tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>{name}</h3>
      <div className="flex items-baseline gap-2 mb-4">
        <span className={`text-5xl font-black ${isLight ? 'text-clarity-blue' : 'text-gradient'}`}>{price}</span>
        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">one-time</span>
      </div>
      <div className="flex items-center gap-4 text-slate-400 text-sm font-bold">
        <div className="flex items-center gap-2">
          <i className="fas fa-calendar-alt text-clarity-blue"></i>
          <span>{timeline}</span>
        </div>
      </div>
    </div>

    <div className={`mb-10 rounded-3xl p-6 border ${isLight ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Ideal For</p>
      <p className={`text-sm font-bold leading-tight ${isLight ? 'text-slate-700' : 'text-white'}`}>{bestFor}</p>
    </div>

    <div className="space-y-8 flex-grow">
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-clarity-blue mb-4">Deliverables</h4>
        <ul className="space-y-3">
          {deliverables.map((item, i) => (
            <li key={i} className={`flex items-start gap-3 text-sm font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <i className="fas fa-check-circle text-[10px] mt-1 text-clarity-blue/50"></i>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={`pt-6 border-t ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-clarity-orange mb-4">Typical Outcomes</h4>
        <ul className="space-y-3">
          {outcomes.map((item, i) => (
            <li key={i} className={`flex items-start gap-3 text-sm font-bold italic ${isLight ? 'text-slate-500' : 'text-slate-300'}`}>
              <i className="fas fa-sparkles text-[10px] mt-1 text-clarity-orange/50"></i>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <Link
      to="/ai-audit"
      className={`mt-12 w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-center transition-all ${isPopular ? 'bg-clarity-blue text-white shadow-2xl hover:bg-blue-600' : isLight ? 'bg-slate-900 text-white hover:bg-clarity-blue' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}
    >
      Start Free Audit
    </Link>
  </div>
);

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen indigo-gradient selection:bg-blue-500/30 overflow-x-hidden">
      <SEO
        title="AI Pricing & Studio Packages"
        description="Transparent pricing for AI Essentials, Growth, and Agentic Workforce deployment."
        schema={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ItemList",
              "name": "ClarityWorks Studio Pricing Plans",
              "itemListElement": [
                { "@type": "Offer", "position": 1, "name": "Foundation Essentials", "price": "2500", "priceCurrency": "CAD", "description": "AI Readiness Assessment, 2 workflow redesigns, 1 custom AI agent, training for up to 10 staff. Delivered in 2 weeks.", "seller": { "@type": "Organization", "name": "ClarityWorks Studio" } },
                { "@type": "Offer", "position": 2, "name": "Operational Catalyst", "price": "6500", "priceCurrency": "CAD", "description": "Deep workflow discovery for 4-6 workflows, 2-3 custom AI agents, CRM/ticketing integrations, analytics dashboard. Delivered in 4-6 weeks.", "seller": { "@type": "Organization", "name": "ClarityWorks Studio" } },
                { "@type": "Offer", "position": 3, "name": "Digital Workforce", "price": "12500", "priceCurrency": "CAD", "description": "Redesign of 8-12 business processes, 4-7 custom AI agents, full multi-agent system, AgentOps monitoring. Delivered in 8-12 weeks.", "seller": { "@type": "Organization", "name": "ClarityWorks Studio" } }
              ]
            },
            {
              "@type": "FAQPage",
              "mainEntity": pricingFAQs.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } }))
            }
          ]
        }}
      />

      {/* Dark Section 1: Hero */}
      <section className="relative pt-48 pb-32 px-6 z-10">
        <div className="fixed top-[-10%] right-[-10%] w-[1000px] h-[1000px] rounded-full pointer-events-none z-0 glow-sphere blur-[150px] bg-blue-600/5"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full mb-12">
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-clarity-blue text-white tracking-widest uppercase">Pricing Architecture</span>
            <span className="text-xs font-bold text-slate-400 tracking-tight">Tailored for Business Velocity</span>
          </div>
          <h1 className="text-6xl lg:text-9xl font-black tracking-tighter text-gradient mb-12 leading-[0.9]">
            AI Consulting <br /><span className="italic text-clarity-blue">Pricing.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
            Deploy autonomous excellence without enterprise bureaucracy. Transparent, fixed-fee implementation cycles designed for rapid ROI.
          </p>
        </div>
      </section>

      {/* White Section 1: Primary Packages */}
      <section className="bg-white text-slate-900 relative z-20 rounded-t-[5rem] py-32 lg:py-48 shadow-[0_-50px_100px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-10">
            <PricingCard 
              tier=""
              name="Foundation Essentials"
              price="$2,500"
              timeline="2 Weeks"
              accentColor="bg-slate-700"
              isLight={true}
              bestFor="Businesses wanting quick wins and light automation without system overhauls."
              deliverables={[
                "AI Readiness Assessment",
                "Redesign of 2 priority workflows",
                "1 Custom AI Agent (Single Tool)",
                "Light knowledge base (20 docs)",
                "Basic governance template",
                "Training for up to 10 staff"
              ]}
              outcomes={[
                "5–10 hours/week saved instantly",
                "Better client engagement",
                "Faster task turnaround"
              ]}
            />

            <PricingCard 
              tier=""
              name="Operational Catalyst"
              price="$6,500"
              timeline="4–6 Weeks"
              accentColor="bg-clarity-blue"
              isPopular
              isLight={true}
              bestFor="Organizations ready to automate multiple repetitive processes across a department."
              deliverables={[
                "Deep workflow discovery (4–6 workflows)",
                "2–3 Custom AI Agents",
                "Integrations with core tools (CRM/Ticketing)",
                "Expanded knowledge base (100 docs)",
                "Multi-Agent Collaboration",
                "Analytics dashboard",
                "Governance + AI usage policies"
              ]}
              outcomes={[
                "20–40% reduction in admin workload",
                "More sales activity without hiring",
                "Improved service response times",
                "Consistency and fewer errors"
              ]}
            />

            <PricingCard 
              tier=""
              name="Digital Workforce"
              price="$12.5k+"
              timeline="8–12 Weeks"
              accentColor="bg-indigo-600"
              isLight={true}
              bestFor="Businesses looking to deploy AI as a true digital workforce across multiple functions."
              deliverables={[
                "Redesign of 8–12 business processes",
                "4–7 Custom AI Agents",
                "Full multi-agent system (Coordinator + Specialists)",
                "Full CRM + ERP + HR integrations",
                "Vector knowledge base (Unlimited)",
                "AgentOps monitoring dashboard",
                "Monthly optimization for 3 months"
              ]}
              outcomes={[
                "40–60% reduction in low-impact tasks",
                "Scale without adding headcount",
                "Faster back-office operations",
                "Reduced cost to serve clients"
              ]}
            />
          </div>
        </div>
      </section>

      {/* White Section 1.5: Web & App Dev Packages */}
      <section className="bg-slate-50 text-slate-900 relative z-20 py-32 lg:py-48 shadow-[0_-50px_100px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-4 block">Digital Presence</span>
             <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-slate-900">Website & App <span className="text-clarity-blue italic">Development.</span></h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-10">
            <PricingCard 
              tier=""
              name="Starter: Web & MVP App"
              price="$2,500"
              timeline="2-4 Weeks"
              accentColor="bg-slate-700"
              isLight={true}
              bestFor="Businesses needing a professional web presence or a simple MVP application."
              deliverables={[
                "Responsive Website Design (up to 5 pages)",
                "Basic CMS Setup",
                "Contact Forms & Lead Capture",
                "Mobile-Optimized Layout"
              ]}
              outcomes={[
                "Strong Digital Presence",
                "Increased Lead Generation"
              ]}
            />
            <PricingCard 
              tier=""
              name="Growth: Custom Platform"
              price="$6,500"
              timeline="6-8 Weeks"
              accentColor="bg-clarity-blue"
              isPopular
              isLight={true}
              bestFor="Growing businesses that need web applications with dynamic content and database integrations."
              deliverables={[
                "Custom Web Application",
                "Database Architecture & Setup",
                "User Authentication",
                "API Integrations (e.g., Stripe, CRM)"
              ]}
              outcomes={[
                "Streamlined Operations",
                "Scalable Growth Platform"
              ]}
            />
            <PricingCard 
              tier=""
              name="Pro: Enterprise Apps"
              price="$12.5k+"
              timeline="10-14 Weeks"
              accentColor="bg-indigo-600"
              isLight={true}
              bestFor="Businesses needing comprehensive, cross-platform apps (Web, iOS, Android) with complex workflows."
              deliverables={[
                "Cross-Platform Mobile App (iOS & Android)",
                "Advanced Web Application Dashboard",
                "Complex Database Architecture",
                "Custom Admin Panel"
              ]}
              outcomes={[
                "Complete Digital Ecosystem",
                "Enhanced Customer Engagement & Retention"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Dark Section 2: Managed Service Section */}
      <section className="relative z-10 py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-4 block">Continuity Support</span>
             <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-white">AgentOps <span className="text-clarity-orange">Managed Service.</span></h2>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { 
                tier: "", 
                name: "Essentials", 
                price: "$750", 
                features: ["Monitoring for up to 2 agents", "Monthly tuning + improvements", "Error handling review", "AI training refresh", "Efficiency reports"] 
              },
              { 
                tier: "", 
                name: "Professional", 
                price: "$1,500", 
                accent: true,
                features: ["Up to 5 agents", "Weekly optimization cycles", "Full CRM/ERP support", "Advanced analytics dashboard", "SLA: 24–48h turnaround", "Quarterly workflow redesign"] 
              },
              { 
                tier: "", 
                name: "Premium", 
                price: "$2,500", 
                features: ["Up to 10 agents", "Real-time monitoring", "Dedicated AI specialist", "Custom workflows + retraining", "4-hour SLA", "Full quarterly impact assessment"] 
              }
            ].map((pkg, i) => (
              <div key={i} className={`p-12 glass-panel rounded-[3.5rem] transition-all duration-700 border-2 shadow-2xl shadow-black/50 ${pkg.accent ? 'bg-clarity-blue/5 border-clarity-blue/40' : 'border-white/20 hover:border-white/30'}`}>
                {/* pkg.tier removed */}
                <h3 className="text-3xl font-black text-white mb-4">{pkg.name}</h3>
                <div className="flex items-baseline gap-2 mb-10">
                  <span className="text-5xl font-black text-white">{pkg.price}</span>
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">/ month</span>
                </div>
                <ul className="space-y-4 mb-12">
                  {pkg.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-slate-400 font-bold text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-clarity-blue"></div>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 rounded-xl border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all">
                  Select Managed Tier
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* White Section 2: Add-Ons */}
      <section className="bg-white text-slate-900 relative z-20 rounded-t-[5rem] py-32 lg:py-48 shadow-[0_-50px_100px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-4 block">Flexibility First</span>
              <h2 className="text-5xl font-black tracking-tighter mb-8 leading-tight">Add-On <span className="text-clarity-blue italic">Ecosystem.</span></h2>
              <p className="text-slate-600 text-lg font-medium leading-relaxed">Customize your studio deployment with specific enhancements tailored to your growing technical requirements.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: "Extra AI Agents", price: "$1k – $3.5k", desc: "Complex integration focus" },
                { title: "System Integrations", price: "$500 – $2k", desc: "New platform hooks" },
                { title: "Knowledge Build-Out", price: "$1k – $3k", desc: "Deep document ingestion" },
                { title: "Compliance Package", price: "$1.5k – $4k", desc: "Security & Governance" }
              ].map((item, i) => (
                <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all group">
                   <h4 className="font-black text-slate-900 mb-2">{item.title}</h4>
                   <p className="text-clarity-blue font-black text-xl mb-2">{item.price}</p>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 text-slate-900 relative z-20 py-32 lg:py-48">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-4 block">Pricing Questions</span>
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter">Frequently <span className="italic text-clarity-blue">Asked.</span></h2>
          </div>
          <FAQ items={pricingFAQs} />
        </div>
      </section>

      {/* Dark Final CTA */}
      <section className="relative z-10 py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-12 leading-tight">Scale your business with <span className="text-clarity-blue">Autonomous Intelligence.</span></h2>
          <Link to="/ai-audit" className="inline-flex items-center gap-4 bg-white text-[#050614] px-12 py-6 rounded-2xl font-black text-lg hover:bg-clarity-blue hover:text-white transition-all shadow-2xl">
            Start Your Audit
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
