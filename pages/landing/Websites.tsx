import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Star, Play } from 'lucide-react';
import SEO from '../../components/SEO';

const Websites: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050614] text-white">
      <SEO
        title="Websites That Convert | ClarityWorks Studio"
        description="Hand-coded, conversion-engineered websites built in Hamilton, Ontario. No templates, no bloat — just clarity."
      />

      {/* ======================================================
          HERO — editorial split with oversized type + image stack
      ====================================================== */}
      <section className="relative pt-32 pb-24">
        <div className="absolute right-[-15%] top-[5%] h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="absolute left-[-10%] top-[40%] h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[120px]" />

        {/* SVG grid backdrop */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <pattern id="grid-w" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-w)" />
        </svg>

        <div className="relative mx-auto grid max-w-7xl grid-cols-12 gap-6 px-6">
          {/* Left — type column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="col-span-12 lg:col-span-7"
          >
            <div className="mb-8 flex items-center gap-3">
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
                Now booking Q2 2026
              </span>
            </div>

            <h1 className="font-black leading-[0.85] tracking-tighter">
              <span className="block text-[clamp(3rem,8vw,8rem)] text-white">We build</span>
              <span className="block text-[clamp(3rem,8vw,8rem)]">
                <span className="italic font-light text-clarity-blue">websites</span>
                <span className="text-white">.</span>
              </span>
              <span className="mt-2 block text-[clamp(1.25rem,2vw,2rem)] font-light text-slate-400">
                The kind that <span className="text-white font-bold">actually</span> sell things.
              </span>
            </h1>

            <p className="mt-10 max-w-xl text-lg leading-relaxed text-slate-400">
              Hand-coded in Hamilton. Engineered for speed, search, and the AI tools your
              team is about to start using. No templates. No "drag-and-drop." No 47
              third-party plugins fighting for control of your homepage.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                to="/signup"
                className="group relative inline-flex h-16 items-center gap-3 rounded-full bg-white px-8 text-base font-black text-[#050614] transition-all hover:gap-5"
              >
                Start a project
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#050614] text-white transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </Link>

              <Link
                to="/case-studies"
                className="group inline-flex items-center gap-3 text-sm font-bold text-slate-300 transition-colors hover:text-white"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-white/60">
                  <Play className="h-4 w-4 fill-current" />
                </span>
                Watch a 90-sec reel
              </Link>
            </div>
          </motion.div>

          {/* Right — image stack */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative col-span-12 lg:col-span-5"
          >
            <div className="relative mx-auto h-[520px] max-w-md">
              {/* Big card — back */}
              <div className="absolute right-0 top-0 h-[380px] w-[280px] rotate-[6deg] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=800"
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 to-transparent" />
              </div>

              {/* Mid card — browser mockup */}
              <div className="absolute left-0 top-12 h-[300px] w-[320px] -rotate-[4deg] overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#0a0d1f] shadow-2xl">
                <div className="flex items-center gap-1.5 border-b border-white/5 bg-black/40 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
                  <span className="ml-3 rounded bg-white/5 px-2 py-0.5 text-[9px] text-slate-400">
                    yourbrand.com
                  </span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800"
                  alt=""
                  className="h-full w-full object-cover opacity-80"
                />
              </div>

              {/* Floating stat badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-12 right-4 rounded-2xl border border-white/10 bg-[#0a0d1f]/95 p-4 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
                    <ArrowUpRight className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-black tabular-nums leading-none">+312%</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Lead volume
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Star sticker */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute -left-4 bottom-0"
              >
                <svg width="110" height="110" viewBox="0 0 110 110">
                  <defs>
                    <path
                      id="circ-w"
                      d="M 55 55 m -42 0 a 42 42 0 1 1 84 0 a 42 42 0 1 1 -84 0"
                    />
                  </defs>
                  <text fontSize="11" fontWeight="900" fill="#5c7cff" letterSpacing="2">
                    <textPath href="#circ-w">
                      HAND-CODED · SHIPPED FAST · BUILT IN HAMILTON ·
                    </textPath>
                  </text>
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================================================
          MARQUEE — "stack" strip
      ====================================================== */}
      <section className="relative border-y border-white/5 bg-[#08091c] py-6">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-12 pr-12">
            {[
              'React',
              '★',
              'Next.js',
              '★',
              'TypeScript',
              '★',
              'Tailwind',
              '★',
              'Vercel',
              '★',
              'Supabase',
              '★',
              'Framer Motion',
              '★',
              'Sanity',
              '★',
              'Stripe',
              '★',
            ]
              .concat([
                'React',
                '★',
                'Next.js',
                '★',
                'TypeScript',
                '★',
                'Tailwind',
                '★',
                'Vercel',
                '★',
                'Supabase',
                '★',
                'Framer Motion',
                '★',
                'Sanity',
                '★',
                'Stripe',
                '★',
              ])
              .map((item, i) => (
                <span
                  key={i}
                  className={`whitespace-nowrap text-2xl font-black tracking-tight ${
                    item === '★' ? 'text-clarity-blue' : 'text-white/40'
                  }`}
                >
                  {item}
                </span>
              ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          BENTO — capabilities, varied sizes
      ====================================================== */}
      <section className="relative px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 grid grid-cols-12 items-end gap-6">
            <div className="col-span-12 lg:col-span-7">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-clarity-blue">
                — What's under the hood
              </p>
              <h2 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
                Everything a <br />
                <span className="italic font-light text-slate-400">good website</span> should do.
              </h2>
            </div>
            <p className="col-span-12 max-w-sm text-slate-400 lg:col-span-5">
              We treat performance, accessibility and SEO as non-negotiables — not
              "phase 2" line items.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* Big — Performance */}
            <div className="group relative col-span-12 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-600/20 to-[#0a0d1f] p-10 lg:col-span-7 lg:row-span-2">
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/20 blur-[80px]" />
              <div className="relative">
                <div className="mb-8 flex items-baseline gap-2">
                  <span className="text-[140px] font-black leading-none tracking-tighter text-white">
                    0.6
                  </span>
                  <span className="text-3xl font-black text-clarity-blue">s</span>
                </div>
                <h3 className="mb-3 text-3xl font-black tracking-tight">
                  Median load time
                </h3>
                <p className="max-w-md text-slate-400">
                  Edge-deployed, code-split, image-optimised. Most of our builds score
                  98+ on Lighthouse before we even start tuning.
                </p>
                <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '94%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-clarity-blue"
                    />
                  </div>
                  <span className="text-xs font-bold text-emerald-400">94 / 100</span>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="col-span-12 rounded-[2rem] border border-white/10 bg-[#0a0d1f] p-8 lg:col-span-5">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15">
                <svg className="h-6 w-6 text-purple-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Schema-first SEO</h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Structured data, clean URLs, semantic HTML and canonical tagging — wired
                in before your first paragraph of copy.
              </p>
            </div>

            {/* Mobile */}
            <div className="col-span-6 rounded-[2rem] border border-white/10 bg-[#0a0d1f] p-8 lg:col-span-3">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15">
                <svg className="h-6 w-6 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <path d="M12 18h.01" />
                </svg>
              </div>
              <h3 className="mb-1 text-lg font-bold">Mobile first</h3>
              <p className="text-xs text-slate-400">Built for thumbs, not retrofitted.</p>
            </div>

            {/* AI hooks */}
            <div className="col-span-6 rounded-[2rem] border border-white/10 bg-[#0a0d1f] p-8 lg:col-span-2">
              <div className="text-4xl">🤖</div>
              <h3 className="mt-4 text-sm font-bold">AI-ready APIs</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          PROCESS — diagonal numbered timeline
      ====================================================== */}
      <section className="relative border-t border-white/5 bg-[#08091c] px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-clarity-blue">
              — Our 4-week sprint
            </p>
            <h2 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
              From <span className="italic font-light">scribble</span> to{' '}
              <span className="text-clarity-blue">live site</span>, in a month.
            </h2>
          </div>

          <div className="relative grid grid-cols-1 gap-px md:grid-cols-4">
            {/* connector line */}
            <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-white/20 to-transparent md:block" />

            {[
              {
                week: 'WEEK 1',
                title: 'Listening',
                desc: 'Two workshops. We learn your business, your customers and your kpis. No "discovery doc" theatre.',
              },
              {
                week: 'WEEK 2',
                title: 'Drawing',
                desc: 'Custom UI. You see real designs in your brand, not Figma stock kits.',
              },
              {
                week: 'WEEK 3',
                title: 'Building',
                desc: 'Hand-coded in React + Next.js. Deployed to a staging URL the day we start.',
              },
              {
                week: 'WEEK 4',
                title: 'Shipping',
                desc: 'QA, launch, training, and 30 days of post-launch hand-holding.',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative px-4 pt-0 md:pt-0"
              >
                <div className="relative z-10 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-[#050614] text-3xl font-black text-clarity-blue">
                  0{i + 1}
                </div>
                <div className="text-center">
                  <p className="mb-2 text-[10px] font-bold tracking-[0.3em] text-slate-500">
                    {step.week}
                  </p>
                  <h3 className="mb-3 text-2xl font-black">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          TESTIMONIAL — editorial pull-quote
      ====================================================== */}
      <section className="relative px-6 py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-4">
            <div className="relative mx-auto h-72 w-56 overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600"
                alt="Janelle"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050614] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <div className="text-sm font-black">Janelle M.</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Founder · Ridge Realty Group
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 flex flex-col justify-center lg:col-span-8">
            <div className="mb-4 flex gap-1 text-clarity-blue">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <blockquote className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
              <span className="text-6xl font-black leading-none text-clarity-blue">"</span>
              They didn't try to sell me ten different "packages." They asked what was
              broken, fixed it, and now my listings page is faster than the brokerage
              I left.{' '}
              <span className="text-clarity-blue">Lead volume tripled in eight weeks.</span>
            </blockquote>
            <div className="mt-8 inline-flex items-center gap-3 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Case study · Hamilton, ON
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          CTA — full-bleed
      ====================================================== */}
      <section className="relative overflow-hidden border-t border-white/5 px-6 py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-transparent to-purple-600/15" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-clarity-blue/10 blur-[140px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-6xl font-black leading-[0.9] tracking-tighter sm:text-8xl">
            Let's build <br />
            <span className="italic font-light text-clarity-blue">something good.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg text-slate-400">
            30-minute strategy call. No pitch deck. We'll look at your current site,
            point out the cheapest wins, and tell you whether you actually need a
            rebuild.
          </p>
          <Link
            to="/signup"
            className="group mt-12 inline-flex h-16 items-center gap-3 rounded-full bg-white px-10 text-base font-black text-[#050614] transition-all hover:gap-5"
          >
            Book the call
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#050614] text-white transition-transform group-hover:rotate-45">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </Link>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
            Replies within 1 business day · No obligation
          </p>
        </div>
      </section>
    </div>
  );
};

export default Websites;
