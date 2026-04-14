import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Zap,
  Sparkles,
} from 'lucide-react';
import SEO from '../../components/SEO';
import FAQ from '../../components/FAQ';
import type { FAQItem } from '../../components/FAQ';

const roiFAQs: FAQItem[] = [
  { question: "How accurate is the ROI calculator?", answer: "Our calculator uses conservative defaults (60% automation efficiency) based on benchmarks from 500+ ClarityWorks engagements between 2023–2025. Most clients exceed these estimates in year one. No vendor data or inflated projections — just real-world numbers from real businesses." },
  { question: "What costs are included in the AI ROI calculation?", answer: "The calculator factors in your team size, average salary costs, hours spent on automatable tasks, and the cost of AI tooling. It produces a net savings figure, ROI multiple, weekly hours reclaimed, and estimated payback period in months." },
  { question: "What is a typical AI ROI payback period?", answer: "The median payback period across our client base is 4.2 months. This means most businesses recoup their AI investment within the first quarter of deployment. High-impact automations like lead routing and appointment scheduling often pay for themselves in weeks." },
  { question: "Do I need to share sensitive data to use the calculator?", answer: "No. The calculator only asks for general parameters: team size, industry, and estimated hours on repetitive tasks. No financial statements, customer data, or proprietary information is required. All calculations happen in your browser." },
  { question: "What happens after I see my ROI estimate?", answer: "You can take the free 8-minute AI Readiness Assessment to get a detailed 14-page report with specific automation recommendations for your business. Optionally, book a 30-minute call with a consultant to validate the numbers and build an implementation plan." },
];

/* ----------------------------- Animated number ----------------------------- */
const AnimatedNumber: React.FC<{ value: number; format?: (n: number) => string; className?: string }> = ({
  value,
  format,
  className,
}) => {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const start = display;
    const delta = value - start;
    if (Math.abs(delta) < 0.5) {
      setDisplay(value);
      return;
    }
    let raf: number;
    let t0: number | null = null;
    const duration = 600;
    const tick = (t: number) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(start + delta * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={className}>{format ? format(display) : Math.round(display).toLocaleString()}</span>;
};

/* ----------------------------- Slider input ----------------------------- */
interface SliderProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  onChange: (v: number) => void;
}
const Slider: React.FC<SliderProps> = ({
  icon: Icon,
  label,
  hint,
  value,
  min,
  max,
  step,
  prefix,
  suffix,
  onChange,
}) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-clarity-blue" />
          <div>
            <div className="text-sm font-bold text-white">{label}</div>
            {hint && <div className="text-[10px] text-slate-500">{hint}</div>}
          </div>
        </div>
        <div className="rounded-xl border border-clarity-blue/30 bg-clarity-blue/10 px-3 py-1.5 text-sm font-black tabular-nums text-clarity-blue">
          {prefix}
          {value.toLocaleString()}
          {suffix}
        </div>
      </div>
      <div className="relative h-2 w-full rounded-full bg-white/5">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-clarity-blue to-purple-500"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent
                     [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                     [&::-webkit-slider-thumb]:bg-clarity-blue [&::-webkit-slider-thumb]:shadow-lg"
        />
      </div>
    </div>
  );
};

