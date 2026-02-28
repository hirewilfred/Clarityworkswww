
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';

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

    if (loading || (fetchLoading && user)) return <div className="min-h-screen bg-[#050614] flex items-center justify-center text-white">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-[#050614] text-white pt-24 pb-12">
            <SEO title="Dashboard - ClarityWorks Studio" description="Manage your AI audits." />

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Your Dashboard</h1>
                        <p className="text-slate-400">Welcome, {user?.email}</p>
                    </div>
                    <button onClick={() => signOut()} className="text-sm font-bold text-slate-500 hover:text-white uppercase tracking-widest border border-white/10 px-4 py-2 rounded-lg hover:border-white/30 transition-all">Sign Out</button>
                </div>

                <div className="mb-12">
                    <Link to="/ai-audit" className="inline-flex items-center gap-3 bg-clarity-blue px-6 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">
                        <i className="fas fa-plus"></i> New AI Audit
                    </Link>
                </div>

                <h2 className="text-xl font-bold text-slate-300 uppercase tracking-widest mb-6">Recent AI Audits</h2>
                {aiAudits.length === 0 ? (
                    <div className="glass-panel p-12 rounded-[2rem] border-dashed border-white/10 text-center mb-12">
                        <p className="text-slate-500 mb-6">You haven't run the AI Readiness Audit yet.</p>
                        <Link to="/ai-audit" className="text-clarity-blue font-bold hover:underline">Start your free audit</Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {aiAudits.map((audit) => (
                            <div key={audit.id} className="glass-panel p-8 rounded-[2rem] border-white/5 hover:border-clarity-blue/30 transition-all group relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors" />
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{new Date(audit.created_at).toLocaleDateString()}</span>
                                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-clarity-blue font-black border border-blue-500/20 text-xl shadow-lg shadow-blue-500/10">
                                        {audit.overall_score}
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-white group-hover:text-clarity-blue transition-colors relative z-10">
                                    AI Readiness Score
                                </h3>
                                <p className="text-slate-400 text-sm mb-4 relative z-10">Your overall readiness score is {audit.overall_score}%.</p>
                            </div>
                        ))}
                    </div>
                )}

                <h2 className="text-xl font-bold text-slate-300 uppercase tracking-widest mb-6">Legacy Assessments</h2>

                {audits.length === 0 ? (
                    <div className="glass-panel p-12 rounded-[2rem] border-dashed border-white/10 text-center">
                        <p className="text-slate-500 mb-6">You haven't run any AI audits yet.</p>
                        <Link to="/ai-assessment" className="text-clarity-blue font-bold hover:underline">Start your first audit</Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {audits.map((audit) => (
                            <div key={audit.id} className="glass-panel p-8 rounded-[2rem] border-white/5 hover:border-clarity-blue/30 transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{new Date(audit.created_at).toLocaleDateString()}</span>
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-clarity-blue font-black border border-blue-500/20">
                                        {audit.readiness_score}
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-white group-hover:text-clarity-blue transition-colors">
                                    {audit.industry} Assessment
                                </h3>
                                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{audit.pain_point}</p>
                                <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-wider">
                                    <span>{audit.company_size}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
