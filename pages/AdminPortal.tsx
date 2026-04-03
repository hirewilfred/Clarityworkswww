import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Users, Mail, Loader2, X, Eye, ChevronRight,
    Shield, ShieldOff, Search, CheckCircle2, AlertCircle, Download,
    RefreshCw, Send, TrendingUp, UserCheck, ClipboardList,
    LayoutDashboard, Key, Plus, Zap, Play, Pause,
    Save, Trash2, ExternalLink, Target, FileText,
} from 'lucide-react';
import LinkedInOutreach from '../components/LinkedInOutreach';
import BlogAdmin from '../components/BlogAdmin';
import { motion, AnimatePresence } from 'framer-motion';

type TabId = 'overview' | 'leads' | 'audits' | 'users' | 'email' | 'linkedin' | 'blog';

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

interface ApifyLead {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    title?: string;
    company?: string;
    location?: string;
    linkedin_url?: string;
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

const APIFY_ACTORS = [
    {
        id: 'apify/linkedin-profile-scraper',
        label: 'LinkedIn Profile Scraper',
        template: '{\n  "searchTerms": ["IT Manager Toronto"],\n  "maxItems": 25\n}',
    },
    {
        id: 'curious_coder/apollo-io-scraper',
        label: 'Apollo.io Scraper',
        template: '{\n  "personTitles": ["IT Manager"],\n  "industry": "Technology",\n  "employeesRange": "11-50",\n  "maxResults": 25\n}',
    },
    {
        id: 'custom',
        label: 'Custom Actor',
        template: '{\n  \n}',
    },
];

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

    // Apify state
    const [apifyKey, setApifyKey] = useState('');
    const [apifySaving, setApifySaving] = useState(false);
    const [apifyActorId, setApifyActorId] = useState(APIFY_ACTORS[0].id);
    const [apifyCustomActorId, setApifyCustomActorId] = useState('');
    const [apifyInput, setApifyInput] = useState(APIFY_ACTORS[0].template);
    const [apifyLeads, setApifyLeads] = useState<ApifyLead[]>([]);
    const [apifyLoading, setApifyLoading] = useState(false);
    const [apifyError, setApifyError] = useState<string | null>(null);
    const [autoPush, setAutoPush] = useState(false);
    const [savedScrapers, setSavedScrapers] = useState<any[]>([]);
    const [savedScrapersSaving, setSavedScrapersSaving] = useState(false);

    // Instantly state
    const [instantlyKey, setInstantlyKey] = useState('');
    const [instantlySaving, setInstantlySaving] = useState(false);
    const [campaigns, setCampaigns] = useState<InstantlyCampaign[]>([]);
    const [campaignsLoading, setCampaignsLoading] = useState(false);
    const [campaignsError, setCampaignsError] = useState<string | null>(null);
    const [selectedCampaignId, setSelectedCampaignId] = useState('');
    const [addingLeads, setAddingLeads] = useState(false);
    const [addLeadsResult, setAddLeadsResult] = useState<string | null>(null);
    const [showCreateCampaign, setShowCreateCampaign] = useState(false);
    const [newCampaignName, setNewCampaignName] = useState('');
    const [creatingCampaign, setCreatingCampaign] = useState(false);
    const [togglingCampaign, setTogglingCampaign] = useState<string | null>(null);

    const selectedApifyLeads = apifyLeads.filter(l => l.selected);

    // Load API keys from Supabase user_metadata on mount
    useEffect(() => {
        if (user?.user_metadata) {
            if (user.user_metadata.instantly_api_key) {
                setInstantlyKey(user.user_metadata.instantly_api_key);
            }
            if (user.user_metadata.apify_api_key) {
                setApifyKey(user.user_metadata.apify_api_key);
            }
            if (user.user_metadata.saved_scrapers) {
                setSavedScrapers(user.user_metadata.saved_scrapers);
            }
        }
    }, [user]);

    // Auto-load campaigns when instantlyKey becomes available
    useEffect(() => {
        if (instantlyKey && campaigns.length === 0 && !campaignsLoading) {
            loadCampaigns();
        }
    }, [instantlyKey]);

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
        setStats({ totalUsers: profilesRes.count || profiles.length, completedAudits: completed, avgScore: avg, pending: profiles.length - completed });
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

