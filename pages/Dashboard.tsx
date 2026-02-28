import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Shield, MapPin, Database, Lightbulb, Code, Sparkles, ArrowRight, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const getRecommendations = (overallScore: number, categoryScores: any[]) => {
    const recs = [];
    if (overallScore >= 80) {
        recs.push({ title: "Custom LLM Development", color: "bg-purple-500/10", text: "text-purple-400", border: 'border-purple-500/20', icon: Code, desc: "Build proprietary AI models using your data." });
        recs.push({ title: "Advanced Automation", color: "bg-blue-500/10", text: "text-blue-400", border: 'border-blue-500/20', icon: Sparkles, desc: "End-to-end agentic workflow integration." });
    } else {
        const getScore = (cat: string) => categoryScores.find((c: any) => c.category === cat)?.score || 0;

        if (getScore('governance') < 50) {
            recs.push({ title: "AI Governance Service", color: "bg-orange-500/10", text: "text-orange-400", border: 'border-orange-500/20', icon: Shield, desc: "Establish safe security and usage policies." });
        }
        if (getScore('strategy') < 50) {
            recs.push({ title: "Strategic Roadmap", color: "bg-blue-500/10", text: "text-blue-400", border: 'border-blue-500/20', icon: MapPin, desc: "Define your company's long-term AI goals." });
        }
        if (getScore('data') < 50) {
            recs.push({ title: "Data Infrastructure", color: "bg-green-500/10", text: "text-green-400", border: 'border-green-500/20', icon: Database, desc: "Prepare your data lakes for AI readiness." });
        }
        if (recs.length === 0) {
            recs.push({ title: "AI Readiness Bootcamp", color: "bg-indigo-500/10", text: "text-indigo-400", border: 'border-indigo-500/20', icon: Lightbulb, desc: "Identify low-hanging automation fruit." });
        }
    }
    return recs.slice(0, 3);
};

const Dashboard: React.FC = () => {
    const { user, loading, signOut } = useAuth();
    const [audits, setAudits] = useState<any[]>([]);
    const [aiAudits, setAiAudits] = useState<any[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const navigate = useNavigate();

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

    const hasCompletedAiAudit = aiAudits.length > 0;
    const latestAudit = hasCompletedAiAudit ? aiAudits[0] : null;
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
                        src="/images/AUDCOMP-LOGO.png"
                        alt="AUDCOMP"
                        className="h-8 w-auto brightness-0 invert"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/logos/ClarityWorks_logoWH.png'; }}
                    />
                    <div className="h-6 w-px bg-white/10" />
                    <nav className="hidden md:flex gap-6">
                        <Link to="/dashboard" className="text-sm font-bold bg-white/10 text-white px-4 py-2 rounded-full border border-white/5">Dashboard</Link>
                        <Link to="#" className="text-sm font-bold text-slate-400 hover:text-white px-2 py-2 transition-colors">Reports</Link>
                        <Link to="#" className="text-sm font-bold text-slate-400 hover:text-white px-2 py-2 transition-colors">Analytics</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
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
            </main>
        </div>
    );
};

export default Dashboard;
