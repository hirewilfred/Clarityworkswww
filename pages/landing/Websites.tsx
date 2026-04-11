import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Globe,
  Zap,
  Search,
  Smartphone,
  ShieldCheck,
  Sparkles,
  Code2,
  TrendingUp,
} from 'lucide-react';
import SEO from '../../components/SEO';

const Websites: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050614] text-white">
      <SEO
        title="Custom Website Design & Development | ClarityWorks Studio"
        description="Conversion-focused websites engineered for speed, SEO, and AI-ready growth. Built by ClarityWorks Studio."
      />

      {/* Glow blobs */}
      <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[130px]" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[130px]" />

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-sm font-medium text-blue-400 backdrop-blur-xl">
            <Globe className="h-4 w-4" />
            Studio-Grade Website Design
          </div>

          <h1 className="mb-8 text-5xl font-black tracking-tight sm:text-7xl">
            Websites That <br />
            <span className="text-clarity-blue">Convert, Not Just Exist.</span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            Custom-built, blazing-fast websites engineered for SEO, conversion, and the
            AI-driven future. No templates. No bloat. Just clarity.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="group flex h-16 w-full items-center justify-center gap-2 rounded-[1.75rem] bg-blue-600 text-lg font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02] hover:bg-blue-700 sm:w-72"
            >
              Start Your Project
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/case-studies"
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              See our work →
            </Link>
          </div>
        </motion.section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-32 grid grid-cols-2 gap-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-12 backdrop-blur-xl sm:grid-cols-4"
        >
          {[
            { value: '0.8s', label: 'Avg Load Time' },
            { value: '98+', label: 'Lighthouse Score' },
            { value: '3.2x', label: 'Conversion Lift' },
            { value: '100%', label: 'Mobile Ready' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="mb-2 text-4xl font-black tracking-tighter text-white lg:text-5xl">
                {stat.value}
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.section>

        {/* Features grid */}
        <section className="mt-32">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-purple-400">
              What's Included
            </div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Everything Your Brand Needs <br />
              <span className="text-clarity-blue">In One Build.</span>
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: 'Lightning Performance',
                desc: 'Sub-second load times with edge deployment, image optimization, and zero-bloat code.',
              },
              {
                icon: Search,
                title: 'SEO Foundation',
                desc: 'Schema markup, meta optimization, and technical SEO baked in from day one.',
              },
              {
                icon: Smartphone,
                title: 'Mobile-First Design',
                desc: 'Pixel-perfect on every device. Built responsive, not retrofitted.',
              },
              {
                icon: ShieldCheck,
                title: 'Secure by Default',
                desc: 'SSL, DDoS protection, and modern security headers included with every site.',
              },
              {
                icon: Sparkles,
                title: 'AI-Ready Integration',
                desc: 'Built with hooks for chatbots, automations, and AI agents from launch.',
              },
              {
                icon: Code2,
                title: 'Custom Code',
                desc: 'No page builders. No bloated themes. Every line written for your business.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group rounded-2xl border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl transition-all hover:border-blue-500/30"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10 transition-colors group-hover:bg-blue-600/20">
                  <feature.icon className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="mt-32">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-purple-400">
                The Process
              </div>
              <h2 className="mb-6 text-4xl font-black tracking-tight sm:text-5xl">
                From Concept To <br />
                <span className="text-clarity-blue">Launch In 4 Weeks.</span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-slate-400">
                A proven sprint-based process that gets your brand online fast — without
                cutting corners on quality, performance, or strategy.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {[
                { step: '01', title: 'Discovery', desc: 'Brand, audience, and conversion goals defined.' },
                { step: '02', title: 'Design', desc: 'Custom UI mockups tailored to your voice.' },
                { step: '03', title: 'Build', desc: 'Hand-coded development with weekly check-ins.' },
                { step: '04', title: 'Launch', desc: 'Deployment, training, and 30 days of support.' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-xl transition-all hover:border-blue-500/30"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 font-bold text-blue-400 transition-colors group-hover:bg-blue-500/20">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="mb-1 text-lg font-bold text-white transition-colors group-hover:text-blue-400">
                      {item.title}
                    </h4>
                    <p className="leading-relaxed text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto mt-32 max-w-5xl overflow-hidden rounded-[3rem] border border-white/5 bg-slate-900/40 p-12 text-center lg:p-20"
        >
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px]" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]" />

          <h2 className="relative z-10 mb-6 text-4xl font-black tracking-tight sm:text-5xl">
            Ready For A Site That <br />
            <span className="italic text-purple-400">Actually Works?</span>
          </h2>
          <p className="relative z-10 mx-auto mb-10 max-w-2xl text-lg text-slate-400">
            Book a free 30-minute strategy call. We'll review your current site, identify
            quick wins, and map a plan — no obligation.
          </p>
          <div className="relative z-10 flex justify-center">
            <Link
              to="/signup"
              className="group flex h-16 w-full items-center justify-center gap-2 rounded-[1.75rem] bg-blue-600 text-lg font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02] hover:bg-blue-700 sm:w-80"
            >
              <TrendingUp className="h-5 w-5" />
              Book Free Strategy Call
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Websites;
