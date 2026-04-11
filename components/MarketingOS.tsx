import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
    Sparkles, Loader2, RefreshCw, Copy, CheckCircle2, Clock, Play,
    Target, Zap, Database, MessageCircle, Send, Activity, Filter,
    ChevronDown, ChevronRight, AlertCircle, Users, TrendingUp, Bot,
    Terminal, BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───
type AgentRunStatus = 'queued' | 'running' | 'succeeded' | 'failed';
type AgentName = 'marketing-orchestrator' | 'lead-hunter' | 'lead-enricher' | 'outreach-strategist' | 'campaign-manager';
type ViewId = 'mission' | 'feed' | 'team';

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

    useEffect(() => {
        fetchRuns();
        fetchKpis();
    }, [fetchRuns, fetchKpis]);

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

    const useTemplate = (goal: string) => {
        setMissionGoal(goal);
    };

    // ─── Render ───
    const views: { id: ViewId; label: string; icon: any }[] = [
        { id: 'mission', label: 'Mission Control', icon: Sparkles },
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

                            <div className="flex items-center justify-between gap-3">
                                <div className="text-[10px] text-slate-500 leading-relaxed max-w-md">
                                    Copies a Claude Code CLI command. Paste it into your terminal — the orchestrator will hold a brief planning session, then delegate to specialists.
                                </div>
                                <button onClick={launchMission} disabled={!missionGoal.trim()}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-lg shadow-violet-600/20">
                                    <Copy className="h-4 w-4" /> Copy Mission Command
                                </button>
                            </div>
                        </div>
                    </div>

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
