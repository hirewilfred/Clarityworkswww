import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Building2, Users, Zap, Shield, Brain } from 'lucide-react';
import SEO from '../../components/SEO';
import FAQ from '../../components/FAQ';
import type { FAQItem } from '../../components/FAQ';

const torontoFAQs: FAQItem[] = [
  { question: "Does ClarityWorks serve businesses in Toronto?", answer: "Yes. While headquartered in Hamilton, ClarityWorks Studio serves clients across the Greater Toronto Area including downtown Toronto, Mississauga, Brampton, Markham, Vaughan, Richmond Hill, and Oakville. We offer both in-person and remote engagements." },
  { question: "What AI consulting services do you offer in Toronto?", answer: "We offer Agentic AI consulting, workflow automation, custom AI agent design, ZeroTrust cybersecurity, managed IT services, website development, and AI training workshops. Our Toronto clients include professional services firms, healthcare practices, real estate brokerages, and technology companies." },
  { question: "How is ClarityWorks different from Toronto AI consulting firms?", answer: "Three key differences: we're consulting-first (strategy before tools), we specialize in Agentic AI (not basic chatbots or RPA), and we offer competitive Hamilton pricing without sacrificing enterprise-grade capability. Our methodology is built around governance and measurable ROI." },
  { question: "Do you offer on-site support in Toronto?", answer: "Yes. We provide on-site consulting, training workshops, and implementation support across the GTA. For ongoing managed IT, we combine remote monitoring with scheduled on-site visits. Our Hamilton HQ is less than an hour from downtown Toronto." },
  { question: "What does an AI consulting engagement cost in Toronto?", answer: "Our packages start at $2,500 for Foundation Essentials. Enterprise engagements with multi-agent deployments scale from there. We offer transparent, fixed pricing — no hourly billing surprises. Every engagement begins with a free AI Readiness Assessment and discovery call." },
  { question: "Can I get a free AI assessment for my Toronto business?", answer: "Yes. Take our free 8-minute AI Readiness Assessment to receive a 14-page custom report with your readiness score, quick-win automations, and a 12-month roadmap. No credit card, no obligation. Book an optional 30-minute walkthrough with a consultant afterward." },
];

