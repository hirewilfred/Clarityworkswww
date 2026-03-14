import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Users, BarChart2, Mail, Settings, Loader2, X, Eye, ChevronRight,
    Shield, ShieldOff, Search, CheckCircle2, AlertCircle, Download,
    RefreshCw, Send, Inbox, TrendingUp, UserCheck, ClipboardList,
    LayoutDashboard, Key, Plus, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TabId = 'overview' | 'audits' | 'users' | 'email';

interface UserRow {
    id: string;
    full_name: string | null;
    email?: string;
    organization: string | null;
    phone: string | null;
    has_completed_audit: boolean;
    last_audit_score: number | null;
    is_admin: boolean;
    is_bdm: boolean;
    updated_at: string | null;
    audit_scores?: any[];
}

interface AuditScore {
    id: string;
    user_id: string;
    overall_score: number;
    category_scores: any;
    recommendations: string[];
    created_at: string;
}

interface ApolloLead {
    id: string;
    first_name: string;
    last_name: string;
    title: string;
    email: string;
    organization?: { name: string };
    city?: string;
    state?: string;
    selected?: boolean;
}

interface InstantlyCampaign {
    id: string;
    name: string;
    status: string;
    campaign_analytics?: { sent: number; open_count: number; reply_count: number };
}

const SCORE_COLOR = (score: number) =>
    score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400';

const BAR_COLOR = (score: number) =>
    score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500';

