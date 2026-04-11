import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, Check } from 'lucide-react';
import SEO from '../../components/SEO';
import { useAuth } from '../../contexts/AuthContext';

/* ----------------------------- Score Gauge ----------------------------- */
const ScoreGauge: React.FC<{ value: number }> = ({ value }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf: number;
    let start: number | null = null;
    const duration = 2200;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progress = (display / 100) * circumference;

  return (
    <div className="relative flex h-[280px] w-[280px] items-center justify-center">
      <svg className="absolute inset-0" viewBox="0 0 280 280">
        <defs>
          <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5c7cff" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <circle cx="140" cy="140" r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth="14" fill="none" />
        <circle
          cx="140"
          cy="140"
          r={radius}
          stroke="url(#gauge-grad)"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform="rotate(-90 140 140)"
          style={{ transition: 'stroke-dashoffset 80ms linear' }}
        />
      </svg>
      <div className="relative text-center">
        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">
          Your AI Score
        </div>
        <div className="mt-1 text-7xl font-black tabular-nums leading-none tracking-tighter">
          {display}
        </div>
        <div className="mt-2 text-xs font-bold uppercase tracking-wider text-clarity-blue">
          {display >= 70 ? 'Advanced' : display >= 40 ? 'Emerging' : 'Foundational'}
        </div>
      </div>
    </div>
  );
};

