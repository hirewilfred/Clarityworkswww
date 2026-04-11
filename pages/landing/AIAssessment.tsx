import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Brain,
  Target,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Lock,
} from 'lucide-react';
import SEO from '../../components/SEO';
import { useAuth } from '../../contexts/AuthContext';

const AIAssessment: React.FC = () => {
  const { user } = useAuth();

  const ctaTo = user ? '/ai-audit/survey' : '/signup';
  const ctaState = user ? undefined : { returnTo: '/ai-audit/survey' };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050614] text-white">
      <SEO
        title="Free AI Readiness Assessment | ClarityWorks Studio"
        description="Get a professional AI readiness score and a custom roadmap in under 10 minutes. Free assessment by ClarityWorks Studio."
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
            <Brain className="h-4 w-4" />
            100% Free · No Credit Card Required
          </div>

          <h1 className="mb-8 text-5xl font-black tracking-tight sm:text-7xl">
            Discover Your <br />
            <span className="text-clarity-blue">AI Readiness Score.</span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            In under 10 minutes, learn exactly where your business stands on the AI
            adoption curve — and get a custom roadmap with the highest-ROI opportunities
            already mapped out.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to={ctaTo}
              state={ctaState}
              className="group flex h-16 w-full items-center justify-center gap-2 rounded-[1.75rem] bg-blue-600 text-lg font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02] hover:bg-blue-700 sm:w-72"
            >
              Start Free Assessment
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="text-sm text-slate-500">⏱ Avg completion: 8 minutes</p>
          </div>
        </motion.section>

        {/* What you get */}
        <section className="mt-32">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-purple-400">
              Your Free Report Includes
            </div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              A Complete Diagnostic, <br />
              <span className="text-clarity-blue">Not A Sales Pitch.</span>
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Target,
                title: 'Readiness Score (0–100)',
                desc: 'Benchmarked against businesses in your industry and size.',
              },
              {
                icon: Sparkles,
                title: 'Top 5 Quick Wins',
                desc: 'Specific automations you can deploy within 30 days for instant ROI.',
              },
              {
                icon: TrendingUp,
                title: 'Custom Roadmap',
                desc: 'A phased plan tailored to your tools, team, and budget.',
              },
              {
                icon: Lock,
                title: 'Risk Audit',
                desc: 'Where your data and workflows are exposed if you adopt AI carelessly.',
              },
              {
                icon: Clock,
                title: 'Time Recovery Estimate',
                desc: 'Hours per week your team could reclaim through smart automation.',
              },
              {
                icon: CheckCircle2,
                title: 'Vendor-Neutral Advice',
                desc: 'No upsells. No hidden agenda. Just what would actually work.',
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

        {/* How it works */}
        <section className="mt-32">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-purple-400">
                How It Works
              </div>
              <h2 className="mb-6 text-4xl font-black tracking-tight sm:text-5xl">
                Three Simple Steps. <br />
                <span className="text-clarity-blue">Zero Cost.</span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-slate-400">
                We've helped hundreds of businesses figure out their AI strategy. The
                assessment takes less time than your morning coffee — and the report is
                yours to keep, no strings attached.
              </p>
              <Link
                to={ctaTo}
                state={ctaState}
                className="group inline-flex items-center gap-2 text-lg font-bold text-blue-400 transition-colors hover:text-blue-300"
              >
                Begin Now
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {[
                { step: '01', title: 'Answer 25 Questions', desc: 'About your tools, team, and current workflows.' },
                { step: '02', title: 'Receive Your Score', desc: 'Instantly delivered to your inbox with a full breakdown.' },
                { step: '03', title: 'Book A Walkthrough', desc: 'Optional 30-min call to discuss your roadmap with an expert.' },
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
            Stop Guessing. <br />
            <span className="italic text-purple-400">Start Optimizing.</span>
          </h2>
          <p className="relative z-10 mx-auto mb-10 max-w-2xl text-lg text-slate-400">
            Join 500+ business leaders who've used our assessment to find clarity in the
            AI noise.
          </p>
          <div className="relative z-10 flex justify-center">
            <Link
              to={ctaTo}
              state={ctaState}
              className="group flex h-16 w-full items-center justify-center gap-2 rounded-[1.75rem] bg-blue-600 text-lg font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02] hover:bg-blue-700 sm:w-80"
            >
              Get My Free Score
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default AIAssessment;