const AIConsultingToronto: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050614] text-white">
      <SEO
        title="AI Consulting Toronto & GTA | ClarityWorks Studio"
        description="Agentic AI consulting for Toronto and GTA businesses. Custom AI agents, workflow automation, managed IT, and cybersecurity. Free AI readiness assessment from ClarityWorks Studio."
        schema={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "LocalBusiness",
              "name": "ClarityWorks Studio",
              "description": "Agentic AI consulting and managed IT services for Toronto and the Greater Toronto Area",
              "url": "https://clarityworksstudio.com/ai-consulting-toronto",
              "telephone": "+1-905-304-1907",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Hamilton",
                "addressRegion": "ON",
                "addressCountry": "CA"
              },
              "areaServed": [
                { "@type": "City", "name": "Toronto" },
                { "@type": "City", "name": "Mississauga" },
                { "@type": "City", "name": "Brampton" },
                { "@type": "City", "name": "Markham" },
                { "@type": "City", "name": "Vaughan" },
                { "@type": "City", "name": "Richmond Hill" },
                { "@type": "City", "name": "Oakville" }
              ],
              "priceRange": "$$",
              "openingHours": "Mo-Fr 09:00-17:00"
            },
            {
              "@type": "FAQPage",
              "mainEntity": torontoFAQs.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } }))
            }
          ]
        }}
      />

      {/* Hero */}
      <section className="relative px-6 pt-48 pb-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] h-[800px] w-[800px] rounded-full bg-blue-600/10 blur-[150px]" />
          <div className="absolute bottom-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-400/5 blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
                <MapPin className="h-3 w-3 text-clarity-blue" />
                <span className="text-xs font-bold text-slate-400">Toronto & Greater Toronto Area</span>
              </div>

              <h1 className="text-5xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
                AI Consulting <br />
                <span className="italic text-clarity-blue">Toronto.</span>
              </h1>

              <p className="text-xl text-slate-400 leading-relaxed mb-12 max-w-xl font-medium">
                ClarityWorks Studio brings enterprise Agentic AI consulting to Toronto and the GTA —
                helping businesses automate workflows, deploy intelligent agents, and compete in the autonomous economy.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/ai-assessment"
                  className="group inline-flex h-16 items-center gap-3 rounded-full bg-clarity-blue px-10 text-base font-black text-white shadow-2xl shadow-blue-600/30 transition-all hover:gap-5"
                >
                  Free AI Assessment
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-clarity-blue transition-transform group-hover:rotate-45">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </Link>
                <Link
                  to="/services"
                  className="inline-flex h-16 items-center gap-3 rounded-full border border-white/10 px-10 text-base font-black transition-all hover:bg-white/5"
                >
                  View Services
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1517090504332-af2e88ed5c68?auto=format&fit=crop&q=80&w=1200"
                  alt="Toronto skyline business district"
                  className="w-full h-[500px] object-cover grayscale brightness-[0.6]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050614] via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Serving the GTA</span>
                  </div>
                  <h3 className="text-2xl font-black">Enterprise AI for Canada's business capital.</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-[#08091c] py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 sm:grid-cols-4">
          {[
            { value: '500+', label: 'Assessments delivered' },
            { value: '4.2 mo', label: 'Median payback' },
            { value: '93%', label: 'Client retention' },
            { value: '11.6x', label: 'Average ROI' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-black tabular-nums tracking-tighter text-white sm:text-5xl">
                {s.value}
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-clarity-blue">
              — What we do for Toronto businesses
            </p>
            <h2 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
              Full-spectrum <span className="italic font-light text-slate-400">AI & IT</span> for the GTA.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: "Agentic AI Consulting", desc: "Strategy, workflow redesign, and custom AI agent architecture for Toronto businesses ready to lead with AI." },
              { icon: Zap, title: "Workflow Automation", desc: "Identify bottlenecks and deploy AI-powered automations that save your team 8-12 hours per week." },
              { icon: Shield, title: "ZeroTrust Cybersecurity", desc: "Identity governance, endpoint security, and threat hunting to protect your Toronto operation." },
              { icon: Building2, title: "Managed IT Services", desc: "24/7 monitoring, cloud infrastructure, backup, and helpdesk support through 20+ vendor partnerships." },
              { icon: Users, title: "AI Training & Workshops", desc: "Executive briefings and team enablement sessions — delivered on-site across the GTA or virtually." },
              { icon: ArrowUpRight, title: "Custom Websites", desc: "Hand-coded, conversion-engineered websites — React, Next.js, and Tailwind CSS. No templates." },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-[2rem] border border-white/10 bg-[#0a0d1f] p-8 hover:border-white/20 transition-all group"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-clarity-blue/15">
                  <service.icon className="h-6 w-6 text-clarity-blue" />
                </div>
                <h3 className="mb-3 text-xl font-black">{service.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ClarityWorks for Toronto */}
      <section className="border-t border-white/5 bg-[#08091c] px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-clarity-blue">
                — Why Toronto businesses choose us
              </p>
              <h2 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl mb-8">
                GTA reach. <br />
                <span className="italic font-light text-slate-400">Boutique attention.</span>
              </h2>
              <div className="space-y-6">
                {[
                  { title: "Enterprise capability, competitive pricing", desc: "Hamilton headquarters means lower overhead — savings we pass directly to Toronto clients without cutting corners." },
                  { title: "On-site across the GTA", desc: "In-person consulting, workshops, and implementation support from downtown Toronto to Mississauga to Markham." },
                  { title: "Canadian compliance expertise", desc: "PIPEDA, PHIPA, SOC 2, and PCI DSS aligned. We understand Ontario's regulatory landscape." },
                  { title: "Consulting-first methodology", desc: "Strategy and governance before tools. We design the right solution, not the most expensive one." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-clarity-blue" />
                    <div>
                      <h4 className="font-black text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'GTA clients', value: '200+' },
                { label: 'On-site support', value: 'Same day' },
                { label: 'From Hamilton', value: '< 1 hr' },
                { label: 'Vendor partners', value: '20+' },
              ].map((stat, i) => (
                <div key={i} className="rounded-[2rem] border border-white/10 bg-[#0a0d1f] p-8 text-center">
                  <div className="text-3xl font-black tracking-tighter mb-2">{stat.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Areas Served */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-clarity-blue">
            — Areas we serve
          </p>
          <h2 className="text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl mb-12">
            Across the <span className="italic font-light text-slate-400">Greater Toronto Area.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Downtown Toronto', 'North York', 'Scarborough', 'Etobicoke',
              'Mississauga', 'Brampton', 'Markham', 'Vaughan',
              'Richmond Hill', 'Oakville', 'Milton', 'Pickering',
              'Ajax', 'Whitby', 'Oshawa', 'Newmarket'
            ].map((area) => (
              <span key={area} className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-slate-300 hover:border-clarity-blue/40 hover:text-white transition-all">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/5 px-6 py-32">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-clarity-blue">— Common questions</p>
            <h2 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
              Frequently <span className="italic font-light text-slate-400">asked.</span>
            </h2>
          </div>
          <FAQ items={torontoFAQs} darkMode />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-white/5 px-6 py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-transparent to-purple-600/15" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-clarity-blue/10 blur-[140px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-6xl font-black leading-[0.9] tracking-tighter sm:text-8xl">
            Toronto's AI <br />
            <span className="italic font-light text-clarity-blue">advantage.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg text-slate-400">
            Book a free discovery session. We'll audit your current operations and show you exactly
            where AI can give your Toronto business a competitive edge.
          </p>
          <Link
            to="/ai-assessment"
            className="group mt-12 inline-flex h-16 items-center gap-3 rounded-full bg-clarity-blue px-10 text-base font-black text-white shadow-2xl shadow-blue-600/30 transition-all hover:gap-5"
          >
            Start free assessment
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-clarity-blue transition-transform group-hover:rotate-45">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </Link>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
            905-304-1907 · Free · No obligation
          </p>
        </div>
      </section>
    </div>
  );
};

export default AIConsultingToronto;
