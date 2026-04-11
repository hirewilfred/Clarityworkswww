import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calculator,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Zap,
  Sparkles,
} from 'lucide-react';
import SEO from '../../components/SEO';

const ROICalculator: React.FC = () => {
  const [employees, setEmployees] = useState(10);
  const [hoursPerWeek, setHoursPerWeek] = useState(8);
  const [hourlyRate, setHourlyRate] = useState(45);
  const [automationRate, setAutomationRate] = useState(60);

  const results = useMemo(() => {
    const weeklyHoursReclaimed = employees * hoursPerWeek * (automationRate / 100);
    const annualHoursReclaimed = weeklyHoursReclaimed * 50; // 50 working weeks
    const annualSavings = annualHoursReclaimed * hourlyRate;
    const monthlySavings = annualSavings / 12;
    // Conservative deployment cost assumption baked into ROI multiple
    const estimatedInvestment = Math.max(8000, employees * 600);
    const roiMultiple = annualSavings / estimatedInvestment;
    const paybackMonths = estimatedInvestment / monthlySavings;

    return {
      weeklyHoursReclaimed: Math.round(weeklyHoursReclaimed),
      annualHoursReclaimed: Math.round(annualHoursReclaimed),
      annualSavings: Math.round(annualSavings),
      monthlySavings: Math.round(monthlySavings),
      roiMultiple: roiMultiple.toFixed(1),
      paybackMonths: paybackMonths.toFixed(1),
    };
  }, [employees, hoursPerWeek, hourlyRate, automationRate]);

  const formatCurrency = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050614] text-white">
      <SEO
        title="Free AI Automation ROI Calculator | ClarityWorks Studio"
        description="Calculate exactly how much your business could save by automating repetitive tasks with AI. Free interactive tool."
      />

      <div className="absolute right-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[130px]" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[130px]" />

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-sm font-medium text-blue-400 backdrop-blur-xl">
            <Calculator className="h-4 w-4" />
            Free Interactive Tool · Instant Results
          </div>

          <h1 className="mb-8 text-5xl font-black tracking-tight sm:text-7xl">
            How Much Could AI <br />
            <span className="text-clarity-blue">Actually Save You?</span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            Most businesses overestimate the cost of AI and underestimate the savings.
            Move the sliders below to see your real numbers — instantly.
          </p>
        </motion.section>

        {/* Calculator */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 grid gap-8 lg:grid-cols-5"
        >
          {/* Inputs */}
          <div className="rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl lg:col-span-2 lg:p-10">
            <h3 className="mb-8 text-2xl font-black">Your Business</h3>

            <div className="space-y-8">
              <SliderInput
                icon={Users}
                label="Team size"
                value={employees}
                min={1}
                max={500}
                step={1}
                suffix={employees === 1 ? 'employee' : 'employees'}
                onChange={setEmployees}
              />
              <SliderInput
                icon={Clock}
                label="Hours/week per person on repetitive tasks"
                value={hoursPerWeek}
                min={1}
                max={40}
                step={1}
                suffix="hrs"
                onChange={setHoursPerWeek}
              />
              <SliderInput
                icon={DollarSign}
                label="Average hourly cost (loaded)"
                value={hourlyRate}
                min={15}
                max={200}
                step={5}
                suffix="/hr"
                prefix="$"
                onChange={setHourlyRate}
              />
              <SliderInput
                icon={Zap}
                label="% of those tasks AI can automate"
                value={automationRate}
                min={10}
                max={95}
                step={5}
                suffix="%"
                onChange={setAutomationRate}
              />
            </div>
          </div>

          {/* Results */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-blue-500/20 bg-gradient-to-br from-blue-600/10 via-slate-900/40 to-purple-600/10 p-8 backdrop-blur-xl lg:col-span-3 lg:p-10">
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/20 blur-[80px]" />

            <div className="relative z-10">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-purple-400">
                <Sparkles className="h-3 w-3" />
                Your Results
              </div>
              <h3 className="mb-8 text-2xl font-black">Estimated Annual Impact</h3>

              <div className="mb-8 rounded-3xl border border-white/10 bg-black/40 p-8 text-center">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                  Annual Savings
                </p>
                <p className="text-5xl font-black tracking-tighter text-white sm:text-6xl">
                  {formatCurrency(results.annualSavings)}
                </p>
              </div>

              <div className="mb-8 grid grid-cols-2 gap-4">
                <ResultCard
                  label="Hours Reclaimed/Year"
                  value={results.annualHoursReclaimed.toLocaleString()}
                />
                <ResultCard
                  label="Monthly Savings"
                  value={formatCurrency(results.monthlySavings)}
                />
                <ResultCard label="ROI Multiple" value={`${results.roiMultiple}x`} />
                <ResultCard label="Payback Period" value={`${results.paybackMonths} mo`} />
              </div>

              <Link
                to="/signup"
                state={{ returnTo: '/ai-audit/survey' }}
                className="group flex h-14 w-full items-center justify-center gap-2 rounded-[1.5rem] bg-blue-600 text-base font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.01] hover:bg-blue-700"
              >
                Get My Personalized Roadmap
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="mt-3 text-center text-xs text-slate-500">
                Free PDF report · No credit card · Takes 8 minutes
              </p>
            </div>
          </div>
        </motion.section>

        {/* Disclaimer */}
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-slate-600">
          Estimates based on industry benchmarks from 500+ ClarityWorks engagements. Your
          actual savings depend on workflow complexity, team adoption, and tool
          selection. Book a free consultation for a precise quote.
        </p>

        {/* Why this matters */}
        <section className="mt-32">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-purple-400">
              The Math Behind The Tool
            </div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Real Numbers. <br />
              <span className="text-clarity-blue">Real Businesses.</span>
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: Clock,
                title: 'Time Audit',
                desc: 'On average, knowledge workers spend 8–12 hours per week on tasks AI can fully or partially automate.',
              },
              {
                icon: TrendingUp,
                title: 'Conservative Estimates',
                desc: 'Our default 60% automation rate is below what most clients actually achieve in their first year.',
              },
              {
                icon: DollarSign,
                title: 'Loaded Hourly Cost',
                desc: 'We use loaded cost (salary + benefits + overhead) — the real number CFOs care about.',
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
            Numbers Look Good? <br />
            <span className="italic text-purple-400">Let's Make Them Real.</span>
          </h2>
          <p className="relative z-10 mx-auto mb-10 max-w-2xl text-lg text-slate-400">
            Take the free 8-minute AI assessment to get a custom roadmap showing exactly
            which workflows to automate first.
          </p>
          <div className="relative z-10 flex justify-center">
            <Link
              to="/signup"
              state={{ returnTo: '/ai-audit/survey' }}
              className="group flex h-16 w-full items-center justify-center gap-2 rounded-[1.75rem] bg-blue-600 text-lg font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02] hover:bg-blue-700 sm:w-80"
            >
              Start Free Assessment
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

interface SliderInputProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  prefix?: string;
  onChange: (v: number) => void;
}

const SliderInput: React.FC<SliderInputProps> = ({
  icon: Icon,
  label,
  value,
  min,
  max,
  step,
  suffix,
  prefix,
  onChange,
}) => (
  <div>
    <div className="mb-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
        <Icon className="h-4 w-4 text-blue-400" />
        {label}
      </div>
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm font-black tabular-nums text-blue-300">
        {prefix}
        {value.toLocaleString()} {suffix}
      </div>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-blue-500"
    />
  </div>
);

const ResultCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-2xl border border-white/5 bg-black/30 p-5">
    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
      {label}
    </p>
    <p className="text-2xl font-black tabular-nums text-white">{value}</p>
  </div>
);

export default ROICalculator;
