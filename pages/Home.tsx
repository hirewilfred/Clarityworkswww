
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const AnimatedCounter: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const numericPart = parseFloat(value.replace(/[^0-9.]/g, ''));
  const suffix = value.replace(/[0-9.]/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) setHasAnimated(true);
      },
      { threshold: 0.5 }
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    let startTimestamp: number | null = null;
    const duration = 2500;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 5);
      setDisplayValue(Math.floor(easedProgress * numericPart));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [hasAnimated, numericPart]);

  return (
    <div ref={elementRef} className="text-center group px-4">
      <p className="text-4xl lg:text-6xl font-black mb-2 text-white tracking-tighter group-hover:text-clarity-blue transition-colors duration-500">
        {displayValue.toLocaleString()}{suffix}
      </p>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] leading-tight max-w-[120px] mx-auto">{label}</p>
    </div>
  );
};

const TestimonialCard: React.FC<{ quote: string; author: string; role: string; company: string }> = ({ quote, author, role, company }) => (
  <div className="glass-panel p-10 lg:p-12 rounded-[3.5rem] border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 group flex flex-col h-full">
    <div className="mb-8">
      <div className="flex gap-1 mb-6">
        {[1, 2, 3, 4, 5].map((s) => (
          <i key={s} className="fas fa-star text-[10px] text-clarity-blue/40 group-hover:text-clarity-blue transition-colors"></i>
        ))}
      </div>
      <p className="text-lg lg:text-xl text-slate-300 font-medium leading-relaxed italic">
        "{quote}"
      </p>
    </div>
    <div className="mt-auto pt-8 border-t border-white/5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 group-hover:border-clarity-blue/40 transition-colors">
        <i className="fas fa-user-tie text-slate-500 group-hover:text-clarity-blue transition-colors"></i>
      </div>
      <div>
        <h4 className="text-white font-black text-sm tracking-tight">{author}</h4>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{role} • {company}</p>
      </div>
    </div>
  </div>
);