    // Save Apify key to Supabase user_metadata
    const saveApifyKey = async () => {
        if (!supabase) return;
        setApifySaving(true);
        await supabase.auth.updateUser({ data: { apify_api_key: apifyKey } });
        setTimeout(() => setApifySaving(false), 1500);
    };

    // Save Instantly key to Supabase user_metadata
    const saveInstantlyKey = async () => {
        if (!supabase) return;
        setInstantlySaving(true);
        await supabase.auth.updateUser({ data: { instantly_api_key: instantlyKey } });
        setTimeout(() => setInstantlySaving(false), 1500);
    };

    const saveScraperConfig = async (name: string) => {
        if (!supabase) return;
        setSavedScrapersSaving(true);
        const newConfig = {
            id: Date.now(),
            name,
            actorId: apifyActorId === 'custom' ? apifyCustomActorId : apifyActorId,
            input: apifyInput,
            autoPush
        };
        const updated = [...savedScrapers, newConfig];
        setSavedScrapers(updated);
        await supabase.auth.updateUser({ data: { saved_scrapers: updated } });
        setSavedScrapersSaving(false);
    };

    const deleteScraperConfig = async (id: number) => {
        if (!supabase) return;
        const updated = savedScrapers.filter(s => s.id !== id);
        setSavedScrapers(updated);
        await supabase.auth.updateUser({ data: { saved_scrapers: updated } });
    };

    const loadScraperConfig = (config: any) => {
        const actor = APIFY_ACTORS.find(a => a.id === config.actorId);
        if (actor) {
            setApifyActorId(config.actorId);
        } else {
            setApifyActorId('custom');
            setApifyCustomActorId(config.actorId);
        }
        setApifyInput(config.input);
        setAutoPush(config.autoPush);
    };

