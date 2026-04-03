import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import { Shield, MapPin, Database, Lightbulb, Code, Sparkles, ArrowRight, Bot, ShieldCheck, Briefcase, Calendar, MessageSquare, TrendingUp, Users, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const getRecommendations = (overallScore: number, categoryScores: any[]) => {
    const recs = [];
    if (overallScore >= 80) {
        recs.push({ title: "Custom Autonomous Agents", color: "bg-purple-500/10", text: "text-purple-400", border: 'border-purple-500/20', icon: Code, desc: "Build proprietary agentic AI models customized to your internal data and workflows." });
        recs.push({ title: "End-to-End Automation", color: "bg-blue-500/10", text: "text-blue-400", border: 'border-blue-500/20', icon: Sparkles, desc: "Full-scale agentic workflow integration across your entire technical stack." });
    } else {
        const getScore = (cat: string) => categoryScores.find((c: any) => c.category === cat)?.score || 0;

        if (getScore('governance') < 50) {
            recs.push({ title: "AI Security & Governance", color: "bg-orange-500/10", text: "text-orange-400", border: 'border-orange-500/20', icon: Shield, desc: "Establish safe security barriers before deploying autonomous agents." });
        }
        if (getScore('strategy') < 50) {
            recs.push({ title: "Strategic AI Roadmap", color: "bg-blue-500/10", text: "text-blue-400", border: 'border-blue-500/20', icon: MapPin, desc: "Define exactly where agentic AI can replace manual tasks in your business." });
        }
        if (getScore('data') < 50) {
            recs.push({ title: "Data Preparation", color: "bg-green-500/10", text: "text-green-400", border: 'border-green-500/20', icon: Database, desc: "Organize your data lakes so AI agents can retrieve accurate context." });
        }
        if (recs.length === 0 || overallScore < 50) {
            recs.push({ title: "Agentic AI Bootcamp", color: "bg-indigo-500/10", text: "text-indigo-400", border: 'border-indigo-500/20', icon: Lightbulb, desc: "An introductory session to discover how AI agents can transform your daily work." });
        }
    }
    return recs.slice(0, 3);
};

const Dashboard: React.FC = () => {
    const { user, loading, signOut, isAdmin } = useAuth();
    const [audits, setAudits] = useState<any[]>([]);
    const [aiAudits, setAiAudits] = useState<any[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    // Score passed directly from survey if DB save had issues
    const freshScore = location.state?.freshScore;

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (user) {
            const fetchAudits = async () => {
                const { data: legacyData } = await supabase
                    .from('audits')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (legacyData) setAudits(legacyData);

                const { data: aiData } = await supabase
                    .from('audit_scores')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (aiData) setAiAudits(aiData);

                setFetchLoading(false);
            };
            fetchAudits();
        }
    }, [user]);

    if (loading || (fetchLoading && user)) return <div className="min-h-screen bg-[#050B1A] flex items-center justify-center text-white">Loading Dashboard...</div>;

    // Use DB data if available, fall back to freshScore passed from survey
    const hasCompletedAiAudit = aiAudits.length > 0 || !!freshScore;
    const latestAudit = aiAudits.length > 0
        ? aiAudits[0]
        : freshScore
            ? { overall_score: freshScore.overallScore, category_scores: freshScore.categoryScores }
            : null;
    const recommendations = latestAudit ? getRecommendations(latestAudit.overall_score, latestAudit.category_scores) : [];

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#050B1A] text-white font-sans pb-24">
            <SEO title="Dashboard - ClarityWorks Studio" description="Manage your AI audits." />

            {/* Dynamic Background Shapes matching main site */}
            <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-400/5 blur-[130px] pointer-events-none" />

            {/* Top Navigation Bar */}
            <header className="bg-[#050B1A]/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-6">
                    <img
                        src="/logos/ClarityWorks_logoWH.png"
                        alt="ClarityWorks"
                        className="h-24 md:h-32 w-auto"
                    />
                    <div className="h-6 w-px bg-white/10" />
                    <nav className="hidden md:flex gap-6">
                        <Link to="/dashboard" className="text-sm font-bold bg-white/10 text-white px-4 py-2 rounded-full border border-white/5">Dashboard</Link>
                        <Link to="#" className="text-sm font-bold text-slate-400 hover:text-white px-2 py-2 transition-colors">Reports</Link>
                        <Link to="#" className="text-sm font-bold text-slate-400 hover:text-white px-2 py-2 transition-colors">Analytics</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    {isAdmin && (
                        <Link to="/admin" title="Admin Portal" className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400 border border-violet-500/30 hover:bg-violet-600/40 hover:text-violet-300 transition-all">
                            <ShieldCheck className="w-5 h-5" />
                        </Link>
                    )}
                    <button onClick={() => signOut()} className="text-sm font-bold text-slate-400 hover:text-red-400 transition-colors">Sign Out</button>
                    <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-white tracking-tight">Overview</h1>
                    <p className="text-slate-400 font-medium mt-1">Welcome back, {user?.email}. Here is your AI readiness status.</p>
                </div>

                {!hasCompletedAiAudit ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="backdrop-blur-xl bg-slate-900/40 rounded-[2rem] p-12 border border-white/5 shadow-2xl text-center max-w-2xl mx-auto mt-20 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />
                        <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
                            <Bot className="w-10 h-10 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-4 relative z-10">No AI Audit Found</h2>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto relative z-10">Take our free AI Readiness Audit to calculate your score and get matched with custom service plans tailored to your needs.</p>
                        <Link to="/ai-audit" className="relative z-10 inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:scale-105 hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                            Start Free Assessment <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Recommendations Widget (Spans 2 columns) */}
                        <div className="lg:col-span-2 backdrop-blur-xl bg-slate-900/40 rounded-[2rem] p-8 border border-white/5 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <h2 className="text-xl font-black text-white tracking-tight">Recommended AI Services</h2>
                                <span className="text-sm font-bold text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">Based on Score</span>
                            </div>
                            <div className="grid md:grid-cols-3 gap-5 relative z-10">
                                {recommendations.map((rec, idx) => (
                                    <div key={idx} className={`${rec.color} ${rec.border} border rounded-3xl p-6 relative overflow-hidden group hover:border-opacity-100 transition-colors backdrop-blur-sm`}>
                                        <rec.icon className={`w-8 h-8 ${rec.text} mb-12`} />
                                        <h3 className={`font-black text-lg leading-tight mb-2 text-white`}>{rec.title}</h3>
                                        <p className={`text-sm text-slate-400 leading-snug font-medium`}>{rec.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Overall Score Widget */}
                        <div className="backdrop-blur-xl bg-slate-900/40 rounded-[2rem] p-8 border border-white/5 shadow-xl flex flex-col justify-center items-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/10 pointer-events-none" />
                            <h2 className="text-lg font-black text-white mb-8 self-start px-2 relative z-10">Readiness Score</h2>

                            <div className="relative flex items-center justify-center z-10 mt-4 mb-4">
                                {/* SVG Ring Chart */}
                                <svg className="w-52 h-52 transform -rotate-90">
                                    {/* Track */}
                                    <circle cx="104" cy="104" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-800" />
                                    {/* Progress */}
                                    <circle
                                        cx="104" cy="104" r="88" stroke="currentColor" strokeWidth="16" fill="transparent"
                                        className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                                        strokeDasharray={`${2 * Math.PI * 88}`}
                                        strokeDashoffset={`${2 * Math.PI * 88 * (1 - latestAudit.overall_score / 100)}`}
                                        strokeLinecap="round"
                                        style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-white tracking-tighter">{latestAudit.overall_score}%</span>
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">Overall</span>
                                </div>
                            </div>
                        </div>

                        {/* Category Performance Widget */}
                        <div className="lg:col-span-2 backdrop-blur-xl bg-slate-900/40 rounded-[2rem] p-8 border border-white/5 shadow-xl relative overflow-hidden">
                            <h2 className="text-lg font-black text-white mb-8 relative z-10">Category Detail</h2>
                            <div className="flex flex-col gap-6 relative z-10">
                                {latestAudit.category_scores.map((cat: any, i: number) => (
                                    <div key={i} className="flex items-center gap-6">
                                        <span className="w-32 text-sm font-bold text-slate-400 uppercase tracking-widest">{cat.category}</span>
                                        <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${cat.score}%` }}
                                                transition={{ duration: 1, delay: i * 0.1 }}
                                                className={`h-full rounded-full ${cat.score >= 80 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : cat.score >= 50 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.5)]'}`}
                                            />
                                        </div>
                                        <span className="w-12 text-right text-sm font-black text-white">{cat.score}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Legacy Assessments */}
                        {audits.length > 0 && (
                            <div className="backdrop-blur-xl bg-slate-900/40 rounded-[2rem] p-8 border border-white/5 shadow-xl relative overflow-hidden">
                                <h2 className="text-lg font-black text-white mb-6 relative z-10">Legacy Tracking</h2>
                                <div className="space-y-4 relative z-10">
                                    {audits.map(audit => (
                                        <div key={audit.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center group cursor-pointer hover:bg-white/10 transition-colors">
                                            <div>
                                                <h4 className="font-bold text-sm text-white">{audit.industry}</h4>
                                                <span className="text-xs text-slate-400 font-medium">{new Date(audit.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-slate-800 shadow-inner border border-white/10 flex items-center justify-center text-sm font-black text-slate-300">
                                                {audit.readiness_score}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- New Post-Audit Content: Agentic AI Education & Booking --- */}
                {hasCompletedAiAudit && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="mt-12 space-y-12"
                    >
                        {latestAudit.overall_score < 50 && (
                            <div className="relative overflow-hidden rounded-[2rem] border border-blue-500/30 bg-blue-500/5 p-8 sm:p-10 backdrop-blur-xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                    <div className="h-20 w-20 shrink-0 rounded-full bg-blue-500/20 border border-blue-400/30 flex justify-center items-center">
                                        <Sparkles className="w-10 h-10 text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white mb-3">You are just starting your AI journey.</h2>
                                        <p className="text-slate-300 leading-relaxed text-lg font-medium">
                                            Scoring below 50 means your organization has massive upside potential. While standard software requires manual operation, <span className="text-blue-400 font-bold">Agentic AI</span> works autonomously alongside your team. You're in the perfect position to leapfrog competitors by directly implementing AI agents instead of legacy tools.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="text-center mt-16 mb-8">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-4">
                                The Power of Autonomy
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                                Meet Your New <span className="text-indigo-400">Digital Workforce</span>
                            </h2>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                Unlike standard chatbots that just answer questions, Agentic AI can take actions across your systems, reason through problems, and complete multi-step workflows.
                            </p>
                        </div>

                        {/* Sample Agents Grid */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: MessageSquare,
                                    name: "Customer Success Agent",
                                    desc: "Autonomously reads incoming support tickets, checks internal databases for answers, processes refunds if authorized, and resolves 70% of inquiries without human touch.",
                                    color: "bg-sky-500/10",
                                    iconColor: "text-sky-400",
                                    border: "border-sky-500/20",
                                    hoverBorder: "hover:border-sky-500/50"
                                },
                                {
                                    icon: Users,
                                    name: "Sales Outreach Agent",
                                    desc: "Researches prospects on LinkedIn, drafts highly personalized emails, monitors replies, and directly schedules meetings on your calendar when a lead shows interest.",
                                    color: "bg-emerald-500/10",
                                    iconColor: "text-emerald-400",
                                    border: "border-emerald-500/20",
                                    hoverBorder: "hover:border-emerald-500/50"
                                },
                                {
                                    icon: Database,
                                    name: "Data Analyst Agent",
                                    desc: "Connects to your CRM and ERP, runs weekly revenue analysis, spots anomalies in customer churn, and generates a visual summary report into Slack every Monday morning.",
                                    color: "bg-amber-500/10",
                                    iconColor: "text-amber-400",
                                    border: "border-amber-500/20",
                                    hoverBorder: "hover:border-amber-500/50"
                                }
                            ].map((agent, idx) => (
                                <div key={idx} className={`rounded-[2rem] p-8 border ${agent.border} bg-slate-900/40 backdrop-blur-xl ${agent.hoverBorder} transition-all duration-300 group`}>
                                    <div className={`w-14 h-14 rounded-2xl ${agent.color} flex items-center justify-center mb-6`}>
                                        <agent.icon className={`w-7 h-7 ${agent.iconColor} group-hover:scale-110 transition-transform`} />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3">{agent.name}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed font-medium mb-6">
                                        {agent.desc}
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            <CheckCircle2 className="w-4 h-4 text-slate-600" /> Independent Reasoning
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            <CheckCircle2 className="w-4 h-4 text-slate-600" /> Multi-System Actions
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Business Case */}
                        <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900/80 to-[#050B1A] p-8 md:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 mt-16 shadow-2xl">
                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
                            <div className="flex-1 relative z-10">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs uppercase tracking-widest border border-purple-500/30 mb-6">
                                    <Briefcase className="w-3.5 h-3.5" /> Real Business Case
                                </span>
                                <h3 className="text-3xl md:text-4xl font-black text-white mb-6">
                                    From 48 Hours to <span className="text-purple-400">3 Minutes</span>
                                </h3>
                                <p className="text-slate-300 leading-relaxed text-lg mb-6">
                                    A mid-sized logistics company was taking 48 hours to manually ingest vendor invoices, verify them against purchase orders, and input data into their ERP.
                                </p>
                                <p className="text-slate-300 leading-relaxed text-lg mb-8 border-l-2 border-purple-500 pl-4 bg-purple-500/5 p-4 rounded-r-2xl">
                                    We deployed an <strong className="text-white">autonomous billing agent</strong> that reads emails, extracts invoice items, cross-references PO databases, flags discrepancies for review, and approves standard invoices. Processing time dropped to 3 minutes, error rates fell to near-zero, and they saved thousands of labor hours annually.
                                </p>
                                <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm font-bold text-slate-400">
                                    <li className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-emerald-400" /> 16x Faster Processing
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-emerald-400" /> 99.8% Accuracy
                                    </li>
                                </ul>
                            </div>
                            <div className="lg:w-1/3 relative z-10 w-full">
                                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-md text-center">
                                    <h4 className="text-white font-black text-xl mb-4">Ready to automate your workflows?</h4>
                                    <p className="text-slate-400 text-sm mb-8 font-medium">
                                        Let's discuss how an agentic AI architecture can fit into your exact operations and what the ROI would look like.
                                    </p>
                                    <a
                                        href="https://calendar.app.google/VUq1AmZrofJUiWN99"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group w-full flex items-center justify-center gap-3 rounded-full bg-blue-600 px-8 py-4 text-base font-black text-white transition-all hover:scale-[1.02] hover:bg-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.4)]"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        Book Your Strategy Call
                                    </a>
                                    <p className="text-xs text-slate-500 mt-4 font-bold uppercase tracking-widest">100% Free · No Commitment</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