const Home: React.FC = () => {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  const heroSlides = [
    {
      badge: "Architecture Suite",
      title: "Agent Studio Unleashed.",
      desc: "Architect, configure, and deploy production-ready autonomous agents in minutes. Tailor your digital workforce to your specific business logic.",
      ctaPrimary: "Enter Agent Studio",
      ctaLink: "/agent-studio",
      accent: "bg-clarity-blue",
      bgImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2000"
    },
    {
      badge: "New: Hero Consulting",
      title: "Agentic AI Consulting.",
      desc: "Stop chasing trends. Start building legacies. We architect production-ready autonomous agent networks that solve complex operational bottlenecks.",
      ctaPrimary: "Book Strategy Audit",
      ctaLink: "/ai-assessment",
      accent: "bg-indigo-600",
      bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop"
    },
    {
      badge: "Enablement Workshops",
      title: "Human + AI Mastery.",
      desc: "Training your leadership and workforce to lead the autonomous future through studio-grade workshops.",
      ctaPrimary: "Book Workshop",
      ctaLink: "/training",
      accent: "bg-blue-600",
      bgImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2000&auto=format&fit=crop"
    }
  ];

  const testimonials = [
    {
      quote: "ClarityWorks didn't just give us a tool; they redesigned our entire discovery process. Our efficiency gains were measurable within weeks.",
      author: "Marcus Thorne",
      role: "COO",
      company: "Nexus Logistics"
    },
    {
      quote: "The Agent Studio is a game changer. We've deployed 4 custom agents that handle 80% of our tier-1 support triage autonomously.",
      author: "Sarah Jenkins",
      role: "Head of Operations",
      company: "CloudVantage"
    },
    {
      quote: "Strategic clarity is their superpower. They helped us navigate the noise and focus on high-impact Agentic AI implementations.",
      author: "David Chen",
      role: "CTO",
      company: "Fintech Collective"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide(prev => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen indigo-gradient selection:bg-blue-500/30 overflow-x-hidden relative">
      <SEO 
        title="Agentic AI Consulting & Strategy" 
        description="ClarityWorks Studio: Leading enterprise Agentic AI consulting, managed IT services, and technical strategy for an autonomous future."
      />
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-[3000ms] ease-in-out ${idx === currentHeroSlide ? 'opacity-30 z-10' : 'opacity-0 z-0'}`}
          >
            <div className={`w-full h-full transition-transform duration-[12000ms] ease-linear transform ${idx === currentHeroSlide ? 'scale-110' : 'scale-100'}`}>
               <img src={slide.bgImage} alt="" className="w-full h-full object-cover grayscale brightness-[0.7]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#050614] via-[#050614]/80 to-transparent"></div>
          </div>
        ))}
      </div>

      <section className="relative min-h-[95vh] flex items-center pt-32 pb-24 px-6 z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-4xl">
            {heroSlides.map((slide, idx) => (
              <div 
                key={idx} 
                className={`transition-all duration-1000 ${idx === currentHeroSlide ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-8 absolute pointer-events-none'}`}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${slide.accent} text-white uppercase tracking-widest`}>
                    NEW STUDIO
                  </span>
                  <span className="text-xs font-bold text-slate-400 tracking-tight uppercase tracking-widest">{slide.badge}</span>
                </div>
                
                <h1 className="text-5xl sm:text-7xl lg:text-[9.5rem] font-black leading-[0.85] mb-8 tracking-tighter text-gradient">
                  {slide.title}
                </h1>
                
                <p className="text-xl lg:text-2xl text-slate-400 max-w-xl mb-12 leading-relaxed font-medium">
                  {slide.desc}
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                  <Link 
                    to={slide.ctaLink} 
                    className={`px-10 py-5 rounded-2xl font-black text-lg shadow-2xl transition-all duration-500 text-center flex items-center justify-center gap-3 ${slide.accent} text-white group`}
                  >
                    <span>{slide.ctaPrimary}</span>
                    <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>
                  </Link>
                  <Link to="/services" className="glass-panel text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all text-center">
                    Core Solutions
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-6 border-y border-white/5 bg-[#050614]/80 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "Agents Deployed", val: "1.2k+" },
            { label: "Workshop Hours", val: "850+" },
            { label: "Efficiency Gain", val: "42%" },
            { label: "System Uptime", val: "99.9%" }
          ].map((s, i) => (
            <AnimatedCounter key={i} value={s.val} label={s.label} />
          ))}
        </div>
      </section>

      <section className="bg-white text-slate-900 relative z-20 pt-32 pb-32 rounded-t-[5rem] shadow-[0_-50px_100px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-5 py-2 rounded-full bg-clarity-blue/5 text-clarity-blue font-black text-[10px] uppercase tracking-[0.3em] mb-8">Studio Philosophy</span>
          <h2 className="text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-10">
            Architecting <br /><span className="text-clarity-blue italic">Autonomous Legacies.</span>
          </h2>
          <p className="text-xl text-slate-500 leading-relaxed font-medium max-w-3xl mx-auto">
            We specialize in designing custom, reliable Agentic AI frameworks that bridge the gap between raw data and true business intelligence.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-40 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-4 block">Client Perspectives</span>
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-white">Studio <span className="italic text-clarity-blue">Praise.</span></h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-10">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>
        
        {/* Subtle Decorative Background Element */}
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full pointer-events-none z-0 glow-sphere blur-[150px] bg-blue-600/5"></div>
      </section>

      {/* Final CTA Bridge */}
      <section className="relative z-10 py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="h-px w-24 bg-white/10 mx-auto mb-12"></div>
          <h2 className="text-3xl font-black text-slate-500 tracking-tight mb-8">Trusted by industry leaders to navigate the autonomous future.</h2>
          <Link to="/case-studies" className="text-clarity-blue font-black uppercase tracking-widest text-xs hover:text-white transition-colors">
            View Case Studies <i className="fas fa-chevron-right ml-2 text-[10px]"></i>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