    // Run Apify scraper
    const runApifyScraper = async () => {
        if (!apifyKey) { setApifyError('Enter your Apify API key first.'); return; }
        const actorId = apifyActorId === 'custom' ? apifyCustomActorId : apifyActorId;
        if (!actorId) { setApifyError('Enter a custom actor ID.'); return; }
        let parsedInput: any = {};
        try { parsedInput = JSON.parse(apifyInput); } catch { setApifyError('Invalid JSON input.'); return; }
        setApifyLoading(true);
        setApifyError(null);
        setApifyLeads([]);
        try {
            const res = await fetch(
                `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/run-sync-get-dataset-items?token=${apifyKey}&timeout=120`,
                { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsedInput) }
            );
            if (!res.ok) throw new Error(`Apify returned ${res.status}`);
            const items: any[] = await res.json();
            const leads = items
                .filter(item => item.email || item.emails?.length)
                .map((item, idx) => ({
                    id: item.id || String(idx),
                    email: item.email || item.emails?.[0] || '',
                    first_name: item.firstName || item.first_name || (item.name || '').split(' ')[0] || '',
                    last_name: item.lastName || item.last_name || (item.name || '').split(' ').slice(1).join(' ') || '',
                    title: item.title || item.jobTitle || item.headline || '',
                    company: item.company || item.companyName || item.organization?.name || '',
                    location: item.location || item.city || '',
                    linkedin_url: item.linkedinUrl || item.profileUrl || '',
                    selected: false,
                }));
            setApifyLeads(leads);
            if (leads.length === 0) {
                setApifyError('No leads with emails found. Try a different actor or input parameters.');
            } else if (autoPush && selectedCampaignId) {
                // Auto-push leads if toggle is on
                const leadsToPush = leads.map(l => ({
                    email: l.email,
                    first_name: l.first_name,
                    last_name: l.last_name,
                    company_name: l.company || '',
                }));
                setAddingLeads(true);
                try {
                    let pushRes = await fetch('https://api.instantly.ai/api/v2/leads', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${instantlyKey}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ campaign_id: selectedCampaignId, leads: leadsToPush }),
                    });
                    if (!pushRes.ok) {
                        pushRes = await fetch('https://api.instantly.ai/api/v1/lead/add', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ api_key: instantlyKey, campaign_id: selectedCampaignId, leads: leadsToPush }),
                        });
                    }
                    if (pushRes.ok) {
                        setAddLeadsResult(`${leadsToPush.length} leads automatically pushed to campaign.`);
                    } else {
                        throw new Error('Auto-push failed');
                    }
                } catch (err: any) {
                    setAddLeadsResult(`Auto-push error: ${err.message}`);
                } finally {
                    setAddingLeads(false);
                }
            }
        } catch (e: any) {
            setApifyError(e.message);
        } finally {
            setApifyLoading(false);
        }
    };

    const exportApifyCSV = () => {
        const rows = selectedApifyLeads.length > 0 ? selectedApifyLeads : apifyLeads;
        const csv = ['First Name,Last Name,Title,Company,Email,Location,LinkedIn',
            ...rows.map(l => `${l.first_name},${l.last_name},"${l.title || ''}","${l.company || ''}",${l.email},"${l.location || ''}","${l.linkedin_url || ''}"`)
        ].join('\n');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        a.download = 'apify-leads.csv';
        a.click();
    };

    // Load campaigns — tries v2 Bearer auth, falls back to v1 api_key param
    const loadCampaigns = async () => {
        if (!instantlyKey) { setCampaignsError('Enter your Instantly API key first.'); return; }
        setCampaignsLoading(true);
        setCampaignsError(null);
        try {
            let res = await fetch('https://api.instantly.ai/api/v2/campaigns?limit=100', {
                headers: { 'Authorization': `Bearer ${instantlyKey}` },
            });
            if (res.ok) {
                const json = await res.json();
                setCampaigns(Array.isArray(json) ? json : (json.items || json.data || []));
            } else {
                // Fallback to v1
                res = await fetch(`https://api.instantly.ai/api/v1/campaign/list?api_key=${instantlyKey}&limit=100&skip=0`);
                if (!res.ok) throw new Error(`Instantly returned ${res.status}`);
                const json = await res.json();
                setCampaigns(Array.isArray(json) ? json : (json.data || []));
            }
        } catch (e: any) {
            setCampaignsError(e.message?.includes('Failed to fetch')
                ? 'Network error — check your API key and try again.'
                : e.message);
        } finally {
            setCampaignsLoading(false);
        }
    };

    const createCampaign = async () => {
        if (!instantlyKey || !newCampaignName.trim()) return;
        setCreatingCampaign(true);
        setCampaignsError(null);
        try {
            const res = await fetch('https://api.instantly.ai/api/v2/campaigns', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${instantlyKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCampaignName.trim() }),
            });
            if (!res.ok) throw new Error(`Failed to create campaign (${res.status})`);
            setNewCampaignName('');
            setShowCreateCampaign(false);
            await loadCampaigns();
        } catch (e: any) {
            setCampaignsError(e.message);
        } finally {
            setCreatingCampaign(false);
        }
    };

    const toggleCampaignStatus = async (campaignId: string, currentStatus: string) => {
        if (!instantlyKey) return;
        setTogglingCampaign(campaignId);
        const isActive = currentStatus?.toLowerCase() === 'active' || currentStatus === '1';
        try {
            const res = await fetch(`https://api.instantly.ai/api/v2/campaigns/${campaignId}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${instantlyKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: isActive ? 'paused' : 'active' }),
            });
            if (res.ok) {
                setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, status: isActive ? 'paused' : 'active' } : c));
            }
        } catch { }
        setTogglingCampaign(null);
    };

    const addLeadsToCampaign = async () => {
        if (!instantlyKey || !selectedCampaignId || selectedApifyLeads.length === 0) return;
        setAddingLeads(true);
        setAddLeadsResult(null);
        try {
            const leads = selectedApifyLeads.map(l => ({
                email: l.email,
                first_name: l.first_name,
                last_name: l.last_name,
                company_name: l.company || '',
            }));
            // Try v2
            let res = await fetch('https://api.instantly.ai/api/v2/leads', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${instantlyKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ campaign_id: selectedCampaignId, leads }),
            });
            if (!res.ok) {
                // Fallback to v1
                res = await fetch('https://api.instantly.ai/api/v1/lead/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ api_key: instantlyKey, campaign_id: selectedCampaignId, leads }),
                });
            }
            if (!res.ok) throw new Error(`Instantly returned ${res.status}`);
            setAddLeadsResult(`${leads.length} leads added to campaign successfully.`);
            setApifyLeads(prev => prev.map(l => ({ ...l, selected: false })));
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
        { id: 'leads' as TabId, label: 'Prospect Leads', icon: UserCheck },
        { id: 'audits' as TabId, label: 'Audit Results', icon: ClipboardList },
        { id: 'users' as TabId, label: 'User Management', icon: Users },
        { id: 'linkedin' as TabId, label: 'LinkedIn Outreach', icon: Target },
        { id: 'email' as TabId, label: 'Email Outreach', icon: Mail },
        { id: 'blog' as TabId, label: 'Blog', icon: FileText },
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#050B1A] text-white font-sans">
            <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-400/5 blur-[130px] pointer-events-none" />

            {/* Header */}
            <header className="bg-[#050B1A]/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <img src="/logos/ClarityWorks_logoWH.png" alt="ClarityWorks" className="h-24 md:h-32 w-auto" />
                    <div className="h-6 w-px bg-white/10" />
                    <span className="text-sm font-bold text-slate-300">Admin Portal</span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">My Dashboard</button>
                    <button onClick={() => signOut()} className="text-sm font-bold text-slate-400 hover:text-red-400 transition-colors">Sign Out</button>
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
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white'}`}
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
                                <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                                        <h2 className="font-bold text-white">Recent Signups</h2>
                                        <button onClick={fetchStats} className="text-slate-400 hover:text-white transition-colors"><RefreshCw className="h-4 w-4" /></button>
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
                                                            {u.last_audit_score != null ? <span className={SCORE_COLOR(u.last_audit_score)}>{u.last_audit_score}%</span> : <span className="text-slate-600">—</span>}
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

                {/* PROSPECT LEADS TAB */}
                {activeTab === 'leads' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                        <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h2 className="font-bold text-white">Prospect Leads</h2>
                                    <p className="text-xs text-slate-500">Users who joined but haven't completed their AI audit yet.</p>
                                </div>
                                <button onClick={fetchAllUsers} className="text-slate-400 hover:text-white transition-colors"><RefreshCw className="h-4 w-4" /></button>
                            </div>
                            {usersLoading ? (
                                <div className="flex items-center justify-center h-48"><Loader2 className="h-7 w-7 text-blue-500 animate-spin" /></div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Prospect</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Company</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Joined At</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {allUsers.filter(u => !u.has_completed_audit).map(u => (
                                                <tr key={u.id} className="hover:bg-white/2 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">
                                                                {(u.full_name || 'U').charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-200">{u.full_name || 'No name'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-400">{u.organization || '—'}</td>
                                                    <td className="px-6 py-4 text-xs text-slate-300 font-medium">{u.phone || 'No phone'}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-500">{u.updated_at ? new Date(u.updated_at).toLocaleDateString() : '—'}</td>
                                                </tr>
                                            ))}
                                            {allUsers.filter(u => !u.has_completed_audit).length === 0 && (
                                                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No pending leads at this time.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* AUDIT RESULTS TAB */}
                {activeTab === 'audits' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                        <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                                <h2 className="font-bold text-white">Completed Audit Results</h2>
                                <button onClick={fetchAuditResults} className="text-slate-400 hover:text-white transition-colors"><RefreshCw className="h-4 w-4" /></button>
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
                                                        <td className="px-6 py-4">{score ? <span className={`text-sm font-black ${SCORE_COLOR(score.overall_score)}`}>{score.overall_score}%</span> : '—'}</td>
                                                        <td className="px-6 py-4 text-sm text-slate-400">{score ? new Date(score.created_at).toLocaleDateString() : '—'}</td>
                                                        <td className="px-6 py-4">
                                                            <button onClick={() => openAuditModal(u)} disabled={!score} className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
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
                                        <input type="text" placeholder="Search by name or company..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50 w-64" />
                                    </div>
                                    <button onClick={fetchAllUsers} className="text-slate-400 hover:text-white transition-colors"><RefreshCw className="h-4 w-4" /></button>
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
                                                            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${u.is_admin ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/20'}`}
                                                        >
                                                            {togglingUser === u.id + 'is_admin' ? <Loader2 className="h-3 w-3 animate-spin" /> : u.is_admin ? <Shield className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
                                                            {u.is_admin ? 'Admin' : 'Set Admin'}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => toggleUserFlag(u.id, 'is_bdm', u.is_bdm)}
                                                            disabled={togglingUser === u.id + 'is_bdm'}
                                                            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${u.is_bdm ? 'bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-violet-500/10 hover:text-violet-400 hover:border-violet-500/20'}`}
                                                        >
                                                            {togglingUser === u.id + 'is_bdm' ? <Loader2 className="h-3 w-3 animate-spin" /> : <UserCheck className="h-3 w-3" />}
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

                {/* LINKEDIN OUTREACH TAB */}
                {activeTab === 'linkedin' && <LinkedInOutreach />}

                {/* BLOG MANAGEMENT TAB */}
                {activeTab === 'blog' && <BlogAdmin />}

                {/* COLD OUTREACH TAB */}
                {activeTab === 'email' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-8">

                        {/* ── Apify Lead Scraper ── */}
                        <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                    <Zap className="h-4 w-4 text-orange-400" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-white">Apify Lead Scraper</h2>
                                    <p className="text-xs text-slate-400">Run Apify actors to scrape leads from LinkedIn, Apollo, and more</p>
                                </div>
                            </div>
                            <div className="p-6 space-y-5">
                                {(!apifyKey || apifySaving) ? (
                                    <div className="flex gap-3 items-end">
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-slate-400 mb-2">
                                                Apify API Token <span className="text-emerald-400 font-normal">(saved to your account)</span>
                                            </label>
                                            <div className="relative">
                                                <Key className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="password"
                                                    value={apifyKey}
                                                    onChange={e => setApifyKey(e.target.value)}
                                                    placeholder="Enter Apify API Key..."
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-orange-500/50"
                                                />
                                            </div>
                                        </div>
                                        <button onClick={saveApifyKey} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:border-white/20 transition-all flex items-center gap-2">
                                            {apifySaving ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Key className="h-4 w-4" />}
                                            {apifySaving ? 'Saved' : 'Save Key'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-4 bg-white/3 border border-white/5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                <Key className="h-4 w-4 text-emerald-400" />
                                            </div>
                                            <div className="text-xs font-medium text-slate-300">Apify API key is configured and active</div>
                                        </div>
                                        <button onClick={() => setApifyKey('')} className="text-xs font-bold text-slate-500 hover:text-white transition-colors">Change Key</button>
                                    </div>
                                )}

                                {/* Actor + Custom ID */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Scraper Actor</label>
                                            {savedScrapers.length > 0 && (
                                                <button
                                                    onClick={() => {
                                                        const name = prompt("Enter a name for this configuration:");
                                                        if (name) saveScraperConfig(name);
                                                    }}
                                                    className="text-[10px] font-black uppercase tracking-widest text-orange-400 hover:text-white transition-colors flex items-center gap-1"
                                                >
                                                    <Plus className="h-3 w-3" /> Save Config
                                                </button>
                                            )}
                                        </div>
                                        <select
                                            value={apifyActorId}
                                            onChange={e => {
                                                setApifyActorId(e.target.value);
                                                const actor = APIFY_ACTORS.find(a => a.id === e.target.value);
                                                if (actor) setApifyInput(actor.template);
                                            }}
                                            className="w-full bg-[#0d1626] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500/50"
                                        >
                                            {APIFY_ACTORS.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                                        </select>
                                    </div>
                                    {apifyActorId === 'custom' && (
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 mb-2">Custom Actor ID</label>
                                            <input
                                                type="text"
                                                value={apifyCustomActorId}
                                                onChange={e => setApifyCustomActorId(e.target.value)}
                                                placeholder="e.g. username/actor-name"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-orange-500/50"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Input JSON */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Actor Input (JSON)</label>
                                    <textarea
                                        value={apifyInput}
                                        onChange={e => setApifyInput(e.target.value)}
                                        rows={5}
                                        spellCheck={false}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-slate-500 outline-none focus:border-orange-500/50 resize-none"
                                    />
                                </div>

                                <div className="flex items-center gap-3 flex-wrap">
                                    <button onClick={runApifyScraper} disabled={apifyLoading} className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-lg shadow-orange-600/20">
                                        {apifyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                                        {apifyLoading ? 'Running Scraper...' : 'Run Scraper Now'}
                                    </button>

                                    {savedScrapers.length === 0 && (
                                        <button
                                            onClick={() => {
                                                const name = prompt("Enter a name for this configuration:");
                                                if (name) saveScraperConfig(name);
                                            }}
                                            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:border-white/20 transition-all flex items-center gap-2"
                                        >
                                            <Save className="h-4 w-4" /> Save Configuration
                                        </button>
                                    )}

                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                                        <input
                                            type="checkbox"
                                            id="auto-push"
                                            checked={autoPush}
                                            onChange={e => setAutoPush(e.target.checked)}
                                            className="w-4 h-4 rounded border-white/10 bg-white/5 text-orange-500 focus:ring-orange-500/50"
                                        />
                                        <label htmlFor="auto-push" className="text-xs font-bold text-slate-300 cursor-pointer">
                                            Auto-push leads to campaign
                                        </label>
                                    </div>

                                    {apifyLeads.length > 0 && (
                                        <button onClick={exportApifyCSV} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-sm font-bold text-slate-300 hover:text-white transition-all ml-auto">
                                            <Download className="h-4 w-4" />
                                            Export CSV {selectedApifyLeads.length > 0 ? `(${selectedApifyLeads.length})` : `(${apifyLeads.length})`}
                                        </button>
                                    )}
                                </div>

                                {savedScrapers.length > 0 && (
                                    <div className="mt-8 pt-8 border-t border-white/5">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Daily Scraping Jobs</h3>
                                            <span className="text-[10px] text-slate-500 bg-white/2 px-2 py-0.5 rounded-full border border-white/5">Quick Action Configs</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {savedScrapers.map(config => (
                                                <div key={config.id} className="group relative p-4 bg-white/3 border border-white/5 rounded-2xl hover:border-orange-500/30 transition-all">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="text-sm font-bold text-slate-200">{config.name}</div>
                                                        <button onClick={() => deleteScraperConfig(config.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-all">
                                                            <Trash2 className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 font-mono mb-4 truncate italic">{config.actorId}</div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => loadScraperConfig(config)}
                                                            className="flex-1 text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 py-1.5 rounded-lg text-slate-300 hover:text-white hover:border-white/30 transition-all"
                                                        >
                                                            Load
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                loadScraperConfig(config);
                                                                setTimeout(() => runApifyScraper(), 100);
                                                            }}
                                                            className="flex-1 text-[10px] font-black uppercase tracking-widest bg-orange-600/10 border border-orange-500/20 py-1.5 rounded-lg text-orange-400 hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center gap-1"
                                                        >
                                                            <Zap className="h-2 w-2" /> Run
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => {
                                                    const name = prompt("Enter a name for this custom job:");
                                                    if (name) saveScraperConfig(name);
                                                }}
                                                className="p-4 bg-white/2 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-slate-300 hover:border-white/20 transition-all"
                                            >
                                                <Plus className="h-5 w-5" />
                                                <span className="text-xs font-bold">New Job</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {apifyError && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">{apifyError}</div>}

                                {apifyLeads.length > 0 && (
                                    <div className="overflow-x-auto rounded-xl border border-white/5">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/10 bg-white/5">
                                                    <th className="px-4 py-4 w-12 text-center">
                                                        <input
                                                            type="checkbox"
                                                            onChange={e => setApifyLeads(prev => prev.map(l => ({ ...l, selected: e.target.checked })))}
                                                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500/50"
                                                        />
                                                    </th>
                                                    <th className="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Prospect Details</th>
                                                    <th className="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Method</th>
                                                    <th className="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Location / Info</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {apifyLeads.map(lead => (
                                                    <tr key={lead.id} className={`transition-colors ${lead.selected ? 'bg-orange-600/5' : 'hover:bg-white/2'}`}>
                                                        <td className="px-4 py-4 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={!!lead.selected}
                                                                onChange={() => setApifyLeads(prev => prev.map(l => l.id === lead.id ? { ...l, selected: !l.selected } : l))}
                                                                className="w-4 h-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500/50 cursor-pointer"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 text-[10px] font-black">
                                                                    {lead.first_name?.charAt(0) || 'L'}
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-bold text-slate-200">{lead.first_name} {lead.last_name}</div>
                                                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{lead.title || 'No Title'}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="text-sm text-blue-400 font-medium">{lead.email}</div>
                                                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                                <ExternalLink className="h-3 w-3" />
                                                                {lead.company || '—'}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="text-sm text-slate-400">{lead.location || 'Unknown Location'}</div>
                                                            <div className="mt-1 flex gap-1">
                                                                {lead.linkedin && (
                                                                    <a href={lead.linkedin} target="_blank" rel="noreferrer" className="p-1 rounded bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors">
                                                                        <Users className="h-3 w-3" />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {apifyLeads.length === 0 && (
                                                    <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-5500">No leads scraped in this session.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Instantly Campaign Manager ── */}
                        <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                        <Send className="h-4 w-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-white">Instantly Campaign Manager</h2>
                                        <p className="text-xs text-slate-400">Create, activate, and track all your cold email campaigns</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setShowCreateCampaign(v => !v)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold transition-all">
                                        <Plus className="h-3.5 w-3.5" /> New Campaign
                                    </button>
                                    <button onClick={loadCampaigns} disabled={campaignsLoading} className="p-2 text-slate-400 hover:text-white transition-colors">
                                        {campaignsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                {(!instantlyKey || instantlySaving) ? (
                                    <div className="flex gap-3 items-end">
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-slate-400 mb-2">
                                                Instantly API Key <span className="text-emerald-400 font-normal">(saved to your account)</span>
                                            </label>
                                            <div className="relative">
                                                <Key className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="password"
                                                    value={instantlyKey}
                                                    onChange={e => setInstantlyKey(e.target.value)}
                                                    placeholder="Enter Instantly API Key..."
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
                                                />
                                            </div>
                                        </div>
                                        <button onClick={saveInstantlyKey} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:border-white/20 transition-all flex items-center gap-2">
                                            {instantlySaving ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Key className="h-4 w-4" />}
                                            {instantlySaving ? 'Saved' : 'Save Key'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-4 bg-white/3 border border-white/5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                <Key className="h-4 w-4 text-emerald-400" />
                                            </div>
                                            <div className="text-xs font-medium text-slate-300">Instantly API key is configured and active</div>
                                        </div>
                                        <button onClick={() => setInstantlyKey('')} className="text-xs font-bold text-slate-500 hover:text-white transition-colors">Change Key</button>
                                    </div>
                                )}

                                {/* Create Campaign Inline Form */}
                                {showCreateCampaign && (
                                    <div className="flex items-center gap-3 p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                                        <input
                                            type="text"
                                            value={newCampaignName}
                                            onChange={e => setNewCampaignName(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && createCampaign()}
                                            placeholder="Campaign name..."
                                            autoFocus
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
                                        />
                                        <button onClick={createCampaign} disabled={creatingCampaign || !newCampaignName.trim()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold transition-all disabled:opacity-50">
                                            {creatingCampaign ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                            Create
                                        </button>
                                        <button onClick={() => setShowCreateCampaign(false)} className="text-slate-400 hover:text-white">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}

                                {campaignsError && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">{campaignsError}</div>}

                                {/* Campaign Cards */}
                                {campaigns.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {campaigns.map(c => {
                                            const analytics = c.campaign_analytics;
                                            const isActive = c.status?.toLowerCase() === 'active' || c.status === '1';
                                            const isToggling = togglingCampaign === c.id;
                                            return (
                                                <div
                                                    key={c.id}
                                                    onClick={() => setSelectedCampaignId(selectedCampaignId === c.id ? '' : c.id)}
                                                    className={`rounded-xl border p-4 cursor-pointer transition-all ${selectedCampaignId === c.id ? 'border-blue-500/50 bg-blue-600/10' : 'border-white/10 bg-white/3 hover:border-white/20'}`}
                                                >
                                                    <div className="flex items-start justify-between mb-3 gap-2">
                                                        <div className="text-sm font-bold text-white truncate flex-1">{c.name}</div>
                                                        <button
                                                            onClick={e => { e.stopPropagation(); toggleCampaignStatus(c.id, c.status); }}
                                                            disabled={isToggling}
                                                            title={isActive ? 'Pause campaign' : 'Activate campaign'}
                                                            className={`flex-shrink-0 flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border transition-all disabled:opacity-50 ${isActive
                                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                                                                : 'bg-slate-700/50 text-slate-400 border-white/10 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20'}`}
                                                        >
                                                            {isToggling ? <Loader2 className="h-3 w-3 animate-spin" /> : isActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                                                            {isActive ? 'Active' : 'Paused'}
                                                        </button>
                                                    </div>
                                                    {analytics ? (
                                                        <div className="grid grid-cols-3 gap-2 text-center">
                                                            <div><div className="text-lg font-black text-white">{analytics.sent}</div><div className="text-xs text-slate-500">Sent</div></div>
                                                            <div><div className="text-lg font-black text-blue-400">{analytics.open_count}</div><div className="text-xs text-slate-500">Opens</div></div>
                                                            <div><div className="text-lg font-black text-emerald-400">{analytics.reply_count}</div><div className="text-xs text-slate-500">Replies</div></div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-slate-600 text-center py-2">No analytics yet</div>
                                                    )}
                                                    {selectedCampaignId === c.id && (
                                                        <div className="mt-3 pt-3 border-t border-blue-500/20 text-xs text-blue-400 font-bold text-center">✓ Selected as target</div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Push Apify leads to selected campaign */}
                                {selectedApifyLeads.length > 0 && selectedCampaignId && (
                                    <div className="flex items-center gap-4 p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                                        <div className="flex-1 text-sm text-blue-300 font-medium">
                                            Push <span className="font-black text-white">{selectedApifyLeads.length}</span> leads to <span className="font-black text-white">{campaigns.find(c => c.id === selectedCampaignId)?.name || 'campaign'}</span>
                                        </div>
                                        <button onClick={addLeadsToCampaign} disabled={addingLeads} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                                            {addingLeads ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                            Push to Campaign
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedAudit(null)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-[#0d1626] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
                            <div className="sticky top-0 bg-[#0d1626] px-6 py-4 border-b border-white/10 flex items-center justify-between">
                                <div>
                                    <h3 className="font-black text-white">{selectedAudit.user.full_name || 'User'} — Audit Report</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">{selectedAudit.user.organization || 'No company'} · {new Date(selectedAudit.score.created_at).toLocaleDateString()}</p>
                                </div>
                                <button onClick={() => setSelectedAudit(null)} className="text-slate-400 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className={`text-5xl font-black ${SCORE_COLOR(selectedAudit.score.overall_score)}`}>{selectedAudit.score.overall_score}%</div>
                                    <div>
                                        <div className="text-sm font-bold text-white mb-1">Overall AI Readiness</div>
                                        <div className={`text-sm font-medium ${SCORE_COLOR(selectedAudit.score.overall_score)}`}>
                                            {selectedAudit.score.overall_score >= 80 ? 'High Readiness' : selectedAudit.score.overall_score >= 50 ? 'Moderate Readiness' : 'Early Stage'}
                                        </div>
                                    </div>
                                </div>
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
                                                        <motion.div initial={{ width: 0 }} animate={{ width: `${cat.score}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} className={`h-full rounded-full ${BAR_COLOR(cat.score)}`} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