const AdminPortal: React.FC = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabId>('overview');

    // Overview state
    const [stats, setStats] = useState({ totalUsers: 0, completedAudits: 0, avgScore: 0, pending: 0 });
    const [recentUsers, setRecentUsers] = useState<UserRow[]>([]);
    const [statsLoading, setStatsLoading] = useState(true);

    // Audits state
    const [auditUsers, setAuditUsers] = useState<UserRow[]>([]);
    const [auditsLoading, setAuditsLoading] = useState(true);
    const [selectedAudit, setSelectedAudit] = useState<{ user: UserRow; score: AuditScore } | null>(null);
    const [auditResponses, setAuditResponses] = useState<any[]>([]);
    const [auditModalLoading, setAuditModalLoading] = useState(false);

    // Users state
    const [allUsers, setAllUsers] = useState<UserRow[]>([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [userSearch, setUserSearch] = useState('');
    const [togglingUser, setTogglingUser] = useState<string | null>(null);

    // Apollo state
    const [apolloKey, setApolloKey] = useState(() => localStorage.getItem('apollo_api_key') || '');
    const [apolloSaving, setApolloSaving] = useState(false);
    const [apolloJobTitle, setApolloJobTitle] = useState('');
    const [apolloIndustry, setApolloIndustry] = useState('');
    const [apolloCompanySize, setApolloCompanySize] = useState('');
    const [apolloLeads, setApolloLeads] = useState<ApolloLead[]>([]);
    const [apolloLoading, setApolloLoading] = useState(false);
    const [apolloError, setApolloError] = useState<string | null>(null);

    // Instantly state
    const [instantlyKey, setInstantlyKey] = useState(() => localStorage.getItem('instantly_api_key') || '');
    const [instantlySaving, setInstantlySaving] = useState(false);
    const [campaigns, setCampaigns] = useState<InstantlyCampaign[]>([]);
    const [campaignsLoading, setCampaignsLoading] = useState(false);
    const [campaignsError, setCampaignsError] = useState<string | null>(null);
    const [selectedCampaignId, setSelectedCampaignId] = useState('');
    const [addingLeads, setAddingLeads] = useState(false);
    const [addLeadsResult, setAddLeadsResult] = useState<string | null>(null);

    const selectedLeads = apolloLeads.filter(l => l.selected);

    // Fetch overview stats
    const fetchStats = useCallback(async () => {
        if (!supabase) return;
        setStatsLoading(true);
        const [profilesRes, scoresRes, recentRes] = await Promise.all([
            supabase.from('profiles').select('id, has_completed_audit, last_audit_score', { count: 'exact' }),
            supabase.from('audit_scores').select('overall_score'),
            supabase.from('profiles')
                .select('id, full_name, organization, has_completed_audit, last_audit_score, is_admin, updated_at')
                .order('updated_at', { ascending: false })
                .limit(10),
        ]);

        const profiles = profilesRes.data || [];
        const scores = scoresRes.data || [];
        const completed = profiles.filter((p: any) => p.has_completed_audit).length;
        const avg = scores.length > 0 ? Math.round(scores.reduce((s: number, r: any) => s + r.overall_score, 0) / scores.length) : 0;

        setStats({
            totalUsers: profilesRes.count || profiles.length,
            completedAudits: completed,
            avgScore: avg,
            pending: profiles.length - completed,
        });
        setRecentUsers((recentRes.data || []) as UserRow[]);
        setStatsLoading(false);
    }, []);

    // Fetch audit results
    const fetchAuditResults = useCallback(async () => {
        if (!supabase) return;
        setAuditsLoading(true);
        const { data } = await supabase
            .from('profiles')
            .select('id, full_name, organization, has_completed_audit, last_audit_score, is_admin, updated_at, audit_scores(id, overall_score, category_scores, recommendations, created_at)')
            .eq('has_completed_audit', true)
            .order('updated_at', { ascending: false });
        setAuditUsers((data || []) as UserRow[]);
        setAuditsLoading(false);
    }, []);

    // Fetch all users
    const fetchAllUsers = useCallback(async () => {
        if (!supabase) return;
        setUsersLoading(true);
        const { data } = await supabase
            .from('profiles')
            .select('id, full_name, organization, phone, has_completed_audit, last_audit_score, is_admin, is_bdm, updated_at')
            .order('updated_at', { ascending: false });
        setAllUsers((data || []) as UserRow[]);
        setUsersLoading(false);
    }, []);

    useEffect(() => { fetchStats(); }, [fetchStats]);
    useEffect(() => { if (activeTab === 'audits') fetchAuditResults(); }, [activeTab, fetchAuditResults]);
    useEffect(() => { if (activeTab === 'users') fetchAllUsers(); }, [activeTab, fetchAllUsers]);

    const openAuditModal = async (userRow: UserRow) => {
        const score = Array.isArray(userRow.audit_scores) ? userRow.audit_scores[0] : null;
        if (!score || !supabase) return;
        setSelectedAudit({ user: userRow, score });
        setAuditModalLoading(true);
        const { data } = await supabase.from('audit_responses').select('*').eq('user_id', userRow.id);
        setAuditResponses(data || []);
        setAuditModalLoading(false);
    };

    const toggleUserFlag = async (userId: string, field: 'is_admin' | 'is_bdm', current: boolean) => {
        if (!supabase) return;
        setTogglingUser(userId + field);
        await supabase.from('profiles').update({ [field]: !current }).eq('id', userId);
        setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, [field]: !current } : u));
        setTogglingUser(null);
    };

    const saveApolloKey = () => {
        localStorage.setItem('apollo_api_key', apolloKey);
        setApolloSaving(true);
        setTimeout(() => setApolloSaving(false), 1500);
    };

    const saveInstantlyKey = () => {
        localStorage.setItem('instantly_api_key', instantlyKey);
        setInstantlySaving(true);
        setTimeout(() => setInstantlySaving(false), 1500);
    };

    const searchApollo = async () => {
        if (!apolloKey) { setApolloError('Enter your Apollo.io API key first.'); return; }
        setApolloLoading(true);
        setApolloError(null);
        try {
            const body: any = { api_key: apolloKey, page: 1, per_page: 25 };
            if (apolloJobTitle) body.person_titles = [apolloJobTitle];
            if (apolloIndustry) body.organization_industry_tag_ids = [apolloIndustry];
            if (apolloCompanySize) body.organization_num_employees_ranges = [apolloCompanySize];

            const res = await fetch('https://api.apollo.io/api/v1/mixed_people/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error(`Apollo returned ${res.status}`);
            const json = await res.json();
            setApolloLeads((json.people || []).map((p: any) => ({ ...p, selected: false })));
        } catch (e: any) {
            setApolloError(e.message?.includes('Failed to fetch')
                ? 'CORS error: Apollo.io blocks browser requests. Use your Apollo dashboard to export leads, or set up a backend proxy.'
                : e.message);
        } finally {
            setApolloLoading(false);
        }
    };

    const toggleLeadSelect = (id: string) => {
        setApolloLeads(prev => prev.map(l => l.id === id ? { ...l, selected: !l.selected } : l));
    };

    const exportCSV = () => {
        const rows = selectedLeads.length > 0 ? selectedLeads : apolloLeads;
        const csv = ['First Name,Last Name,Title,Company,Email,Location',
            ...rows.map(l => `${l.first_name},${l.last_name},"${l.title}","${l.organization?.name || ''}",${l.email},"${l.city || ''} ${l.state || ''}"`)
        ].join('\n');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        a.download = 'leads.csv';
        a.click();
    };

    const loadCampaigns = async () => {
        if (!instantlyKey) { setCampaignsError('Enter your Instantly.ai API key first.'); return; }
        setCampaignsLoading(true);
        setCampaignsError(null);
        try {
            const res = await fetch(`https://api.instantly.ai/api/v1/campaign/list?api_key=${instantlyKey}&limit=20&skip=0`);
            if (!res.ok) throw new Error(`Instantly returned ${res.status}`);
            const json = await res.json();
            setCampaigns(json || []);
        } catch (e: any) {
            setCampaignsError(e.message?.includes('Failed to fetch')
                ? 'CORS error: Instantly.ai may block direct browser calls. Try from your Instantly dashboard instead.'
                : e.message);
        } finally {
            setCampaignsLoading(false);
        }
    };

    const addLeadsToCampaign = async () => {
        if (!instantlyKey || !selectedCampaignId || selectedLeads.length === 0) return;
        setAddingLeads(true);
        setAddLeadsResult(null);
        try {
            const leads = selectedLeads.map(l => ({
                email: l.email,
                first_name: l.first_name,
                last_name: l.last_name,
                company_name: l.organization?.name || '',
            }));
            const res = await fetch('https://api.instantly.ai/api/v1/lead/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ api_key: instantlyKey, campaign_id: selectedCampaignId, leads }),
            });
            if (!res.ok) throw new Error(`Instantly returned ${res.status}`);
            setAddLeadsResult(`${leads.length} leads added successfully.`);
        } catch (e: any) {
            setAddLeadsResult(`Error: ${e.message}`);
        } finally {
            setAddingLeads(false);
        }
    };

    const filteredUsers = allUsers.filter(u =>
        !userSearch ||
        u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.organization?.toLowerCase().includes(userSearch.toLowerCase())
    );

    const tabs = [
        { id: 'overview' as TabId, label: 'Overview', icon: LayoutDashboard },
        { id: 'audits' as TabId, label: 'Audit Results', icon: ClipboardList },
        { id: 'users' as TabId, label: 'User Management', icon: Users },
        { id: 'email' as TabId, label: 'Cold Email', icon: Mail },
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#050B1A] text-white font-sans">
            <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-400/5 blur-[130px] pointer-events-none" />

            {/* Header */}
            <header className="bg-[#050B1A]/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <img
                        src="/images/AUDCOMP-LOGO.png"
                        alt="ClarityWorks"
                        className="h-8 w-auto brightness-0 invert"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/logos/ClarityWorks_logoWH.png'; }}
                    />
                    <div className="h-6 w-px bg-white/10" />
                    <span className="text-sm font-bold text-slate-300">Admin Portal</span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                        My Dashboard
                    </button>
                    <button onClick={() => signOut()} className="text-sm font-bold text-slate-400 hover:text-red-400 transition-colors">
                        Sign Out
                    </button>
                    <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </header>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-24">
                {/* Tab Navigation */}
                <div className="flex gap-1 bg-white/5 rounded-2xl p-1 mb-8 w-fit border border-white/5">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'text-slate-400 hover:text-white'}`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                        {statsLoading ? (
                            <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-blue-500 animate-spin" /></div>
                        ) : (
                            <>
                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                                    {[
                                        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue' },
                                        { label: 'Completed Audits', value: stats.completedAudits, icon: CheckCircle2, color: 'emerald' },
                                        { label: 'Avg. Score', value: `${stats.avgScore}%`, icon: TrendingUp, color: 'violet' },
                                        { label: 'Pending Audit', value: stats.pending, icon: AlertCircle, color: 'amber' },
                                    ].map((stat) => {
                                        const Icon = stat.icon;
                                        return (
                                            <div key={stat.label} className="backdrop-blur-xl bg-slate-900/40 rounded-2xl p-6 border border-white/5">
                                                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 flex items-center justify-center mb-4`}>
                                                    <Icon className={`h-5 w-5 text-${stat.color}-400`} />
                                                </div>
                                                <div className="text-3xl font-black mb-1">{stat.value}</div>
                                                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Recent Signups */}
                                <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                                        <h2 className="font-bold text-white">Recent Signups</h2>
                                        <button onClick={fetchStats} className="text-slate-400 hover:text-white transition-colors">
                                            <RefreshCw className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/5">
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Company</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Audit</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Score</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Admin</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {recentUsers.map(u => (
                                                    <tr key={u.id} className="hover:bg-white/2 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                                                                    {(u.full_name || 'U').charAt(0).toUpperCase()}
                                                                </div>
                                                                <span className="text-sm font-medium text-slate-200">{u.full_name || 'No name'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-400">{u.organization || '—'}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.has_completed_audit ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700/50 text-slate-400 border border-white/5'}`}>
                                                                {u.has_completed_audit ? 'Complete' : 'Pending'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-bold">
                                                            {u.last_audit_score != null
                                                                ? <span className={SCORE_COLOR(u.last_audit_score)}>{u.last_audit_score}%</span>
                                                                : <span className="text-slate-600">—</span>}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {u.is_admin && <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">Admin</span>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}

                {/* AUDIT RESULTS TAB */}
                {activeTab === 'audits' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                        <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                                <h2 className="font-bold text-white">Completed Audit Results</h2>
                                <button onClick={fetchAuditResults} className="text-slate-400 hover:text-white transition-colors">
                                    <RefreshCw className="h-4 w-4" />
                                </button>
                            </div>
                            {auditsLoading ? (
                                <div className="flex items-center justify-center h-48"><Loader2 className="h-7 w-7 text-blue-500 animate-spin" /></div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Company</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Score</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {auditUsers.map(u => {
                                                const score = Array.isArray(u.audit_scores) ? u.audit_scores[0] : null;
                                                return (
                                                    <tr key={u.id} className="hover:bg-white/2 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                                                                    {(u.full_name || 'U').charAt(0).toUpperCase()}
                                                                </div>
                                                                <span className="text-sm font-medium text-slate-200">{u.full_name || 'No name'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-400">{u.organization || '—'}</td>
                                                        <td className="px-6 py-4">
                                                            {score ? (
                                                                <span className={`text-sm font-black ${SCORE_COLOR(score.overall_score)}`}>{score.overall_score}%</span>
                                                            ) : '—'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-400">
                                                            {score ? new Date(score.created_at).toLocaleDateString() : '—'}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <button
                                                                onClick={() => openAuditModal(u)}
                                                                disabled={!score}
                                                                className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                <Eye className="h-3.5 w-3.5" /> View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {auditUsers.length === 0 && (
                                                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No completed audits yet.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* USER MANAGEMENT TAB */}
                {activeTab === 'users' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                        <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between gap-4 flex-wrap">
                                <h2 className="font-bold text-white">All Users</h2>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by name or company..."
                                            value={userSearch}
                                            onChange={e => setUserSearch(e.target.value)}
                                            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50 w-64"
                                        />
                                    </div>
                                    <button onClick={fetchAllUsers} className="text-slate-400 hover:text-white transition-colors">
                                        <RefreshCw className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            {usersLoading ? (
                                <div className="flex items-center justify-center h-48"><Loader2 className="h-7 w-7 text-blue-500 animate-spin" /></div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Company</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Audit</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Admin</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">BDM</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredUsers.map(u => (
                                                <tr key={u.id} className="hover:bg-white/2 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-slate-700/50 border border-white/10 flex items-center justify-center text-slate-300 text-xs font-bold">
                                                                {(u.full_name || 'U').charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-slate-200">{u.full_name || 'No name'}</div>
                                                                <div className="text-xs text-slate-500">{u.phone || ''}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-400">{u.organization || '—'}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${u.has_completed_audit ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700/50 text-slate-400 border border-white/5'}`}>
                                                            {u.has_completed_audit ? 'Done' : 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => toggleUserFlag(u.id, 'is_admin', u.is_admin)}
                                                            disabled={togglingUser === u.id + 'is_admin' || u.id === user?.id}
                                                            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${u.is_admin
                                                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                                                                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/20'}`}
                                                        >
                                                            {togglingUser === u.id + 'is_admin'
                                                                ? <Loader2 className="h-3 w-3 animate-spin" />
                                                                : u.is_admin ? <Shield className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
                                                            {u.is_admin ? 'Admin' : 'Set Admin'}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => toggleUserFlag(u.id, 'is_bdm', u.is_bdm)}
                                                            disabled={togglingUser === u.id + 'is_bdm'}
                                                            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${u.is_bdm
                                                                ? 'bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                                                                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-violet-500/10 hover:text-violet-400 hover:border-violet-500/20'}`}
                                                        >
                                                            {togglingUser === u.id + 'is_bdm'
                                                                ? <Loader2 className="h-3 w-3 animate-spin" />
                                                                : <UserCheck className="h-3 w-3" />}
                                                            {u.is_bdm ? 'BDM' : 'Set BDM'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredUsers.length === 0 && (
                                                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No users found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* COLD EMAIL TAB */}
                {activeTab === 'email' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-8">

                        {/* Apollo.io Section */}
                        <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                    <Search className="h-4 w-4 text-orange-400" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-white">Apollo.io Lead Search</h2>
                                    <p className="text-xs text-slate-400">Find and export prospects from Apollo's database</p>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* API Key */}
                                <div className="flex gap-3 items-end">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-slate-400 mb-2">Apollo.io API Key</label>
                                        <div className="relative">
                                            <Key className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                type="password"
                                                value={apolloKey}
                                                onChange={e => setApolloKey(e.target.value)}
                                                placeholder="Paste your Apollo API key..."
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={saveApolloKey}
                                        className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:border-white/20 transition-all flex items-center gap-2"
                                    >
                                        {apolloSaving ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : null}
                                        {apolloSaving ? 'Saved' : 'Save Key'}
                                    </button>
                                </div>

                                {/* Search Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-2">Job Title</label>
                                        <input
                                            type="text"
                                            value={apolloJobTitle}
                                            onChange={e => setApolloJobTitle(e.target.value)}
                                            placeholder="e.g. IT Manager"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-2">Industry</label>
                                        <input
                                            type="text"
                                            value={apolloIndustry}
                                            onChange={e => setApolloIndustry(e.target.value)}
                                            placeholder="e.g. Technology"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-2">Company Size</label>
                                        <select
                                            value={apolloCompanySize}
                                            onChange={e => setApolloCompanySize(e.target.value)}
                                            className="w-full bg-[#0d1626] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50"
                                        >
                                            <option value="">Any size</option>
                                            <option value="1,10">1–10</option>
                                            <option value="11,50">11–50</option>
                                            <option value="51,200">51–200</option>
                                            <option value="201,500">201–500</option>
                                            <option value="501,1000">501–1,000</option>
                                            <option value="1001,10000">1,001–10,000</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={searchApollo}
                                        disabled={apolloLoading}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                                    >
                                        {apolloLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                        Search Leads
                                    </button>
                                    {apolloLeads.length > 0 && (
                                        <button onClick={exportCSV} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-sm font-bold text-slate-300 hover:text-white transition-all">
                                            <Download className="h-4 w-4" />
                                            Export CSV {selectedLeads.length > 0 ? `(${selectedLeads.length} selected)` : '(all)'}
                                        </button>
                                    )}
                                </div>

                                {apolloError && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
                                        {apolloError}
                                    </div>
                                )}

                                {apolloLeads.length > 0 && (
                                    <div className="overflow-x-auto rounded-xl border border-white/5">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/5 bg-white/2">
                                                    <th className="px-4 py-3 text-left w-8">
                                                        <input type="checkbox"
                                                            onChange={e => setApolloLeads(prev => prev.map(l => ({ ...l, selected: e.target.checked })))}
                                                            className="rounded"
                                                        />
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-400">Name</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-400">Title</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-400">Company</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-400">Email</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-400">Location</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {apolloLeads.map(lead => (
                                                    <tr key={lead.id} className={`transition-colors ${lead.selected ? 'bg-blue-600/5' : 'hover:bg-white/2'}`}>
                                                        <td className="px-4 py-3">
                                                            <input type="checkbox" checked={!!lead.selected} onChange={() => toggleLeadSelect(lead.id)} className="rounded" />
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-medium text-slate-200">{lead.first_name} {lead.last_name}</td>
                                                        <td className="px-4 py-3 text-sm text-slate-400">{lead.title}</td>
                                                        <td className="px-4 py-3 text-sm text-slate-400">{lead.organization?.name || '—'}</td>
                                                        <td className="px-4 py-3 text-sm text-blue-400">{lead.email}</td>
                                                        <td className="px-4 py-3 text-sm text-slate-500">{lead.city}{lead.city && lead.state ? ', ' : ''}{lead.state}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Instantly.ai Section */}
                        <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                    <Send className="h-4 w-4 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-white">Instantly.ai Campaign Manager</h2>
                                    <p className="text-xs text-slate-400">Manage and push leads to your cold email campaigns</p>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* API Key */}
                                <div className="flex gap-3 items-end">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-slate-400 mb-2">Instantly.ai API Key</label>
                                        <div className="relative">
                                            <Key className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                type="password"
                                                value={instantlyKey}
                                                onChange={e => setInstantlyKey(e.target.value)}
                                                placeholder="Paste your Instantly.ai API key..."
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={saveInstantlyKey}
                                        className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:border-white/20 transition-all flex items-center gap-2"
                                    >
                                        {instantlySaving ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : null}
                                        {instantlySaving ? 'Saved' : 'Save Key'}
                                    </button>
                                    <button
                                        onClick={loadCampaigns}
                                        disabled={campaignsLoading}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                                    >
                                        {campaignsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                        Load Campaigns
                                    </button>
                                </div>

                                {campaignsError && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
                                        {campaignsError}
                                    </div>
                                )}

                                {campaigns.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {campaigns.map(c => {
                                            const analytics = c.campaign_analytics;
                                            return (
                                                <div
                                                    key={c.id}
                                                    onClick={() => setSelectedCampaignId(selectedCampaignId === c.id ? '' : c.id)}
                                                    className={`rounded-xl border p-4 cursor-pointer transition-all ${selectedCampaignId === c.id ? 'border-blue-500/50 bg-blue-600/10' : 'border-white/10 bg-white/3 hover:border-white/20'}`}
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="text-sm font-bold text-white truncate pr-2">{c.name}</div>
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700/50 text-slate-400 border border-white/5'}`}>
                                                            {c.status}
                                                        </span>
                                                    </div>
                                                    {analytics && (
                                                        <div className="grid grid-cols-3 gap-2 text-center">
                                                            <div><div className="text-lg font-black text-white">{analytics.sent}</div><div className="text-xs text-slate-500">Sent</div></div>
                                                            <div><div className="text-lg font-black text-blue-400">{analytics.open_count}</div><div className="text-xs text-slate-500">Opens</div></div>
                                                            <div><div className="text-lg font-black text-emerald-400">{analytics.reply_count}</div><div className="text-xs text-slate-500">Replies</div></div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {selectedLeads.length > 0 && selectedCampaignId && (
                                    <div className="flex items-center gap-4 p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                                        <div className="flex-1 text-sm text-blue-300 font-medium">
                                            Push <span className="font-black text-white">{selectedLeads.length}</span> selected Apollo leads to this campaign
                                        </div>
                                        <button
                                            onClick={addLeadsToCampaign}
                                            disabled={addingLeads}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                                        >
                                            {addingLeads ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                            Add to Campaign
                                        </button>
                                    </div>
                                )}

                                {addLeadsResult && (
                                    <div className={`p-4 rounded-xl text-sm font-medium border ${addLeadsResult.startsWith('Error') ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                                        {addLeadsResult}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Audit Detail Modal */}
            <AnimatePresence>
                {selectedAudit && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setSelectedAudit(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-[#0d1626] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-[#0d1626] px-6 py-4 border-b border-white/10 flex items-center justify-between">
                                <div>
                                    <h3 className="font-black text-white">{selectedAudit.user.full_name || 'User'} — Audit Report</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">{selectedAudit.user.organization || 'No company'} · {new Date(selectedAudit.score.created_at).toLocaleDateString()}</p>
                                </div>
                                <button onClick={() => setSelectedAudit(null)} className="text-slate-400 hover:text-white transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Overall Score */}
                                <div className="flex items-center gap-6">
                                    <div className={`text-5xl font-black ${SCORE_COLOR(selectedAudit.score.overall_score)}`}>
                                        {selectedAudit.score.overall_score}%
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white mb-1">Overall AI Readiness</div>
                                        <div className={`text-sm font-medium ${SCORE_COLOR(selectedAudit.score.overall_score)}`}>
                                            {selectedAudit.score.overall_score >= 80 ? 'High Readiness' : selectedAudit.score.overall_score >= 50 ? 'Moderate Readiness' : 'Early Stage'}
                                        </div>
                                    </div>
                                </div>

                                {/* Category Scores */}
                                {Array.isArray(selectedAudit.score.category_scores) && selectedAudit.score.category_scores.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-300 mb-3">Category Breakdown</h4>
                                        <div className="space-y-3">
                                            {selectedAudit.score.category_scores.map((cat: any) => (
                                                <div key={cat.category}>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="font-medium text-slate-300 capitalize">{cat.category}</span>
                                                        <span className={`font-black ${SCORE_COLOR(cat.score)}`}>{Math.round(cat.score)}%</span>
                                                    </div>
                                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${cat.score}%` }}
                                                            transition={{ duration: 0.6, ease: 'easeOut' }}
                                                            className={`h-full rounded-full ${BAR_COLOR(cat.score)}`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recommendations */}
                                {selectedAudit.score.recommendations?.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-300 mb-3">Recommendations</h4>
                                        <ul className="space-y-2">
                                            {selectedAudit.score.recommendations.map((rec: string, i: number) => (
                                                <li key={i} className="flex gap-2 text-sm text-slate-400">
                                                    <ChevronRight className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                                    {rec}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Audit Responses */}
                                {auditModalLoading ? (
                                    <div className="flex items-center gap-2 text-slate-400 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Loading responses...</div>
                                ) : auditResponses.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-300 mb-3">Raw Responses ({auditResponses.length} questions)</h4>
                                        <div className="space-y-2">
                                            {auditResponses.map((r: any) => (
                                                <div key={r.id} className="flex items-center justify-between text-sm bg-white/3 rounded-lg px-4 py-2.5">
                                                    <span className="text-slate-400 font-mono text-xs">{r.question_id}</span>
                                                    <span className="font-bold text-white">{JSON.stringify(r.answer)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPortal;
