
import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { RevealCardContainer, IdentityCardBody } from '../components/ui/animated-profile-card';
import type { SocialItem } from '../components/ui/animated-profile-card';

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const teamMembers: Array<{
  avatarUrl: string;
  avatarText: string;
  fullName: string;
  place: string;
  about: string;
  socials: SocialItem[];
  accent: string;
  textOnAccent: string;
  mutedOnAccent: string;
}> = [
  {
    avatarUrl: "/team/vince-greco.jpg",
    avatarText: "VG",
    fullName: "Vince Greco",
    place: "Toronto, Ontario",
    about: "Founder & CEO of ClarityWorks Studio. Helping organizations design practical Agentic AI systems that amplify human expertise.",
    socials: [
      {
        id: "li",
        url: "https://www.linkedin.com/company/clarityworks-studio",
        label: "LinkedIn",
        icon: <LinkedInIcon className="h-5 w-5" />,
      },
    ],
    accent: "#e0f2fe",
    textOnAccent: "#0f172a",
    mutedOnAccent: "#475569",
  },
  {
    avatarUrl: "/team/lucas-greco.jpg",
    avatarText: "LG",
    fullName: "Lucas Greco",
    place: "Toronto, Ontario",
    about: "Chief Marketing Officer driving brand strategy, demand generation, and market positioning for ClarityWorks Studio.",
    socials: [
      {
        id: "li",
        url: "https://www.linkedin.com/company/clarityworks-studio",
        label: "LinkedIn",
        icon: <LinkedInIcon className="h-5 w-5" />,
      },
    ],
    accent: "#5c7cff",
    textOnAccent: "#ffffff",
    mutedOnAccent: "rgba(255,255,255,0.8)",
  },
  {
    avatarUrl: "/team/sarah-jenkins.jpg",
    avatarText: "SJ",
    fullName: "Sarah Jenkins",
    place: "Vancouver, BC",
    about: "VP of Client Strategy. Translates complex business needs into actionable AI roadmaps that deliver measurable ROI.",
    socials: [
      {
        id: "li",
        url: "https://www.linkedin.com/company/clarityworks-studio",
        label: "LinkedIn",
        icon: <LinkedInIcon className="h-5 w-5" />,
      },
    ],
    accent: "#f0abfc",
    textOnAccent: "#1e1b4b",
    mutedOnAccent: "#4c1d95",
  },
  {
    avatarUrl: "/team/marcus-reid.jpg",
    avatarText: "MR",
    fullName: "Marcus Reid",
    place: "Calgary, Alberta",
    about: "Chief Technology Officer. Architects scalable AI infrastructure and oversees all platform engineering initiatives.",
    socials: [
      {
        id: "li",
        url: "https://www.linkedin.com/company/clarityworks-studio",
        label: "LinkedIn",
        icon: <LinkedInIcon className="h-5 w-5" />,
      },
    ],
    accent: "#34d399",
    textOnAccent: "#022c22",
    mutedOnAccent: "#064e3b",
  },
  {
    avatarUrl: "/team/priya-nair.jpg",
    avatarText: "PN",
    fullName: "Priya Nair",
    place: "Toronto, Ontario",
    about: "Lead AI Engineer specializing in agentic workflows, LLM orchestration, and production-grade AI deployments.",
    socials: [
      {
        id: "li",
        url: "https://www.linkedin.com/company/clarityworks-studio",
        label: "LinkedIn",
        icon: <LinkedInIcon className="h-5 w-5" />,
      },
    ],
    accent: "#fbbf24",
    textOnAccent: "#1c1917",
    mutedOnAccent: "#44403c",
  },
  {
    avatarUrl: "/team/derek-kim.jpg",
    avatarText: "DK",
    fullName: "Derek Kim",
    place: "Montreal, Quebec",
    about: "Head of Data Science. Builds predictive models and analytics frameworks that power intelligent decision-making.",
    socials: [
      {
        id: "li",
        url: "https://www.linkedin.com/company/clarityworks-studio",
        label: "LinkedIn",
        icon: <LinkedInIcon className="h-5 w-5" />,
      },
    ],
    accent: "#fb923c",
    textOnAccent: "#1c1917",
    mutedOnAccent: "#44403c",
  },
  {
    avatarUrl: "/team/jessica-wong.jpg",
    avatarText: "JW",
    fullName: "Jessica Wong",
    place: "Ottawa, Ontario",
    about: "Operations Director. Streamlines internal processes and ensures seamless delivery across all client engagements.",
    socials: [
      {
        id: "li",
        url: "https://www.linkedin.com/company/clarityworks-studio",
        label: "LinkedIn",
        icon: <LinkedInIcon className="h-5 w-5" />,
      },
    ],
    accent: "#c4b5fd",
    textOnAccent: "#1e1b4b",
    mutedOnAccent: "#4c1d95",
  },
  {
    avatarUrl: "/team/ryan-mitchell.jpg",
    avatarText: "RM",
    fullName: "Ryan Mitchell",
    place: "Edmonton, Alberta",
    about: "Senior Solutions Architect. Designs end-to-end AI solutions tailored to each client's unique operational landscape.",
    socials: [
      {
        id: "li",
        url: "https://www.linkedin.com/company/clarityworks-studio",
        label: "LinkedIn",
        icon: <LinkedInIcon className="h-5 w-5" />,
      },
    ],
    accent: "#67e8f9",
    textOnAccent: "#0f172a",
    mutedOnAccent: "#334155",
  },
  {
    avatarUrl: "/team/alicia-torres.jpg",
    avatarText: "AT",
    fullName: "Alicia Torres",
    place: "Winnipeg, Manitoba",
    about: "UX/UI Design Lead. Crafts intuitive interfaces that make complex AI tools accessible and delightful to use.",
    socials: [
      {
        id: "li",
        url: "https://www.linkedin.com/company/clarityworks-studio",
        label: "LinkedIn",
        icon: <LinkedInIcon className="h-5 w-5" />,
      },
    ],
    accent: "#f9a8d4",
    textOnAccent: "#1e1b4b",
    mutedOnAccent: "#4c1d95",
  },
  {
    avatarUrl: "/team/nathan-palmer.jpg",
    avatarText: "NP",
    fullName: "Nathan Palmer",
    place: "Halifax, Nova Scotia",
    about: "DevOps & Cloud Engineer. Manages CI/CD pipelines, cloud infrastructure, and production reliability at scale.",
    socials: [
      {
        id: "li",
        url: "https://www.linkedin.com/company/clarityworks-studio",
        label: "LinkedIn",
        icon: <LinkedInIcon className="h-5 w-5" />,
      },
    ],
    accent: "#86efac",
    textOnAccent: "#022c22",
    mutedOnAccent: "#064e3b",
  },
  {
    avatarUrl: "/team/emma-brooks.jpg",
    avatarText: "EB",
    fullName: "Emma Brooks",
    place: "Toronto, Ontario",
    about: "Client Success Manager. Ensures every engagement delivers value and builds lasting partnerships with our clients.",
    socials: [
      {
        id: "li",
        url: "https://www.linkedin.com/company/clarityworks-studio",
        label: "LinkedIn",
        icon: <LinkedInIcon className="h-5 w-5" />,
      },
    ],
    accent: "#fca5a5",
    textOnAccent: "#1c1917",
    mutedOnAccent: "#44403c",
  },
  {
    avatarUrl: "/team/james-carter.jpg",
    avatarText: "JC",
    fullName: "James Carter",
    place: "Victoria, BC",
    about: "Business Development Lead. Identifies growth opportunities and forges strategic partnerships across industries.",
    socials: [
      {
        id: "li",
        url: "https://www.linkedin.com/company/clarityworks-studio",
        label: "LinkedIn",
        icon: <LinkedInIcon className="h-5 w-5" />,
      },
    ],
    accent: "#93c5fd",
    textOnAccent: "#0f172a",
    mutedOnAccent: "#334155",
  },
];

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
                icon: "fa-comments-alt",
                image: "/images/consulting_first.png"
              },
              {
                title: "Agentic vs. Basic",
                desc: "We design AI agents that observe, decide within boundaries, and take action—not just basic chatbots.",
                icon: "fa-microchip",
                image: "/images/agentic_vs_basic.png"
              },
              {
                title: "Amplify, Not Replace",
                desc: "AI should offload repetitive work so your teams can focus on strategy, leadership, and creativity.",
                icon: "fa-users",
                image: "/images/amplify_not_replace.png"
              }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-[3.5rem] border border-slate-100 hover:shadow-2xl transition-all group overflow-hidden flex flex-col">
                <div className="h-64 overflow-hidden relative">
                   <div className="absolute inset-0 bg-clarity-blue/10 group-hover:bg-transparent transition-all z-10"></div>
                   <img src={item.image} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-10 flex flex-col flex-1 relative bg-white">
                    <div className="absolute -top-10 right-10 w-20 h-20 rounded-[2rem] bg-clarity-blue shadow-xl flex items-center justify-center text-white z-20 group-hover:-translate-y-2 transition-transform duration-500">
                      <i className={`fas ${item.icon} text-3xl`}></i>
                    </div>
                    <h3 className="text-2xl font-black mb-4 mt-6 text-slate-900">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                </div>
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
                  "Enterprise & Mid-Market Organizations",
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

      {/* Meet the Team */}
      <section className="bg-white text-slate-900 relative z-20 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-4 block">The People</span>
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter">Meet the <span className="italic text-clarity-blue">Team.</span></h2>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            {teamMembers.map((member) => (
              <RevealCardContainer
                key={member.fullName}
                accent={member.accent}
                textOnAccent={member.textOnAccent}
                mutedOnAccent={member.mutedOnAccent}
                base={
                  <IdentityCardBody {...member} scheme="plain" displayAvatar={false} />
                }
                overlay={
                  <IdentityCardBody
                    {...member}
                    scheme="accented"
                    displayAvatar={true}
                    cardCss={{ backgroundColor: "var(--accent-color)" }}
                  />
                }
              />
            ))}
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
