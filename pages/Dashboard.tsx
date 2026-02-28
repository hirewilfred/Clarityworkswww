import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Shield, MapPin, Database, Lightbulb, Code, Sparkles, ArrowRight, CheckCircle2, Bot, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const getRecommendations = (overallScore: number, categoryScores: any[]) => {
    const recs = [];
    if (overallScore >= 80) {
        recs.push({ title: "Custom LLM Development", color: "bg-purple-100/80", text: "text-purple-700", border: 'border-purple-200', icon: Code, desc: "Build proprietary AI models using your data." });
        recs.push({ title: "Advanced Automation", color: "bg-blue-100/80", text: "text-blue-700", border: 'border-blue-200', icon: Sparkles, desc: "End-to-end agentic workflow integration." });
    } else {
        const getScore = (cat: string) => categoryScores.find((c: any) => c.category === cat)?.score || 0;

        if (getScore('governance') < 50) {
            recs.push({ title: "AI Governance Service", color: "bg-orange-100/80", text: "text-orange-700", border: 'border-orange-200', icon: Shield, desc: "Establish safe security and usage policies." });
        }
        if (getScore('strategy') < 50) {
            recs.push({ title: "Strategic Roadmap", color: "bg-blue-100/80", text: "text-blue-700", border: 'border-blue-200', icon: MapPin, desc: "Define your company's long-term AI goals." });
        }
        if (getScore('data') < 50) {
            recs.push({ title: "Data Infrastructure", color: "bg-green-100/80", text: "text-green-700", border: 'border-green-200', icon: Database, desc: "Prepare your data lakes for AI readiness." });
        }
        if (recs.length === 0) {
            recs.push({ title: "AI Readiness Bootcamp", color: "bg-indigo-100/80", text: "text-indigo-700", border: 'border-indigo-200', icon: Lightbulb, desc: "Identify low-hanging automation fruit." });
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

    if (loading || (fetchLoading && user)) return <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center text-slate-800">Loading Dashboard...</div>;

    const hasCompletedAiAudit = aiAudits.length > 0;
    const latestAudit = hasCompletedAiAudit ? aiAudits[0] : null;
    const recommendations = latestAudit ? getRecommendations(latestAudit.overall_score, latestAudit.category_scores) : [];

    return (
        <div className="min-h-screen bg-[#F4F7FE] text-slate-800 font-sans pb-24">
            <SEO title="Dashboard - ClarityWorks Studio" description="Manage your AI audits." />

            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-6">
                    <img
                        src="/images/AUDCOMP-LOGO.png"
                        alt="AUDCOMP"
                        className="h-8 w-auto brightness-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/logos/ClarityWorks_logoWH.png'; }}
                    />
                    <div className="h-6 w-px bg-slate-200" />
                    <nav className="hidden md:flex gap-6">
                        <Link to="/dashboard" className="text-sm font-bold bg-slate-900 text-white px-4 py-2 rounded-full">Dashboard</Link>
                        <Link to="#" className="text-sm font-bold text-slate-500 hover:text-slate-900 px-2 py-2 transition-colors">Reports</Link>
                        <Link to="#" className="text-sm font-bold text-slate-500 hover:text-slate-900 px-2 py-2 transition-colors">Analytics</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => signOut()} className="text-sm font-bold text-slate-500 hover:text-red-500 transition-colors">Sign Out</button>
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pt-10">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
                    <p className="text-slate-500 font-medium mt-1">Welcome back. Here is your AI readiness status.</p>
                </div>

                {!hasCompletedAiAudit ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] p-12 border border-slate-100 shadow-sm text-center max-w-2xl mx-auto mt-20">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Bot className="w-10 h-10 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-4">No AI Audit Found</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">Take our free AI Readiness Audit to calculate your score and get matched with custom service plans tailored to your needs.</p>
                        <Link to="/ai-audit" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:scale-105 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                            Start Free Assessment <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Recommendations Widget (Spans 2 columns) */}
                        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">Recommended AI Services</h2>
                                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Based on Score</span>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                {recommendations.map((rec, idx) => (
                                    <div key={idx} className={`${rec.color} ${rec.border} border border-opacity-50 rounded-3xl p-6 relative overflow-hidden group hover:shadow-md transition-shadow`}>
                                        <rec.icon className={`w-8 h-8 ${rec.text} mb-12`} />
                                        <h3 className={`font-black text-lg leading-tight mb-2 ${rec.text}`}>{rec.title}</h3>
                                        <p className={`text-sm ${rec.text} opacity-80 leading-snug font-medium`}>{rec.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Overall Score Widget */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-center items-center relative overflow-hidden">
                            <h2 className="text-lg font-black text-slate-900 mb-8 self-start px-2">Readiness Score</h2>

                            <div className="relative flex items-center justify-center">
                                {/* SVG Ring Chart */}
                                <svg className="w-48 h-48 transform -rotate-90">
                                    {/* Track */}
                                    <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="24" fill="transparent" className="text-slate-100" />
                                    {/* Progress */}
                                    <circle
                                        cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="24" fill="transparent"
                                        className="text-blue-500 drop-shadow-md"
                                        strokeDasharray={`${2 * Math.PI * 80}`}
                                        strokeDashoffset={`${2 * Math.PI * 80 * (1 - latestAudit.overall_score / 100)}`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-slate-900 tracking-tighter">{latestAudit.overall_score}%</span>
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Overall</span>
                                </div>
                            </div>
                        </div>

                        {/* Category Performance Widget */}
                        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                            <h2 className="text-lg font-black text-slate-900 mb-6">Category Detail</h2>
                            <div className="flex flex-col gap-6">
                                {latestAudit.category_scores.map((cat: any, i: number) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <span className="w-32 text-sm font-bold text-slate-500 uppercase tracking-widest">{cat.category}</span>
                                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${cat.score >= 80 ? 'bg-green-500' : cat.score >= 50 ? 'bg-orange-400' : 'bg-red-400'}`}
                                                style={{ width: `${cat.score}%` }}
                                            />
                                        </div>
                                        <span className="w-12 text-right text-sm font-black text-slate-900">{cat.score}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Legacy Assessments */}
                        {audits.length > 0 && (
                            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                                <h2 className="text-lg font-black text-slate-900 mb-6">Legacy Tracking</h2>
                                <div className="space-y-4">
                                    {audits.map(audit => (
                                        <div key={audit.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center group cursor-pointer hover:border-slate-300">
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-800">{audit.industry}</h4>
                                                <span className="text-xs text-slate-400 font-medium">{new Date(audit.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-xs font-black text-slate-600">
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