/* ============================================================ */
const ROICalculator: React.FC = () => {
  const [employees, setEmployees] = useState(12);
  const [hoursPerWeek, setHoursPerWeek] = useState(8);
  const [hourlyRate, setHourlyRate] = useState(45);
  const [automationRate, setAutomationRate] = useState(60);

  const r = useMemo(() => {
    const weeklyHrs = employees * hoursPerWeek * (automationRate / 100);
    const annualHrs = weeklyHrs * 50;
    const annualSavings = annualHrs * hourlyRate;
    const monthlySavings = annualSavings / 12;
    const investment = Math.max(8000, employees * 600);
    const roi = annualSavings / investment;
    const payback = investment / monthlySavings;
    const currentCost = employees * hoursPerWeek * 50 * hourlyRate;
    const futureCost = currentCost - annualSavings;
    return {
      weeklyHrs,
      annualHrs,
      annualSavings,
      monthlySavings,
      roi,
      payback,
      currentCost,
      futureCost,
    };
  }, [employees, hoursPerWeek, hourlyRate, automationRate]);

  const fmtMoney = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  // Bar comparison heights (relative)
  const maxBar = Math.max(r.currentCost, r.currentCost) || 1;
  const currentH = (r.currentCost / maxBar) * 100;
  const futureH = (r.futureCost / maxBar) * 100;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050614] text-white">
      <SEO
        title="Free AI ROI Calculator | Ontario Business Savings"
        description="See exactly how much your Ontario business could save with AI automation. Free interactive calculator with real benchmarks from 500+ engagements — instant results."
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": roiFAQs.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } }))
        }}
      />

      {/* ============ HERO ============ */}
      <section className="relative pt-32 pb-12">
        <div className="absolute right-[-15%] top-[5%] h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="absolute left-[-10%] top-[40%] h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[120px]" />

        <svg className="absolute inset-0 h-full w-full opacity-[0.04]" aria-hidden>
          <defs>
            <pattern id="grid-roi" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-roi)" />
        </svg>

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-clarity-blue/30 bg-clarity-blue/10 py-1.5 pl-2 pr-4">
              <span className="rounded-full bg-clarity-blue px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                Free tool
              </span>
              <span className="text-xs font-bold text-blue-300">
                Move the sliders · Instant numbers · No signup
              </span>
            </div>

            <h1 className="font-black leading-[0.85] tracking-tighter">
              <span className="block text-[clamp(2.75rem,7vw,7rem)]">How much could</span>
              <span className="block text-[clamp(2.75rem,7vw,7rem)]">
                AI <span className="italic font-light text-clarity-blue">actually</span>
              </span>
              <span className="block text-[clamp(2.75rem,7vw,7rem)]">save you?</span>
            </h1>

            <p className="mx-auto mt-8 max-w-xl text-lg text-slate-400">
              Most businesses overestimate the cost and underestimate the savings.
              Drag the sliders below to see your real numbers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ CALCULATOR ============ */}
      <section className="relative px-6 pb-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="grid gap-6 lg:grid-cols-12"
          >
            {/* INPUTS */}
            <div className="rounded-[2rem] border border-white/10 bg-[#0a0d1f] p-8 lg:col-span-5 lg:p-10">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-clarity-blue">
                — Step 1
              </div>
              <h3 className="mb-8 text-3xl font-black tracking-tight">Tell us about your team</h3>

              <div className="space-y-7">
                <Slider
                  icon={Users}
                  label="Team size"
                  hint="Knowledge workers only"
                  value={employees}
                  min={1}
                  max={500}
                  step={1}
                  suffix={employees === 1 ? ' person' : ' people'}
                  onChange={setEmployees}
                />
                <Slider
                  icon={Clock}
                  label="Hours/week on repetitive tasks"
                  hint="Per person, conservative"
                  value={hoursPerWeek}
                  min={1}
                  max={40}
                  step={1}
                  suffix=" hrs"
                  onChange={setHoursPerWeek}
                />
                <Slider
                  icon={DollarSign}
                  label="Loaded hourly cost"
                  hint="Salary + benefits + overhead"
                  value={hourlyRate}
                  min={15}
                  max={200}
                  step={5}
                  prefix="$"
                  suffix="/hr"
                  onChange={setHourlyRate}
                />
                <Slider
                  icon={Zap}
                  label="% AI can automate"
                  hint="Industry avg: 55–70%"
                  value={automationRate}
                  min={10}
                  max={95}
                  step={5}
                  suffix="%"
                  onChange={setAutomationRate}
                />
              </div>
            </div>

            {/* RESULTS */}
            <div className="lg:col-span-7">
              <div className="grid gap-4">
                {/* Big number */}
                <div className="relative overflow-hidden rounded-[2rem] border border-clarity-blue/30 bg-gradient-to-br from-blue-600/20 via-[#0a0d1f] to-purple-600/20 p-10">
                  <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/20 blur-[80px]" />
                  <div className="relative">
                    <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-clarity-blue">
                      <Sparkles className="h-3 w-3" />
                      Your estimated annual savings
                    </div>
                    <div className="text-[clamp(3rem,8vw,7rem)] font-black leading-none tracking-tighter text-white">
                      <AnimatedNumber value={r.annualSavings} format={fmtMoney} />
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                      That's{' '}
                      <span className="font-black text-emerald-400">
                        <AnimatedNumber value={r.annualHrs} /> hours
                      </span>{' '}
                      of your team's time, every year.
                    </div>
                  </div>
                </div>

                {/* Bar comparison */}
                <div className="rounded-[2rem] border border-white/10 bg-[#0a0d1f] p-8">
                  <div className="mb-6 flex items-end justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        — Annual labour cost on these tasks
                      </div>
                      <div className="text-lg font-black">Today vs. with AI</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    {/* Today bar */}
                    <div className="text-center">
                      <div className="relative mx-auto mb-3 flex h-48 w-20 items-end overflow-hidden rounded-2xl bg-white/5">
                        <motion.div
                          animate={{ height: `${currentH}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="w-full bg-gradient-to-t from-red-500/70 to-red-400/40"
                        />
                      </div>
                      <div className="text-xl font-black tabular-nums">
                        <AnimatedNumber value={r.currentCost} format={fmtMoney} />
                      </div>
                      <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-red-400">
                        Today
                      </div>
                    </div>

                    {/* Future bar */}
                    <div className="text-center">
                      <div className="relative mx-auto mb-3 flex h-48 w-20 items-end overflow-hidden rounded-2xl bg-white/5">
                        <motion.div
                          animate={{ height: `${Math.max(futureH, 4)}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="w-full bg-gradient-to-t from-emerald-500/70 to-emerald-400/40"
                        />
                      </div>
                      <div className="text-xl font-black tabular-nums">
                        <AnimatedNumber value={r.futureCost} format={fmtMoney} />
                      </div>
                      <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        With AI
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mini stat row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Hrs/wk back', value: Math.round(r.weeklyHrs).toLocaleString() },
                    { label: 'ROI multiple', value: `${r.roi.toFixed(1)}x` },
                    { label: 'Payback', value: `${r.payback.toFixed(1)} mo` },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-white/10 bg-[#0a0d1f] p-5 text-center"
                    >
                      <div className="text-2xl font-black tabular-nums">{s.value}</div>
                      <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to="/signup"
                  state={{ returnTo: '/ai-audit/survey' }}
                  className="group flex h-16 items-center justify-center gap-3 rounded-full bg-clarity-blue text-base font-black text-white shadow-2xl shadow-blue-600/30 transition-all hover:gap-5"
                >
                  Get my personalised roadmap
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-clarity-blue transition-transform group-hover:rotate-45">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </Link>
                <p className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Free 14-page report · 8 minutes · No credit card
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ THE MATH — bento ============ */}
      <section className="border-y border-white/5 bg-[#08091c] px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 grid grid-cols-12 items-end gap-6">
            <div className="col-span-12 lg:col-span-7">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-clarity-blue">
                — Where the numbers come from
              </p>
              <h2 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
                Real businesses. <br />
                <span className="italic font-light text-slate-400">Real numbers.</span>
              </h2>
            </div>
            <p className="col-span-12 max-w-sm text-slate-400 lg:col-span-5">
              Benchmarks pulled from 500+ ClarityWorks engagements between 2023–2025.
              No vendor data. No vendor spin.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* Big — case study */}
            <div className="group relative col-span-12 overflow-hidden rounded-[2rem] border border-white/10 lg:col-span-7">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-30 transition-opacity group-hover:opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050614] via-[#050614]/80 to-transparent" />
              <div className="relative p-10 pt-32">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-clarity-blue">
                  — Case study · Real estate brokerage
                </div>
                <div className="text-[80px] font-black leading-none tracking-tighter">$284k</div>
                <div className="mb-3 text-sm text-slate-400">saved in year one · 12-person team</div>
                <p className="max-w-md text-slate-300">
                  Automated lead routing, appointment scheduling and listing
                  description drafting. Payback in 4.2 months.
                </p>
              </div>
            </div>

            <div className="col-span-12 grid grid-cols-1 gap-4 lg:col-span-5">
              <div className="rounded-[2rem] border border-white/10 bg-[#0a0d1f] p-8">
                <div className="text-5xl font-black tracking-tighter">8–12 hrs</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-clarity-blue">
                  Per knowledge worker per week
                </div>
                <p className="mt-3 text-sm text-slate-400">
                  Time spent on tasks AI can fully or partially automate, across the
                  average North American SMB.
                </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-[#0a0d1f] p-8">
                <div className="text-5xl font-black tracking-tighter">60%</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-clarity-blue">
                  Conservative default
                </div>
                <p className="mt-3 text-sm text-slate-400">
                  Most clients exceed this in year one. We err low so the calculator
                  doesn't oversell.
                </p>
              </div>
            </div>

            <div className="col-span-12 rounded-[2rem] border border-white/10 bg-gradient-to-br from-emerald-600/20 to-[#0a0d1f] p-8 lg:col-span-4">
              <div className="text-4xl font-black">4.2 mo</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                Median payback
              </div>
            </div>
            <div className="col-span-12 rounded-[2rem] border border-white/10 bg-[#0a0d1f] p-8 lg:col-span-4">
              <div className="text-4xl font-black">11.6x</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-clarity-blue">
                Average ROI multiple
              </div>
            </div>
            <div className="col-span-12 rounded-[2rem] border border-white/10 bg-[#0a0d1f] p-8 lg:col-span-4">
              <div className="text-4xl font-black">93%</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-clarity-blue">
                Of clients renew year-2
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="border-t border-white/5 px-6 py-32">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-clarity-blue">— Common questions</p>
            <h2 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
              Frequently <span className="italic font-light text-slate-400">asked.</span>
            </h2>
          </div>
          <FAQ items={roiFAQs} darkMode />
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative overflow-hidden px-6 py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-transparent to-purple-600/15" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-clarity-blue/10 blur-[140px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-6xl font-black leading-[0.9] tracking-tighter sm:text-8xl">
            Numbers look good? <br />
            <span className="italic font-light text-clarity-blue">Let's make them real.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg text-slate-400">
            Take the free 8-minute assessment. We'll send back a custom roadmap
            showing exactly which workflows to automate first — and which to leave
            alone.
          </p>
          <Link
            to="/signup"
            state={{ returnTo: '/ai-audit/survey' }}
            className="group mt-12 inline-flex h-16 items-center gap-3 rounded-full bg-clarity-blue px-10 text-base font-black text-white shadow-2xl shadow-blue-600/30 transition-all hover:gap-5"
          >
            Start the assessment
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-clarity-blue transition-transform group-hover:rotate-45">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ROICalculator;
