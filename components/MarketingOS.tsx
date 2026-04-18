import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
    Sparkles, Loader2, RefreshCw, Copy, CheckCircle2, Clock, Play,
    Target, Zap, Database, MessageCircle, Send, Activity, Filter,
    ChevronDown, ChevronRight, AlertCircle, Users, TrendingUp, Bot,
    Terminal, BookOpen, Cloud, X, CalendarClock, Trash2, Plus, Bell, Power, Mail,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { runCloudMission, type ExecutorEvent } from '../lib/cloudMission';

// ─── Types ───
type AgentRunStatus = 'queued' | 'running' | 'succeeded' | 'failed';
type AgentName = 'marketing-orchestrator' | 'lead-hunter' | 'lead-enricher' | 'outreach-strategist' | 'campaign-manager';
type ViewId = 'mission' | 'feed' | 'team' | 'automations';

interface SavedMission {
    id: string;
    name: string;
    goal: string;
    frequency: 'manual' | 'daily' | 'weekly' | 'monthly';
    hour_utc: number;
    day_of_week: number | null;
    day_of_month: number | null;
    enabled: boolean;
    last_run_at: string | null;
    next_run_at: string | null;
    last_run_status: string | null;
}
interface TelegramConfig {
    chat_id: string;
    enabled: boolean;
    created_at: string;
}
interface GoogleConfig {
    email_address: string;
    connected_at: string;
    last_send_at: string | null;
}

interface AgentRun {
    id: string;
    mission_id: string | null;
    parent_run_id: string | null;
    agent_name: AgentName | string;
    status: AgentRunStatus;
    goal: string;
    task: string;
    input: any;
    output: any;
    affected_table: string | null;
    affected_count: number;
    error: string | null;
    started_at: string;
    completed_at: string | null;
    created_at: string;
}

// ─── Agent metadata ───
const AGENTS: { name: AgentName; label: string; description: string; tools: string; icon: any; color: string; bg: string; border: string }[] = [
    {
        name: 'marketing-orchestrator',
        label: 'Marketing Orchestrator',
        description: 'Primary planner. Holds an interactive session, decomposes your mission, and delegates to specialists.',
        tools: 'Bash, Read, Write, Agent',
        icon: Sparkles,
        color: 'text-violet-400',
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/20',
    },
    {
        name: 'lead-hunter',
        label: 'Lead Hunter',
        description: 'Scrapes new prospects via Apify (Google Places, LinkedIn, Apollo). Writes to CRM + LinkedIn leads.',
        tools: 'Bash, Read, Write',
        icon: Target,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
    },
    {
        name: 'lead-enricher',
        label: 'Lead Enricher',
        description: 'Fills in missing emails, LinkedIn URLs, and company info on existing contacts. Never overwrites.',
        tools: 'Bash, Read',
        icon: Database,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
    },
    {
        name: 'outreach-strategist',
        label: 'Outreach Strategist',
        description: 'Drafts personalized LinkedIn messages, follow-ups, and email copy in the ClarityWorks voice.',
        tools: 'Read, Bash',
        icon: MessageCircle,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
    },
    {
        name: 'campaign-manager',
        label: 'Campaign Manager',
        description: 'Creates campaigns, assigns leads, and pushes to Instantly. Never auto-sends without confirmation.',
        tools: 'Bash, Read',
        icon: Send,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
    },
];

