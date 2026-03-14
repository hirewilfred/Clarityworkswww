import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BarChart2, Target, TrendingUp, Mail, Search,
  Share2, Megaphone, LineChart, CheckCircle, Star, Zap,
  Award, Globe, RefreshCw, Sparkles
} from 'lucide-react';

/* ─── Animated Counter ─────────────────────────────────────────────────────── */
const Counter: React.FC<{ end: number; suffix?: string; prefix?: string }> = ({
  end, suffix = '', prefix = '',
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, end]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

/* ─── Audit Pillar Card ─────────────────────────────────────────────────────── */
interface AuditCardProps {
  icon: React.ElementType;
  title: string;
  desc: string;
  score: number;
  delay: number;
}
const AuditCard: React.FC<AuditCardProps> = ({ icon: Icon, title, desc, score, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.55, delay }}
    whileHover={{ y: -6, scale: 1.02 }}
    className="group relative rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl hover:border-blue-500/40 hover:bg-white/[0.05] transition-all duration-500 cursor-default"
  >
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    <div className="relative z-10">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
          <Icon className="h-6 w-6 text-blue-400" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-white">
            {score}<span className="text-slate-500 text-sm font-medium">/100</span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Avg. Score</div>
        </div>
      </div>
      <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
      <div className="mt-4 h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
          initial={{ width: 0 }}
          whileInView={{ width: `${score}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: delay + 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  </motion.div>
);

/* ─── Page Component ────────────────────────────────────────────────────────── */
const MarketingAssessment: React.FC = () => {
  const [activePulse, setActivePulse] = useState(0);

  useEffect(() => {
    const navbar = document.querySelector('nav');
    const footer = document.querySelector('footer');
    if (navbar) navbar.style.display = 'none';
    if (footer) footer.style.display = 'none';
    return () => {
      if (navbar) navbar.style.display = 'block';
      if (footer) footer.style.display = 'block';
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActivePulse(p => (p + 1) % 3), 2800);
    return () => clearInterval(t);
  }, []);

  const auditAreas = [
    { icon: Target,    title: 'Brand & Positioning',   desc: 'How clearly your brand communicates value and differentiates from competitors.',  score: 58 },
    { icon: Search,    title: 'SEO & Organic Search',  desc: 'Visibility in search engines and the quality of your content strategy.',           score: 41 },
    { icon: Megaphone, title: 'Paid Advertising',      desc: 'ROI on ad spend across Google, Meta, and other paid channels.',                    score: 63 },
    { icon: Mail,      title: 'Email & Nurture Flows', desc: 'List health, automation quality, and conversion of email sequences.',              score: 35 },
    { icon: Share2,    title: 'Social Media Presence', desc: 'Engagement rates, audience growth, and platform-specific performance.',            score: 49 },
    { icon: BarChart2, title: 'Analytics & Attribution',desc: 'Data quality, tracking setup, and ability to measure marketing ROI.',             score: 29 },
    { icon: LineChart, title: 'Lead Gen & CRO',        desc: 'Landing page conversion rates, lead magnets, and funnel optimization.',            score: 44 },
    { icon: Globe,     title: 'Competitive Landscape', desc: 'Your positioning against key competitors and market share opportunities.',          score: 52 },
  ];

  const steps = [
    {
      icon: Zap,
      number: '01',
      title: 'Answer 20 Strategic Questions',
      desc: 'Our diagnostic covers all 8 marketing pillars — brand, content, SEO, paid, email, social, analytics, and competitive landscape.',
    },
    {
      icon: RefreshCw,
      number: '02',
      title: 'AI Analyzes 200+ Data Points',
      desc: 'Our model benchmarks your answers against industry leaders to identify your biggest growth opportunities and critical gaps.',
    },
    {
      icon: Award,
      number: '03',
      title: 'Receive Your Custom Scorecard',
      desc: 'Get an instant report with your marketing maturity score, prioritized action items, and a 90-day roadmap to measurable growth.',
    },
  ];

  const testimonials = [
    {
      quote: "Within 2 weeks of implementing the recommendations, we saw a 34% increase in qualified leads.",
      author: 'Jennifer Walsh',
      role: 'CMO, PeakBridge Solutions',
      rating: 5,
    },
    {
      quote: "I had no idea our attribution model was costing us $40K/month in misallocated ad spend. This audit found it instantly.",
      author: 'Michael Torres',
      role: 'Head of Growth, LaunchLayer',
      rating: 5,
    },
    {
      quote: "The competitive gap analysis alone was worth 10x the price. And it's completely free — that's remarkable.",
      author: 'Rachel Kim',
      role: 'Founder, Bloom Digital',
      rating: 5,
    },
  ];

  const scorecardBars = [
    { label: 'Brand & Positioning', val: 82, color: 'bg-green-400' },
    { label: 'SEO & Content',       val: 54, color: 'bg-yellow-400' },
    { label: 'Email Marketing',     val: 38, color: 'bg-red-400' },
    { label: 'Analytics',           val: 61, color: 'bg-blue-500' },
    { label: 'Paid Media',          val: 76, color: 'bg-green-400' },
  ];

  const quickWins = [
    'Overall marketing maturity score (0–100)',
    'Pillar-by-pillar breakdown with benchmarks',
    'Top 5 highest-impact quick wins',
    '90-day AI-powered action roadmap',
    'Competitive gap analysis summary',
    'Estimated revenue impact per fix',
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050614] text-white selection:bg-blue-500/30">

      {/* ── Animated background orbs ───────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.14, 0.06] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -right-40 h-[700px] w-[700px] rounded-full bg-blue-600"
          style={{ filter: 'blur(140px)' }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-indigo-500"
          style={{ filter: 'blur(120px)' }}
        />
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0], opacity: [0.03, 0.07, 0.03] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          className="absolute top-1/2 left-1/3 h-[400px] w-[400px] rounded-full bg-violet-500"
          style={{ filter: 'blur(100px)' }}
        />
      </div>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 z-50 flex w-full items-center justify-between px-6 md:px-8 py-5 backdrop-blur-xl border-b border-white/5 bg-[#050614]/80">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logos/ClarityWorks_logoWH.png"
            alt="ClarityWorks Studio"
            className="h-9 w-auto"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white/50 hidden sm:block border-l border-white/10 pl-3">
            Marketing Studio
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            500+ Assessments Completed
          </span>
          <Link
            to="/signup"
            className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-black text-white transition-all hover:bg-blue-500 hover:scale-[1.04] shadow-lg shadow-blue-600/25"
          >
            Start Free <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <main className="relative z-10">

        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <section className="flex min-h-screen flex-col items-center justify-center px-6 pt-28 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85 }}
            className="max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.07] px-5 py-2 text-sm font-bold text-blue-400 backdrop-blur-xl"
            >
              <Sparkles className="h-4 w-4" />
              Free Marketing Assessment — No Credit Card Required
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="mb-6 text-5xl sm:text-7xl lg:text-[8rem] font-black tracking-tighter leading-[0.86]"
            >
              Uncover What's{' '}
              <span className="text-gradient">Holding Your<br />Marketing Back.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto mb-5 max-w-2xl text-xl text-slate-400 leading-relaxed font-medium"
            >
              Get a personalized marketing scorecard and AI-powered action plan —
              benchmarked against industry leaders. Takes 4 minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mb-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500 font-semibold"
            >
              {['No credit card', '4 minutes', 'Instant results', 'Custom roadmap'].map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  {item}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/signup"
                className="group flex items-center justify-center gap-3 rounded-[1.75rem] bg-blue-600 px-10 h-16 text-lg font-black text-white transition-all hover:scale-[1.03] hover:bg-blue-500 shadow-2xl shadow-blue-600/25 w-full sm:w-auto"
              >
                Start My Free Assessment
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/case-studies"
                className="text-slate-400 hover:text-white text-sm font-semibold transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
              >
                See sample results →
              </Link>
            </motion.div>
          </motion.div>

          {/* Stat strip */}
          <div className="mt-20 w-full max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: 500,  suffix: '+',    label: 'Audits Completed' },
              { val: 94,   suffix: '%',    label: 'Found New Opportunities' },
              { val: 4,    suffix: ' min', label: 'To Complete' },
              { val: 8,    suffix: '',     label: 'Key Areas Audited' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 + i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center backdrop-blur-xl hover:border-blue-500/20 transition-colors"
              >
                <div className="text-3xl font-black text-white mb-1">
                  <Counter end={s.val} suffix={s.suffix} />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 8 Audit Pillars ──────────────────────────────────────────────── */}
        <section className="px-6 py-28">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-300">
                <BarChart2 className="h-3.5 w-3.5 text-blue-400" />
                8 Key Marketing Pillars
              </div>
              <h2 className="text-5xl lg:text-6xl font-black tracking-tighter mb-5">
                Everything We <span className="text-clarity-blue italic">Diagnose</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Most businesses have blind spots in 4 or more of these areas.
                Our AI finds yours and tells you exactly what to fix first.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {auditAreas.map((area, i) => (
                <AuditCard key={i} {...area} delay={i * 0.075} />
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-10 text-center text-xs text-slate-600"
            >
              * Average scores based on 500+ completed assessments. Most businesses score under 50 — discover where you stand.
            </motion.p>
          </div>
        </section>

        {/* ── How It Works (white section) ─────────────────────────────────── */}
        <section className="px-6 py-28 bg-white text-slate-900 rounded-t-[4rem] shadow-[0_-50px_100px_rgba(0,0,0,0.45)]">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <span className="inline-block px-5 py-2 rounded-full bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-6">
                Simple 3-Step Process
              </span>
              <h2 className="text-5xl lg:text-6xl font-black tracking-tighter mb-5">
                From Zero to <span className="text-clarity-blue italic">Clarity</span>
              </h2>
              <p className="text-xl text-slate-500 max-w-xl mx-auto leading-relaxed">
                In 4 minutes you'll know more about your marketing than most agencies charge
                $5,000 to discover.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-10 relative">
              {/* Connector line */}
              <div className="hidden lg:block absolute top-11 left-[calc(16.66%+3rem)] right-[calc(16.66%+3rem)] h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: i * 0.15 }}
                  className="relative text-center group"
                >
                  <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-50 border-2 border-blue-100 group-hover:border-blue-400 group-hover:bg-blue-100 transition-all duration-400 shadow-lg group-hover:shadow-blue-100/60">
                    <step.icon className="h-10 w-10 text-blue-600" />
                    <div className="absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-black shadow-md">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-3 tracking-tight">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-16 text-center"
            >
              <Link
                to="/signup"
                className="group inline-flex items-center justify-center gap-3 rounded-[1.75rem] bg-blue-600 px-10 h-16 text-lg font-black text-white transition-all hover:scale-[1.03] hover:bg-blue-700 shadow-xl shadow-blue-600/20"
              >
                Get My Free Scorecard
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── Sample Report Preview (white) ────────────────────────────────── */}
        <section className="px-6 py-28 bg-white text-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">

              {/* Left copy */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block px-5 py-2 rounded-full bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-6">
                  What You Get
                </span>
                <h2 className="text-5xl font-black tracking-tighter mb-6 leading-[0.9]">
                  Your Personal<br />
                  <span className="text-clarity-blue italic">Marketing Scorecard</span>
                </h2>
                <p className="text-lg text-slate-500 leading-relaxed mb-8">
                  Every assessment generates a detailed report with your score across all 8 pillars,
                  a prioritized action list, and a 90-day roadmap tailored to your business.
                </p>
                <div className="space-y-3.5">
                  {quickWins.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 text-slate-700 font-medium"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right: Scorecard mockup */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="rounded-3xl border border-slate-200 bg-white shadow-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  <div className="flex items-center justify-between mb-7 relative z-10">
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Your Marketing Score</div>
                      <div className="text-6xl font-black text-slate-900">
                        <Counter end={73} /><span className="text-2xl text-slate-300 font-medium"> /100</span>
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <TrendingUp className="h-3 w-3" /> Above average
                      </div>
                    </div>
                    <div className="h-20 w-20 rounded-full border-8 border-blue-100 bg-blue-50 flex items-center justify-center">
                      <Award className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="space-y-3.5 relative z-10">
                    {scorecardBars.map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-600">{item.label}</span>
                          <span className="text-slate-900">{item.val}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${item.color}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.val}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl bg-blue-50 border border-blue-100 p-4 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-black uppercase tracking-wider text-blue-600">Top Quick Win</span>
                    </div>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                      Improve email open rates by 22% by optimizing your subject line formula and send-time scheduling.
                    </p>
                  </div>
                </div>

                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-5 -left-5 rounded-2xl border border-slate-200 bg-white shadow-xl p-4 flex items-center gap-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">+34% Leads</div>
                    <div className="text-xs text-slate-400">Avg. 90-day result</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────────────────────── */}
        <section className="px-6 py-32 bg-[#050614] text-white rounded-t-[4rem] shadow-[0_-50px_100px_rgba(0,0,0,0.5)]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-300">
                <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                Client Results
              </div>
              <h2 className="text-5xl lg:text-6xl font-black tracking-tighter mb-5">
                What Our Clients <span className="text-clarity-blue italic">Discovered</span>
              </h2>
              <p className="text-xl text-slate-500 max-w-xl mx-auto">
                Real businesses. Real results. Real clarity.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  whileHover={{ y: -6 }}
                  className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl hover:border-blue-500/40 hover:bg-white/[0.05] transition-all duration-500"
                >
                  <div className="flex mb-5">
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Star key={si} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white text-lg font-medium leading-relaxed mb-6">
                    "{t.quote}"
                  </p>
                  <div className="border-t border-white/10 pt-5">
                    <div className="font-black text-white">{t.author}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">{t.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="relative px-6 py-32 overflow-hidden bg-[#050614]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full bg-blue-600/[0.07] blur-[130px]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-[3rem] border border-white/10 bg-white/[0.03] p-12 lg:p-20 backdrop-blur-xl"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.07] px-5 py-2 text-sm font-bold text-blue-400">
                <Award className="h-4 w-4" />
                100% Free — No Strings Attached
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter mb-6">
                Stop Guessing.<br />
                <span className="text-clarity-blue italic">Start Growing.</span>
              </h2>

              <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
                Get your custom marketing scorecard and 90-day action plan in 4 minutes. Join 500+
                businesses that found their biggest growth opportunity.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Link
                  to="/signup"
                  className="group flex items-center justify-center gap-3 rounded-[1.75rem] bg-blue-600 px-10 h-16 text-lg font-black text-white transition-all hover:scale-[1.03] hover:bg-blue-500 shadow-2xl shadow-blue-600/25 w-full sm:w-auto"
                >
                  Get My Free Assessment
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500 font-semibold">
                {['No credit card', '4 minutes', '100% free', 'Instant results'].map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] py-10 text-center text-sm text-slate-600 bg-[#030410]">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <span>© {new Date().getFullYear()} ClarityWorks Studio. All rights reserved.</span>
          <span className="hidden sm:inline text-white/10">·</span>
          <Link to="/" className="text-slate-500 hover:text-white transition-colors">Back to Main Site</Link>
          <span className="hidden sm:inline text-white/10">·</span>
          <Link to="/about" className="text-slate-500 hover:text-white transition-colors">About Us</Link>
        </div>
      </footer>
    </div>
  );
};

export default MarketingAssessment;