const AIAssessment: React.FC = () => {
  const { user } = useAuth();
  const ctaTo = user ? '/ai-audit/survey' : '/signup';
  const ctaState = user ? undefined : { returnTo: '/ai-audit/survey' };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050614] text-white">
      <SEO
        title="Free AI Readiness Score | ClarityWorks Studio"
        description="Get your AI readiness score in 8 minutes. Free, no credit card, with a custom roadmap by industry experts."
      />

      {/* ============ HERO ============ */}
      <section className="relative pt-32 pb-24">
        <div className="absolute right-[-15%] top-[5%] h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="absolute left-[-10%] top-[40%] h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[120px]" />

        {/* dotted backdrop */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.05]" aria-hidden>
          <defs>
            <pattern id="dot-aia" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-aia)" />
        </svg>

        <div className="relative mx-auto grid max-w-7xl grid-cols-12 gap-8 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="col-span-12 lg:col-span-7"
          >
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 py-1.5 pl-2 pr-4">
              <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-950">
                Free
              </span>
              <span className="text-xs font-bold tracking-wide text-emerald-300">
                No credit card · 8 min · Instant report
              </span>
            </div>

            <h1 className="font-black leading-[0.85] tracking-tighter">
              <span className="block text-[clamp(2.75rem,7vw,7rem)]">How ready</span>
              <span className="block text-[clamp(2.75rem,7vw,7rem)]">
                is your business
              </span>
              <span className="block text-[clamp(2.75rem,7vw,7rem)]">
                for <span className="italic font-light text-clarity-blue">AI</span>?
              </span>
            </h1>

            <p className="mt-10 max-w-xl text-lg leading-relaxed text-slate-400">
              25 questions. Eight minutes. A score out of 100 — plus a personal,
              no-jargon roadmap of the five workflows you should automate first.
              Built by humans who've actually shipped this stuff.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                to={ctaTo}
                state={ctaState}
                className="group inline-flex h-16 items-center gap-3 rounded-full bg-clarity-blue px-8 text-base font-black text-white shadow-2xl shadow-blue-600/30 transition-all hover:gap-5"
              >
                Get my score
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-clarity-blue transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </Link>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80',
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="h-9 w-9 rounded-full border-2 border-[#050614] object-cover"
                    />
                  ))}
                </div>
                <div className="text-slate-400">
                  <div className="font-bold text-white">512+ businesses</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">
                    have taken it this year
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — gauge + sample card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative col-span-12 lg:col-span-5"
          >
            <div className="relative mx-auto h-[520px] max-w-sm">
              {/* Gauge card */}
              <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0a0d1f] to-[#050614] p-6 shadow-2xl">
                <ScoreGauge value={73} />
              </div>

              {/* Floating tag — strength */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-0 top-12 rounded-2xl border border-emerald-500/30 bg-[#0a0d1f]/95 p-3 shadow-xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <div>
                    <div className="text-xs font-black">Data infrastructure</div>
                    <div className="text-[9px] uppercase tracking-wider text-emerald-400">
                      Strength
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating tag — opportunity */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -left-2 bottom-32 rounded-2xl border border-amber-500/30 bg-[#0a0d1f]/95 p-3 shadow-xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <div>
                    <div className="text-xs font-black">Customer follow-up</div>
                    <div className="text-[9px] uppercase tracking-wider text-amber-400">
                      Quick win
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Sample report ribbon */}
              <div className="absolute bottom-0 left-1/2 w-[300px] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d1f] shadow-2xl">
                <div className="border-b border-white/5 bg-black/40 px-4 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      AI Readiness Report
                    </span>
                    <span className="text-[10px] text-slate-600">PDF · 14 pages</span>
                  </div>
                </div>
                <div className="space-y-2 p-4">
                  {['Executive summary', '5 quick-win automations', 'Risk audit', '12-month roadmap'].map(
                    (line, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                        <Check className="h-3 w-3 text-clarity-blue" />
                        {line}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ STAT TICKER ============ */}
      <section className="border-y border-white/5 bg-[#08091c] py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 sm:grid-cols-4">
          {[
            { value: '8 min', label: 'Average completion' },
            { value: '512+', label: 'Reports delivered' },
            { value: '14 pg', label: 'Custom report' },
            { value: '$0', label: 'Cost to you' },
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

      {/* ============ WHAT'S IN THE REPORT — bento ============ */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 grid grid-cols-12 items-end gap-6">
            <div className="col-span-12 lg:col-span-7">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-clarity-blue">
                — Inside your report
              </p>
              <h2 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
                Not a sales pitch. <br />
                <span className="italic font-light text-slate-400">A real diagnostic.</span>
              </h2>
            </div>
            <p className="col-span-12 max-w-sm text-slate-400 lg:col-span-5">
              Every report is reviewed by a human consultant before it lands in your
              inbox — no AI-generated fluff.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* Big — score */}
            <div className="group relative col-span-12 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-purple-600/20 to-[#0a0d1f] p-10 lg:col-span-7">
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-purple-500/20 blur-[80px]" />
              <div className="relative flex items-center gap-8">
                <div className="shrink-0">
                  <div className="text-[100px] font-black leading-none tracking-tighter text-white">
                    73
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    / 100
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-3xl font-black tracking-tight">Your Score</h3>
                  <p className="max-w-md text-slate-400">
                    Benchmarked against 400+ businesses in your industry and revenue
                    band. You'll know exactly where you stand — and where the
                    competition is pulling ahead.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick wins */}
            <div className="col-span-12 rounded-[2rem] border border-white/10 bg-[#0a0d1f] p-8 lg:col-span-5">
              <div className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-400">
                — Top 5 quick wins
              </div>
              <h3 className="mb-4 text-xl font-bold">Specific automations, not generic advice</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                {[
                  'Inbox triage with custom rules',
                  'Lead-capture → CRM auto-routing',
                  'Meeting notes that actually work',
                  'Content repurposing pipeline',
                  'Customer follow-up sequences',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-black text-emerald-400">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Roadmap */}
            <div className="col-span-12 rounded-[2rem] border border-white/10 bg-[#0a0d1f] p-8 lg:col-span-4">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15">
                <svg className="h-6 w-6 text-clarity-blue" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 2v20M2 12h20" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">12-month roadmap</h3>
              <p className="text-sm text-slate-400">
                Phased rollout plan. Tools, timelines, owners.
              </p>
            </div>

            {/* Risks */}
            <div className="col-span-12 rounded-[2rem] border border-white/10 bg-[#0a0d1f] p-8 lg:col-span-4">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15">
                <svg className="h-6 w-6 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 9v4M12 17h.01" />
                  <path d="m4.93 4.93 14.14 14.14" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Risk audit</h3>
              <p className="text-sm text-slate-400">
                Where your data and workflows are exposed.
              </p>
            </div>

            {/* Time recovery */}
            <div className="col-span-12 rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-600/20 to-[#0a0d1f] p-8 lg:col-span-4">
              <div className="text-5xl font-black tracking-tighter">12+</div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-clarity-blue">
                Hrs/wk reclaimed
              </div>
              <p className="text-sm text-slate-400">
                Average time savings reported by our 2025 cohort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS — annotated steps ============ */}
      <section className="border-t border-white/5 bg-[#08091c] px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.3em] text-clarity-blue">
            — How it works
          </p>
          <h2 className="mb-20 text-center text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
            Three steps. <span className="italic font-light text-slate-400">No catch.</span>
          </h2>

          <div className="relative grid gap-6 md:grid-cols-3">
            {[
              {
                num: '01',
                title: 'Answer 25 questions',
                desc: 'About your tools, team and current workflows. Multiple choice — no essays.',
                accent: 'from-blue-500/30 to-blue-500/0',
              },
              {
                num: '02',
                title: 'Get your score instantly',
                desc: 'A 14-page custom PDF lands in your inbox the moment you finish.',
                accent: 'from-purple-500/30 to-purple-500/0',
              },
              {
                num: '03',
                title: 'Optional walkthrough',
                desc: '30-min call with a real consultant. Or just keep the report and run with it.',
                accent: 'from-emerald-500/30 to-emerald-500/0',
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#050614] p-8"
              >
                <div className={`absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br ${s.accent} blur-3xl`} />
                <div className="relative">
                  <div className="mb-6 text-7xl font-black leading-none tracking-tighter text-white/10">
                    {s.num}
                  </div>
                  <h3 className="mb-3 text-2xl font-black">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIAL ============ */}
      <section className="px-6 py-32">
        <div className="mx-auto grid max-w-6xl grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <div className="relative mx-auto h-72 w-56 overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600"
                alt="Marcus"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050614] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <div className="text-sm font-black">Marcus T.</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  COO · Northwind Logistics
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 flex flex-col justify-center lg:col-span-7">
            <blockquote className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
              <span className="text-6xl font-black leading-none text-clarity-blue">"</span>
              I expected a glorified lead form. What I got was the most actionable
              consulting doc we've had in five years. Two of the "quick wins"
              <span className="text-clarity-blue"> paid for themselves in three weeks.</span>
            </blockquote>
            <div className="mt-8 text-xs font-bold uppercase tracking-wider text-slate-500">
              December 2025 · Verified
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative overflow-hidden border-t border-white/5 px-6 py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-transparent to-purple-600/15" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-clarity-blue/10 blur-[140px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-6xl font-black leading-[0.9] tracking-tighter sm:text-8xl">
            Stop guessing. <br />
            <span className="italic font-light text-clarity-blue">Start scoring.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg text-slate-400">
            8 minutes. Your inbox. A real number. The clarity you've been waiting for.
          </p>
          <Link
            to={ctaTo}
            state={ctaState}
            className="group mt-12 inline-flex h-16 items-center gap-3 rounded-full bg-clarity-blue px-10 text-base font-black text-white shadow-2xl shadow-blue-600/30 transition-all hover:gap-5"
          >
            Take the assessment
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-clarity-blue transition-transform group-hover:rotate-45">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AIAssessment;