const STATUS_STYLES: Record<AgentRunStatus, { color: string; bg: string; border: string; label: string }> = {
    queued: { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', label: 'Queued' },
    running: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Running' },
    succeeded: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Succeeded' },
    failed: { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', label: 'Failed' },
};

// ─── Mission templates ───
const MISSION_TEMPLATES: { label: string; goal: string; icon: any }[] = [
    {
        label: 'Find New Leads',
        icon: Target,
        goal: 'Find 25 [persona] in [city, state] using Google Places. Save them to the CRM.',
    },
    {
        label: 'Enrich Existing CRM',
        icon: Database,
        goal: 'Enrich all CRM contacts from the google-places source that are missing emails. Cap at 50.',
    },
    {
        label: 'Draft Outreach',
        icon: MessageCircle,
        goal: 'Draft personalized LinkedIn outreach for the 10 most recently added leads. Lead with the AI Receptionist service.',
    },
    {
        label: 'Full Pipeline',
        icon: Zap,
        goal: 'Find 30 [persona] in [city], enrich them, draft personalized outreach, and queue them in a new LinkedIn campaign called "[campaign name]". Do not auto-activate.',
    },
];

// ─── Helpers ───
const formatRelative = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const days = Math.floor(hr / 24);
    return `${days}d ago`;
};

const formatDuration = (start: string, end: string | null) => {
    if (!end) return '—';
    const ms = new Date(end).getTime() - new Date(start).getTime();
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
};

const buildCliCommand = (goal: string) =>
    `claude "Use the marketing-orchestrator subagent. Mission: ${goal.replace(/"/g, '\\"')}"`;

const buildSpecialistCommand = (agentName: AgentName) =>
    `claude "Use the ${agentName} subagent. Task: <describe the task>."`;

// ─── Main Component ───
const MarketingOS: React.FC = () => {
    const { user } = useAuth();
    const [activeView, setActiveView] = useState<ViewId>('mission');
    const [runs, setRuns] = useState<AgentRun[]>([]);
    const [loading, setLoading] = useState(true);
    const [tableMissing, setTableMissing] = useState(false);

    // Mission launcher
    const [missionGoal, setMissionGoal] = useState('');
    const [copyToast, setCopyToast] = useState<string | null>(null);

    // Cloud execution state
    const [cloudRunning, setCloudRunning] = useState(false);
    const [cloudEvents, setCloudEvents] = useState<ExecutorEvent[]>([]);
    const [cloudError, setCloudError] = useState<string | null>(null);

    // Automations state
    const [savedMissions, setSavedMissions] = useState<SavedMission[]>([]);
    const [telegramConfig, setTelegramConfig] = useState<TelegramConfig | null>(null);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [saveDraft, setSaveDraft] = useState<{ name: string; frequency: 'manual' | 'daily' | 'weekly' | 'monthly'; hour_utc: number; day_of_week: number; day_of_month: number }>({ name: '', frequency: 'daily', hour_utc: 13, day_of_week: 1, day_of_month: 1 });
    const [tgDraft, setTgDraft] = useState({ botToken: '', chatId: '' });
    const [tgBusy, setTgBusy] = useState(false);
    const [tgError, setTgError] = useState<string | null>(null);
    const [googleConfig, setGoogleConfig] = useState<GoogleConfig | null>(null);
    const [googleBusy, setGoogleBusy] = useState(false);

    const authedFetch = useCallback(async (path: string, init?: RequestInit) => {
        if (!supabase) throw new Error('Supabase not configured');
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) throw new Error('Not signed in');
        return fetch(path, {
            ...init,
            headers: {
                ...(init?.headers || {}),
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    }, []);

    // Activity feed filters
    const [agentFilter, setAgentFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [expandedRunId, setExpandedRunId] = useState<string | null>(null);

    // KPI counts from existing tables
    const [kpis, setKpis] = useState({
        leadsLast7d: 0,
        contactsTotal: 0,
        campaignsLive: 0,
        repliesTotal: 0,
    });

    // ─── Fetchers ───
    const fetchRuns = useCallback(async () => {
        if (!supabase || !user) return;
        const { data, error } = await supabase
            .from('marketing_agent_runs')
            .select('*')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false })
            .limit(100);
        if (error) {
            if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
                setTableMissing(true);
            }
            setLoading(false);
            return;
        }
        setRuns((data || []) as AgentRun[]);
        setTableMissing(false);
        setLoading(false);
    }, [user]);

    const fetchKpis = useCallback(async () => {
        if (!supabase || !user) return;
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

        const [leadsRes, contactsRes, campaignsRes, repliesRes] = await Promise.all([
            supabase.from('linkedin_leads').select('id', { count: 'exact', head: true }).eq('owner_id', user.id).gte('created_at', sevenDaysAgo),
            supabase.from('crm_contacts').select('id', { count: 'exact', head: true }).eq('owner_id', user.id),
            supabase.from('linkedin_campaigns').select('id', { count: 'exact', head: true }).eq('owner_id', user.id).eq('status', 'active'),
            supabase.from('linkedin_leads').select('id', { count: 'exact', head: true }).eq('owner_id', user.id).in('stage', ['replied', 'converted']),
        ]);

        setKpis({
            leadsLast7d: leadsRes.count || 0,
            contactsTotal: contactsRes.count || 0,
            campaignsLive: campaignsRes.count || 0,
            repliesTotal: repliesRes.count || 0,
        });
    }, [user]);

    const fetchMissions = useCallback(async () => {
        try {
            const res = await authedFetch('/api/missions');
            if (!res.ok) return;
            const j = await res.json();
            setSavedMissions(j.missions || []);
        } catch {}
    }, [authedFetch]);

    const fetchTelegram = useCallback(async () => {
        try {
            const res = await authedFetch('/api/telegram/setup');
            if (!res.ok) return;
            const j = await res.json();
            setTelegramConfig(j.config || null);
        } catch {}
    }, [authedFetch]);

    const fetchGoogle = useCallback(async () => {
        try {
            const res = await authedFetch('/api/google');
            if (!res.ok) return;
            const j = await res.json();
            setGoogleConfig(j.config || null);
        } catch {}
    }, [authedFetch]);

    useEffect(() => {
        fetchRuns();
        fetchKpis();
        fetchMissions();
        fetchTelegram();
        fetchGoogle();
        // Show toast on returning from Google OAuth
        const params = new URLSearchParams(window.location.search);
        if (params.get('googleConnected') === '1') {
            setCopyToast('Gmail connected');
            setTimeout(() => setCopyToast(null), 3000);
            window.history.replaceState({}, '', window.location.pathname);
        }
        if (params.get('googleError')) {
            setCopyToast(`Google error: ${params.get('googleError')}`);
            setTimeout(() => setCopyToast(null), 5000);
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [fetchRuns, fetchKpis, fetchMissions, fetchTelegram, fetchGoogle]);

    // Poll runs every 5 seconds
    useEffect(() => {
        if (!supabase || !user || tableMissing) return;
        const interval = setInterval(() => {
            fetchRuns();
            fetchKpis();
        }, 5000);
        return () => clearInterval(interval);
    }, [fetchRuns, fetchKpis, user, tableMissing]);

    // ─── Derived ───
    const activeRuns = runs.filter(r => r.status === 'running' || r.status === 'queued');
    const filteredFeed = useMemo(() => {
        return runs.filter(r => {
            const matchAgent = agentFilter === 'all' || r.agent_name === agentFilter;
            const matchStatus = statusFilter === 'all' || r.status === statusFilter;
            return matchAgent && matchStatus;
        });
    }, [runs, agentFilter, statusFilter]);

    const agentLastRun = (name: string) =>
        runs.find(r => r.agent_name === name) || null;

    const agentSuccessRate = (name: string) => {
        const agentRuns = runs.filter(r => r.agent_name === name && r.status !== 'running' && r.status !== 'queued');
        if (agentRuns.length === 0) return null;
        return Math.round((agentRuns.filter(r => r.status === 'succeeded').length / agentRuns.length) * 100);
    };

    // ─── Actions ───
    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopyToast(`${label} copied to clipboard`);
        setTimeout(() => setCopyToast(null), 2500);
    };

    const launchMission = () => {
        if (!missionGoal.trim()) return;
        const cmd = buildCliCommand(missionGoal);
        copyToClipboard(cmd, 'Mission command');
    };

    const launchCloudMission = async () => {
        if (!missionGoal.trim() || cloudRunning) return;
        setCloudRunning(true);
        setCloudError(null);
        setCloudEvents([]);
        try {
            await runCloudMission(missionGoal, (e) => {
                setCloudEvents(prev => [...prev, e]);
                fetchRuns();
            });
        } catch (err: any) {
            setCloudError(err.message || String(err));
        } finally {
            setCloudRunning(false);
            fetchRuns();
            fetchKpis();
        }
    };

    const dismissCloudPanel = () => {
        if (cloudRunning) return;
        setCloudEvents([]);
        setCloudError(null);
    };

    const useTemplate = (goal: string) => {
        setMissionGoal(goal);
    };

    const saveMission = async () => {
        if (!missionGoal.trim() || !saveDraft.name.trim()) return;
        const payload: any = {
            name: saveDraft.name.trim(),
            goal: missionGoal,
            frequency: saveDraft.frequency,
            hour_utc: saveDraft.hour_utc,
            enabled: true,
        };
        if (saveDraft.frequency === 'weekly') payload.day_of_week = saveDraft.day_of_week;
        if (saveDraft.frequency === 'monthly') payload.day_of_month = saveDraft.day_of_month;
        const res = await authedFetch('/api/missions', { method: 'POST', body: JSON.stringify(payload) });
        if (res.ok) {
            setShowSaveDialog(false);
            setSaveDraft({ ...saveDraft, name: '' });
            setCopyToast('Mission saved');
            setTimeout(() => setCopyToast(null), 2000);
            fetchMissions();
        }
    };

    const deleteMission = async (id: string) => {
        await authedFetch(`/api/missions?id=${id}`, { method: 'DELETE' });
        fetchMissions();
    };

    const toggleMission = async (m: SavedMission) => {
        await authedFetch('/api/missions', {
            method: 'PUT',
            body: JSON.stringify({ id: m.id, name: m.name, goal: m.goal, frequency: m.frequency, hour_utc: m.hour_utc, day_of_week: m.day_of_week, day_of_month: m.day_of_month, enabled: !m.enabled }),
        });
        fetchMissions();
    };

    const runMissionNow = async (m: SavedMission) => {
        await authedFetch('/api/missions', {
            method: 'PUT',
            body: JSON.stringify({ id: m.id, name: m.name, goal: m.goal, frequency: m.frequency, hour_utc: m.hour_utc, day_of_week: m.day_of_week, day_of_month: m.day_of_month, enabled: true }),
        });
        // Fire it immediately by running the cloud mission with the saved goal
        setMissionGoal(m.goal);
        setActiveView('mission');
        setTimeout(() => launchCloudMission(), 50);
    };

    const connectTelegram = async () => {
        if (!tgDraft.botToken.trim() || !tgDraft.chatId.trim()) return;
        setTgBusy(true);
        setTgError(null);
        try {
            const res = await authedFetch('/api/telegram/setup', {
                method: 'POST',
                body: JSON.stringify({ botToken: tgDraft.botToken.trim(), chatId: tgDraft.chatId.trim() }),
            });
            const j = await res.json();
            if (!res.ok) throw new Error(j.error || 'Setup failed');
            setTgDraft({ botToken: '', chatId: '' });
            fetchTelegram();
        } catch (e: any) {
            setTgError(e.message);
        } finally {
            setTgBusy(false);
        }
    };

    const disconnectTelegram = async () => {
        await authedFetch('/api/telegram/setup', { method: 'DELETE' });
        fetchTelegram();
    };

    const connectGoogle = async () => {
        setGoogleBusy(true);
        try {
            const res = await authedFetch('/api/google', { method: 'POST' });
            const j = await res.json();
            if (!res.ok) throw new Error(j.error || 'Failed to start OAuth');
            window.location.href = j.url;
        } catch (e: any) {
            setCopyToast(`Google error: ${e.message}`);
            setTimeout(() => setCopyToast(null), 4000);
        } finally {
            setGoogleBusy(false);
        }
    };

    const disconnectGoogle = async () => {
        await authedFetch('/api/google', { method: 'DELETE' });
        fetchGoogle();
    };

    // ─── Render ───
    const views: { id: ViewId; label: string; icon: any }[] = [
        { id: 'mission', label: 'Mission Control', icon: Sparkles },
        { id: 'automations', label: 'Automations', icon: CalendarClock },
        { id: 'feed', label: 'Activity Feed', icon: Activity },
        { id: 'team', label: 'Agent Team', icon: Bot },
    ];

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-violet-500 animate-spin" /></div>;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-6">

            {/* Migration warning */}
            {tableMissing && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-4">
                    <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                    <div className="flex-1">
                        <div className="text-sm font-bold text-amber-300">Migration not yet applied</div>
                        <div className="text-xs text-amber-200/70 mt-1 leading-relaxed">
                            The <code className="text-amber-100 bg-amber-500/10 px-1.5 py-0.5 rounded">marketing_agent_runs</code> table doesn't exist yet.
                            Run the SQL in <code className="text-amber-100 bg-amber-500/10 px-1.5 py-0.5 rounded">supabase/migrations/20260407_marketing_agent_runs.sql</code> in your Supabase SQL Editor to enable the activity feed.
                        </div>
                    </div>
                </div>
            )}

            {/* Sub-navigation */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
                    {views.map(v => {
                        const Icon = v.icon;
                        return (
                            <button key={v.id} onClick={() => setActiveView(v.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === v.id ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-slate-400 hover:text-white'}`}>
                                <Icon className="h-4 w-4" /> {v.label}
                            </button>
                        );
                    })}
                </div>
                <button onClick={() => { fetchRuns(); fetchKpis(); }} className="p-2 text-slate-400 hover:text-white transition-colors">
                    <RefreshCw className="h-4 w-4" />
                </button>
            </div>

            {/* ═══════════ MISSION CONTROL ═══════════ */}
            {activeView === 'mission' && (
                <>
                    {/* Hero KPI cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'New Leads (7d)', value: kpis.leadsLast7d, icon: Target, color: 'blue' },
                            { label: 'Contacts in CRM', value: kpis.contactsTotal, icon: Users, color: 'cyan' },
                            { label: 'Live Campaigns', value: kpis.campaignsLive, icon: Send, color: 'emerald' },
                            { label: 'Replies', value: kpis.repliesTotal, icon: MessageCircle, color: 'amber' },
                        ].map((kpi) => {
                            const Icon = kpi.icon;
                            return (
                                <div key={kpi.label} className="backdrop-blur-xl bg-slate-900/40 rounded-2xl p-5 border border-white/5">
                                    <div className={`w-10 h-10 rounded-xl bg-${kpi.color}-500/10 border border-${kpi.color}-500/20 flex items-center justify-center mb-3`}>
                                        <Icon className={`h-5 w-5 text-${kpi.color}-400`} />
                                    </div>
                                    <div className="text-3xl font-black text-white mb-1">{kpi.value}</div>
                                    <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{kpi.label}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Mission launcher */}
                    <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-violet-500/20 overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-violet-400" />
                            </div>
                            <div>
                                <div className="font-bold text-white">Launch a Marketing Mission</div>
                                <div className="text-xs text-slate-400">Describe your goal — we'll build the Claude Code command for you</div>
                            </div>
                        </div>
                        <div className="p-6 space-y-5">
                            {/* Templates */}
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Quick Templates</div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                    {MISSION_TEMPLATES.map(t => {
                                        const Icon = t.icon;
                                        return (
                                            <button key={t.label} onClick={() => useTemplate(t.goal)}
                                                className="text-left p-4 rounded-xl border border-white/5 bg-white/3 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all group">
                                                <Icon className="h-5 w-5 text-violet-400 mb-2" />
                                                <div className="text-sm font-bold text-white">{t.label}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Goal input */}
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mission Goal</label>
                                <textarea
                                    value={missionGoal}
                                    onChange={e => setMissionGoal(e.target.value)}
                                    placeholder="e.g. Find 30 HVAC owners in Hamilton, enrich them, draft personalized outreach, and queue them for my Spring HVAC LinkedIn campaign."
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/50 resize-none"
                                />
                            </div>

                            {/* Generated command preview */}
                            {missionGoal.trim() && (
                                <div className="rounded-xl bg-black/40 border border-white/10 p-4 font-mono text-xs text-slate-300 overflow-x-auto">
                                    <div className="flex items-start gap-3">
                                        <Terminal className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />
                                        <div className="flex-1 leading-relaxed">{buildCliCommand(missionGoal)}</div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <div className="text-[10px] text-slate-500 leading-relaxed max-w-md">
                                    <strong className="text-emerald-300">Run in Cloud</strong> executes the mission on Vercel — no terminal needed. <strong className="text-violet-300">Copy CLI</strong> hands off to your local Claude Code agent.
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <button onClick={launchMission} disabled={!missionGoal.trim() || cloudRunning}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                                        <Copy className="h-4 w-4" /> Copy CLI
                                    </button>
                                    <button onClick={() => setShowSaveDialog(true)} disabled={!missionGoal.trim() || cloudRunning}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                                        <CalendarClock className="h-4 w-4" /> Save as Mission
                                    </button>
                                    <button onClick={launchCloudMission} disabled={!missionGoal.trim() || cloudRunning}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-lg shadow-emerald-600/20">
                                        {cloudRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Cloud className="h-4 w-4" />}
                                        {cloudRunning ? 'Running…' : 'Run in Cloud'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cloud execution log */}
                    {(cloudEvents.length > 0 || cloudError) && (
                        <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-emerald-500/20 overflow-hidden">
                            <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Cloud className="h-4 w-4 text-emerald-400" />
                                    <span className="text-sm font-bold text-white">Cloud Mission</span>
                                    {cloudRunning && <Loader2 className="h-3 w-3 text-emerald-400 animate-spin" />}
                                </div>
                                {!cloudRunning && (
                                    <button onClick={dismissCloudPanel} className="text-slate-500 hover:text-white">
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <div className="p-4 max-h-72 overflow-y-auto space-y-1.5 font-mono text-xs">
                                {cloudEvents.map((e, idx) => {
                                    const color =
                                        e.kind === 'mission_done' ? 'text-emerald-300' :
                                        e.kind === 'mission_error' || e.kind === 'step_error' ? 'text-rose-300' :
                                        e.kind === 'step_done' ? 'text-emerald-200' :
                                        e.kind === 'step_start' ? 'text-violet-300' :
                                        'text-slate-300';
                                    return (
                                        <div key={idx} className={color}>
                                            <span className="text-slate-600 mr-2">[{e.kind}]</span>{e.message}
                                        </div>
                                    );
                                })}
                                {cloudError && (
                                    <div className="text-rose-300 mt-2 pt-2 border-t border-rose-500/20">
                                        Error: {cloudError}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Active missions */}
                    <div>
                        <h2 className="text-base font-black text-white mb-4 flex items-center gap-2">
                            <Play className="h-4 w-4 text-violet-400" /> Active Missions
                            {activeRuns.length > 0 && <span className="text-xs font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">{activeRuns.length}</span>}
                        </h2>
                        {activeRuns.length === 0 ? (
                            <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 p-10 text-center">
                                <Bot className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                                <div className="text-sm text-slate-500 font-medium">No active missions. Launch one above to get started.</div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {activeRuns.map(run => {
                                    const agent = AGENTS.find(a => a.name === run.agent_name);
                                    const Icon = agent?.icon || Bot;
                                    const statusCfg = STATUS_STYLES[run.status];
                                    return (
                                        <div key={run.id} className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-violet-500/20 p-5 flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl ${agent?.bg || 'bg-white/5'} border ${agent?.border || 'border-white/10'} flex items-center justify-center`}>
                                                <Icon className={`h-5 w-5 ${agent?.color || 'text-slate-400'}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-bold text-white">{agent?.label || run.agent_name}</span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.border} ${statusCfg.color}`}>
                                                        {statusCfg.label}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-400">{run.task || run.goal || '—'}</div>
                                            </div>
                                            <Loader2 className="h-5 w-5 text-violet-400 animate-spin" />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* ═══════════ AUTOMATIONS ═══════════ */}
            {activeView === 'automations' && (
                <>
                    {/* Integrations row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Gmail */}
                        <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                                    <Mail className="h-4 w-4 text-rose-400" />
                                </div>
                                <div>
                                    <div className="font-bold text-white">Gmail</div>
                                    <div className="text-xs text-slate-400">Send drafted emails from your Google account.</div>
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                {googleConfig ? (
                                    <>
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                                            <div className="text-xs text-emerald-200 leading-relaxed">
                                                Connected as <strong>{googleConfig.email_address}</strong>.
                                                {googleConfig.last_send_at && (
                                                    <div className="text-[10px] text-emerald-300/70 mt-1">Last send {formatRelative(googleConfig.last_send_at)}</div>
                                                )}
                                            </div>
                                        </div>
                                        <button onClick={disconnectGoogle}
                                            className="w-full px-4 py-2 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 text-rose-300 rounded-xl text-xs font-bold transition-all">
                                            Disconnect Gmail
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-xs text-slate-400 leading-relaxed">
                                            Once connected, the agents can send drafted emails through your account. Replies thread to your inbox naturally. Sent mail lives in your Sent folder.
                                        </div>
                                        <button onClick={connectGoogle} disabled={googleBusy}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50">
                                            {googleBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
                                            Connect Gmail
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Telegram - moved here from below */}
                        <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                                    <Bell className="h-4 w-4 text-sky-400" />
                                </div>
                                <div>
                                    <div className="font-bold text-white">Telegram Bot</div>
                                    <div className="text-xs text-slate-400">Trigger missions from your phone.</div>
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                {telegramConfig ? (
                                    <>
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                                            <div className="text-xs text-emerald-200 leading-relaxed">
                                                Connected to chat <code className="text-emerald-100">{telegramConfig.chat_id}</code>. Send <code>/help</code> to your bot.
                                            </div>
                                        </div>
                                        <button onClick={disconnectTelegram}
                                            className="w-full px-4 py-2 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 text-rose-300 rounded-xl text-xs font-bold transition-all">
                                            Disconnect
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside leading-relaxed">
                                            <li>Open <a className="text-sky-400 underline" href="https://t.me/BotFather" target="_blank" rel="noreferrer">@BotFather</a>, send <code>/newbot</code>, copy the token.</li>
                                            <li>Send any message to your new bot. Then open <a className="text-sky-400 underline" href="https://t.me/userinfobot" target="_blank" rel="noreferrer">@userinfobot</a> to grab your chat ID.</li>
                                            <li>Paste both below.</li>
                                        </ol>
                                        <input type="text" placeholder="Bot token (from BotFather)" value={tgDraft.botToken}
                                            onChange={e => setTgDraft({ ...tgDraft, botToken: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500/50" />
                                        <input type="text" placeholder="Your Telegram chat ID" value={tgDraft.chatId}
                                            onChange={e => setTgDraft({ ...tgDraft, chatId: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500/50" />
                                        {tgError && <div className="text-xs text-rose-300">{tgError}</div>}
                                        <button onClick={connectTelegram} disabled={tgBusy || !tgDraft.botToken || !tgDraft.chatId}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50">
                                            {tgBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bell className="h-3.5 w-3.5" />}
                                            Connect Telegram
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {/* Saved Missions */}
                        <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                        <CalendarClock className="h-4 w-4 text-violet-400" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">Saved Missions</div>
                                        <div className="text-xs text-slate-400">Cron dispatcher fires hourly. Daily missions run at the chosen UTC hour.</div>
                                    </div>
                                </div>
                                <button onClick={() => { setActiveView('mission'); setShowSaveDialog(false); }}
                                    className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1">
                                    <Plus className="h-3 w-3" /> New
                                </button>
                            </div>
                            {savedMissions.length === 0 ? (
                                <div className="p-10 text-center">
                                    <CalendarClock className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                                    <div className="text-sm text-slate-500 font-medium">No saved missions yet.</div>
                                    <div className="text-xs text-slate-600 mt-1">Type a goal in Mission Control and click "Save as Mission".</div>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {savedMissions.map(m => (
                                        <div key={m.id} className="px-6 py-4 hover:bg-white/2 transition-colors">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <span className="text-sm font-bold text-white">{m.name}</span>
                                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${m.enabled ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                                                            {m.frequency}{m.enabled ? '' : ' · paused'}
                                                        </span>
                                                        {m.last_run_status && (
                                                            <span className={`text-[9px] font-bold uppercase tracking-widest ${m.last_run_status === 'succeeded' ? 'text-emerald-400' : m.last_run_status === 'failed' ? 'text-rose-400' : 'text-blue-400'}`}>
                                                                {m.last_run_status}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-400 line-clamp-2">{m.goal}</div>
                                                    <div className="text-[10px] text-slate-600 mt-1.5 flex items-center gap-3 flex-wrap">
                                                        {m.frequency !== 'manual' && <span>Runs at {m.hour_utc.toString().padStart(2, '0')}:00 UTC{m.frequency === 'weekly' && m.day_of_week !== null ? ` · ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][m.day_of_week]}` : ''}{m.frequency === 'monthly' && m.day_of_month !== null ? ` · day ${m.day_of_month}` : ''}</span>}
                                                        {m.next_run_at && <span>Next: {new Date(m.next_run_at).toLocaleString()}</span>}
                                                        {m.last_run_at && <span>Last: {formatRelative(m.last_run_at)}</span>}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button onClick={() => runMissionNow(m)} title="Run now"
                                                        className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg">
                                                        <Play className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button onClick={() => toggleMission(m)} title={m.enabled ? 'Pause' : 'Enable'}
                                                        className="p-1.5 text-slate-400 hover:bg-white/5 rounded-lg">
                                                        <Power className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button onClick={() => deleteMission(m.id)} title="Delete"
                                                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* ═══════════ ACTIVITY FEED ═══════════ */}
            {activeView === 'feed' && (
                <>
                    {/* Filters */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <Filter className="h-3.5 w-3.5" /> Filter:
                        </div>
                        <select value={agentFilter} onChange={e => setAgentFilter(e.target.value)}
                            className="text-xs font-bold bg-white/5 border border-white/10 text-slate-300 rounded-lg px-3 py-1.5 outline-none">
                            <option value="all" className="bg-[#0d1626]">All Agents</option>
                            {AGENTS.map(a => <option key={a.name} value={a.name} className="bg-[#0d1626]">{a.label}</option>)}
                        </select>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                            className="text-xs font-bold bg-white/5 border border-white/10 text-slate-300 rounded-lg px-3 py-1.5 outline-none">
                            <option value="all" className="bg-[#0d1626]">All Statuses</option>
                            <option value="running" className="bg-[#0d1626]">Running</option>
                            <option value="succeeded" className="bg-[#0d1626]">Succeeded</option>
                            <option value="failed" className="bg-[#0d1626]">Failed</option>
                            <option value="queued" className="bg-[#0d1626]">Queued</option>
                        </select>
                        <span className="text-xs text-slate-500 ml-auto">{filteredFeed.length} of {runs.length} runs</span>
                    </div>

                    {/* Feed */}
                    <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
                        {filteredFeed.length === 0 ? (
                            <div className="p-12 text-center">
                                <Activity className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                                <div className="text-sm text-slate-500 font-medium">
                                    {runs.length === 0 ? 'No agent runs yet. Launch a mission from Mission Control to see activity here.' : 'No runs match your filters.'}
                                </div>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {filteredFeed.map(run => {
                                    const agent = AGENTS.find(a => a.name === run.agent_name);
                                    const Icon = agent?.icon || Bot;
                                    const statusCfg = STATUS_STYLES[run.status];
                                    const isExpanded = expandedRunId === run.id;
                                    return (
                                        <div key={run.id} className="hover:bg-white/2 transition-colors">
                                            <button
                                                onClick={() => setExpandedRunId(isExpanded ? null : run.id)}
                                                className="w-full px-6 py-4 flex items-start gap-4 text-left"
                                            >
                                                <div className={`w-10 h-10 rounded-xl ${agent?.bg || 'bg-white/5'} border ${agent?.border || 'border-white/10'} flex items-center justify-center shrink-0`}>
                                                    <Icon className={`h-4 w-4 ${agent?.color || 'text-slate-400'}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <span className="text-sm font-bold text-white">{agent?.label || run.agent_name}</span>
                                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.border} ${statusCfg.color} uppercase tracking-widest`}>
                                                            {statusCfg.label}
                                                        </span>
                                                        {run.affected_table && (
                                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                                                {run.affected_count} → {run.affected_table}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-400 truncate">{run.task || run.goal || '—'}</div>
                                                    <div className="text-[10px] text-slate-600 mt-1 flex items-center gap-3">
                                                        <span><Clock className="h-2.5 w-2.5 inline mr-1" />{formatRelative(run.created_at)}</span>
                                                        <span>Duration: {formatDuration(run.started_at, run.completed_at)}</span>
                                                    </div>
                                                </div>
                                                {isExpanded ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
                                            </button>
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                        className="px-6 pb-4 overflow-hidden">
                                                        <div className="ml-14 space-y-3">
                                                            {run.goal && (
                                                                <div>
                                                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Mission Goal</div>
                                                                    <div className="text-xs text-slate-300 leading-relaxed">{run.goal}</div>
                                                                </div>
                                                            )}
                                                            {run.input && Object.keys(run.input).length > 0 && (
                                                                <div>
                                                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Input</div>
                                                                    <pre className="text-[10px] text-slate-400 bg-black/40 border border-white/5 rounded-lg p-3 overflow-x-auto">{JSON.stringify(run.input, null, 2)}</pre>
                                                                </div>
                                                            )}
                                                            {run.output && Object.keys(run.output).length > 0 && (
                                                                <div>
                                                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Output</div>
                                                                    <pre className="text-[10px] text-slate-400 bg-black/40 border border-white/5 rounded-lg p-3 overflow-x-auto">{JSON.stringify(run.output, null, 2)}</pre>
                                                                </div>
                                                            )}
                                                            {run.error && (
                                                                <div>
                                                                    <div className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">Error</div>
                                                                    <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">{run.error}</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* ═══════════ AGENT TEAM ═══════════ */}
            {activeView === 'team' && (
                <>
                    <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 p-5 flex items-start gap-4">
                        <BookOpen className="h-5 w-5 text-violet-400 mt-0.5 shrink-0" />
                        <div className="text-xs text-slate-400 leading-relaxed">
                            Each agent is defined as a Claude Code subagent at <code className="text-slate-300 bg-white/5 px-1.5 py-0.5 rounded">~/.claude/agents/&lt;name&gt;.md</code>.
                            Use the Marketing Orchestrator for end-to-end missions, or call any specialist directly when you know exactly what you need.
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {AGENTS.map(agent => {
                            const Icon = agent.icon;
                            const lastRun = agentLastRun(agent.name);
                            const successRate = agentSuccessRate(agent.name);
                            return (
                                <div key={agent.name} className={`backdrop-blur-xl bg-slate-900/40 rounded-2xl border ${agent.border} p-6 hover:border-opacity-60 transition-all`}>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-xl ${agent.bg} border ${agent.border} flex items-center justify-center shrink-0`}>
                                            <Icon className={`h-6 w-6 ${agent.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-base font-black text-white">{agent.label}</div>
                                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{agent.name}</div>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{agent.description}</p>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-white/3 rounded-xl p-3">
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Last Run</div>
                                            <div className={`text-xs font-bold ${lastRun ? STATUS_STYLES[lastRun.status].color : 'text-slate-600'}`}>
                                                {lastRun ? formatRelative(lastRun.created_at) : 'Never'}
                                            </div>
                                        </div>
                                        <div className="bg-white/3 rounded-xl p-3">
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Success Rate</div>
                                            <div className="text-xs font-bold text-white">
                                                {successRate !== null ? `${successRate}%` : '—'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Tools</div>
                                    <div className="text-[10px] text-slate-400 font-mono mb-4">{agent.tools}</div>

                                    <button onClick={() => copyToClipboard(buildSpecialistCommand(agent.name), `${agent.label} command`)}
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 ${agent.bg} border ${agent.border} ${agent.color} rounded-xl text-xs font-bold hover:opacity-80 transition-all`}>
                                        <Copy className="h-3 w-3" /> Copy CLI Invocation
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Save-as-Mission dialog */}
            <AnimatePresence>
                {showSaveDialog && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowSaveDialog(false)}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-[#0d1626] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                        <CalendarClock className="h-4 w-4 text-violet-400" />
                                    </div>
                                    <div className="font-bold text-white">Save as Recurring Mission</div>
                                </div>
                                <button onClick={() => setShowSaveDialog(false)} className="text-slate-400 hover:text-white">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Mission Name</label>
                                    <input type="text" value={saveDraft.name}
                                        onChange={e => setSaveDraft({ ...saveDraft, name: e.target.value })}
                                        placeholder="e.g. Weekly HVAC Hamilton scrape"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/50" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Goal (preview)</label>
                                    <div className="text-xs text-slate-300 bg-black/30 border border-white/5 rounded-lg p-3 max-h-24 overflow-y-auto">{missionGoal}</div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Frequency</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {(['manual', 'daily', 'weekly', 'monthly'] as const).map(f => (
                                            <button key={f} onClick={() => setSaveDraft({ ...saveDraft, frequency: f })}
                                                className={`py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${saveDraft.frequency === f ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {saveDraft.frequency !== 'manual' && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Hour (UTC)</label>
                                            <input type="number" min={0} max={23} value={saveDraft.hour_utc}
                                                onChange={e => setSaveDraft({ ...saveDraft, hour_utc: Number(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet-500/50" />
                                        </div>
                                        {saveDraft.frequency === 'weekly' && (
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Day of Week</label>
                                                <select value={saveDraft.day_of_week}
                                                    onChange={e => setSaveDraft({ ...saveDraft, day_of_week: Number(e.target.value) })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet-500/50">
                                                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d, i) => <option key={i} value={i} className="bg-[#0d1626]">{d}</option>)}
                                                </select>
                                            </div>
                                        )}
                                        {saveDraft.frequency === 'monthly' && (
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Day of Month</label>
                                                <input type="number" min={1} max={28} value={saveDraft.day_of_month}
                                                    onChange={e => setSaveDraft({ ...saveDraft, day_of_month: Number(e.target.value) })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet-500/50" />
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="flex items-center justify-end gap-2 pt-2">
                                    <button onClick={() => setShowSaveDialog(false)} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white">Cancel</button>
                                    <button onClick={saveMission} disabled={!saveDraft.name.trim()}
                                        className="px-5 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-xs font-bold text-white disabled:opacity-50">
                                        Save Mission
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Copy toast */}
            <AnimatePresence>
                {copyToast && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-8 right-8 bg-violet-600 text-white px-5 py-3 rounded-xl shadow-2xl shadow-violet-600/30 flex items-center gap-2 text-sm font-bold z-50">
                        <CheckCircle2 className="h-4 w-4" /> {copyToast}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MarketingOS;
