import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
    Loader2, Search, Plus, RefreshCw, Trash2, Save, X,
    Users, Building2, DollarSign, MessageCircle, Phone, Mail,
    Calendar, CheckCircle2, Clock, ArrowRight, ExternalLink,
    Target, TrendingUp, Briefcase, FileText, MapPin, Tag,
    ChevronDown, Eye, Edit3, Activity,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───
type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
type ActivityType = 'note' | 'call' | 'email' | 'meeting' | 'linkedin' | 'task';
type CRMView = 'pipeline' | 'contacts' | 'companies' | 'activities';

interface Company {
    id: string;
    name: string;
    domain: string;
    industry: string;
    size: string;
    location: string;
    website: string;
    linkedin_url: string;
    phone: string;
    notes: string;
    created_at: string;
}

interface Contact {
    id: string;
    company_id: string | null;
    linkedin_lead_id: string | null;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    title: string;
    linkedin_url: string;
    location: string;
    source: string;
    tags: string[];
    notes: string;
    created_at: string;
    company?: Company;
}

interface Deal {
    id: string;
    contact_id: string | null;
    company_id: string | null;
    title: string;
    value: number;
    currency: string;
    stage: DealStage;
    priority: string;
    expected_close_date: string | null;
    closed_at: string | null;
    notes: string;
    created_at: string;
    contact?: Contact;
    company?: Company;
}

interface ActivityItem {
    id: string;
    contact_id: string | null;
    deal_id: string | null;
    type: ActivityType;
    subject: string;
    body: string;
    completed: boolean;
    due_date: string | null;
    created_at: string;
}

const DEAL_STAGES: { id: DealStage; label: string; color: string; bg: string; border: string }[] = [
    { id: 'lead', label: 'Lead', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
    { id: 'qualified', label: 'Qualified', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { id: 'proposal', label: 'Proposal', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { id: 'negotiation', label: 'Negotiation', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { id: 'closed_won', label: 'Closed Won', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { id: 'closed_lost', label: 'Closed Lost', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
];

const ACTIVITY_TYPES: { id: ActivityType; label: string; icon: any; color: string }[] = [
    { id: 'note', label: 'Note', icon: FileText, color: 'text-slate-400' },
    { id: 'call', label: 'Call', icon: Phone, color: 'text-emerald-400' },
    { id: 'email', label: 'Email', icon: Mail, color: 'text-blue-400' },
    { id: 'meeting', label: 'Meeting', icon: Calendar, color: 'text-violet-400' },
    { id: 'linkedin', label: 'LinkedIn', icon: Users, color: 'text-sky-400' },
    { id: 'task', label: 'Task', icon: CheckCircle2, color: 'text-amber-400' },
];

const PRIORITY_COLORS: Record<string, string> = {
    low: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    medium: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    high: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    urgent: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

const formatCurrency = (val: number, currency = 'CAD') =>
    new Intl.NumberFormat('en-CA', { style: 'currency', currency, minimumFractionDigits: 0 }).format(val);

// ─── Main Component ───
const CRMDashboard: React.FC = () => {
    const { user } = useAuth();
    const [activeView, setActiveView] = useState<CRMView>('pipeline');

    // Data
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [deals, setDeals] = useState<Deal[]>([]);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Search
    const [search, setSearch] = useState('');

    // Modals
    const [showAddContact, setShowAddContact] = useState(false);
    const [showAddCompany, setShowAddCompany] = useState(false);
    const [showAddDeal, setShowAddDeal] = useState(false);
    const [showAddActivity, setShowAddActivity] = useState(false);
    const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
    const [saving, setSaving] = useState(false);

    // Forms
    const [newContact, setNewContact] = useState({ first_name: '', last_name: '', email: '', phone: '', title: '', company_id: '', linkedin_url: '', location: '', source: 'manual', notes: '' });
    const [newCompany, setNewCompany] = useState({ name: '', domain: '', industry: '', size: '', location: '', website: '', linkedin_url: '', phone: '', notes: '' });
    const [newDeal, setNewDeal] = useState({ title: '', value: 0, contact_id: '', company_id: '', stage: 'lead' as DealStage, priority: 'medium', expected_close_date: '', notes: '' });
    const [newActivity, setNewActivity] = useState({ type: 'note' as ActivityType, subject: '', body: '', contact_id: '', deal_id: '', due_date: '' });

    // ─── Fetch all data ───
    const fetchAll = useCallback(async () => {
        if (!supabase || !user) return;
        setLoading(true);
        const [cRes, coRes, dRes, aRes] = await Promise.all([
            supabase.from('crm_contacts').select('*, company:crm_companies(id, name, industry)').eq('owner_id', user.id).order('created_at', { ascending: false }),
            supabase.from('crm_companies').select('*').eq('owner_id', user.id).order('created_at', { ascending: false }),
            supabase.from('crm_deals').select('*, contact:crm_contacts(id, first_name, last_name, email, title), company:crm_companies(id, name)').eq('owner_id', user.id).order('created_at', { ascending: false }),
            supabase.from('crm_activities').select('*').eq('owner_id', user.id).order('created_at', { ascending: false }).limit(100),
        ]);
        setContacts((cRes.data || []) as Contact[]);
        setCompanies((coRes.data || []) as Company[]);
        setDeals((dRes.data || []) as Deal[]);
        setActivities((aRes.data || []) as ActivityItem[]);
        setLoading(false);
    }, [user]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ─── Import from LinkedIn leads ───
    const importLinkedInLeads = async () => {
        if (!supabase || !user) return;
        setSaving(true);
        // Get linkedin leads not yet in CRM
        const { data: liLeads } = await supabase
            .from('linkedin_leads')
            .select('*')
            .eq('owner_id', user.id)
            .is('id', null); // We'll use a different approach

        // Get all linkedin leads
        const { data: allLiLeads } = await supabase
            .from('linkedin_leads')
            .select('id, first_name, last_name, email, title, company, location, linkedin_url, industry')
            .eq('owner_id', user.id);

        // Get existing CRM contacts with linkedin_lead_id
        const { data: existingContacts } = await supabase
            .from('crm_contacts')
            .select('linkedin_lead_id')
            .eq('owner_id', user.id)
            .not('linkedin_lead_id', 'is', null);

        const existingIds = new Set((existingContacts || []).map((c: any) => c.linkedin_lead_id));
        const newLeads = (allLiLeads || []).filter((l: any) => !existingIds.has(l.id));

        if (newLeads.length === 0) {
            setSaving(false);
            return;
        }

        // Create companies first (deduplicate by name)
        const companyNames = [...new Set(newLeads.map((l: any) => l.company).filter(Boolean))];
        const existingCompanyNames = new Set(companies.map(c => c.name.toLowerCase()));
        const newCompanyInserts = companyNames
            .filter(name => !existingCompanyNames.has(name.toLowerCase()))
            .map(name => ({
                owner_id: user.id,
                name,
                industry: newLeads.find((l: any) => l.company === name)?.industry || '',
            }));

        if (newCompanyInserts.length > 0) {
            await supabase.from('crm_companies').insert(newCompanyInserts);
        }

        // Refetch companies to get IDs
        const { data: allCompanies } = await supabase.from('crm_companies').select('id, name').eq('owner_id', user.id);
        const companyMap = new Map((allCompanies || []).map((c: any) => [c.name.toLowerCase(), c.id]));

        // Create contacts
        const contactInserts = newLeads.map((l: any) => ({
            owner_id: user.id,
            linkedin_lead_id: l.id,
            first_name: l.first_name,
            last_name: l.last_name,
            email: l.email || '',
            title: l.title || '',
            linkedin_url: l.linkedin_url || '',
            location: l.location || '',
            source: 'linkedin',
            company_id: companyMap.get(l.company?.toLowerCase()) || null,
        }));

        await supabase.from('crm_contacts').insert(contactInserts);
        await fetchAll();
        setSaving(false);
    };

    // ─── CRUD: Contacts ───
    const createContact = async () => {
        if (!supabase || !user || !newContact.first_name.trim()) return;
        setSaving(true);
        await supabase.from('crm_contacts').insert({ ...newContact, owner_id: user.id, company_id: newContact.company_id || null });
        setNewContact({ first_name: '', last_name: '', email: '', phone: '', title: '', company_id: '', linkedin_url: '', location: '', source: 'manual', notes: '' });
        setShowAddContact(false);
        await fetchAll();
        setSaving(false);
    };

    const deleteContact = async (id: string) => {
        if (!supabase) return;
        await supabase.from('crm_contacts').delete().eq('id', id);
        setContacts(prev => prev.filter(c => c.id !== id));
    };

    // ─── CRUD: Companies ───
    const createCompany = async () => {
        if (!supabase || !user || !newCompany.name.trim()) return;
        setSaving(true);
        await supabase.from('crm_companies').insert({ ...newCompany, owner_id: user.id });
        setNewCompany({ name: '', domain: '', industry: '', size: '', location: '', website: '', linkedin_url: '', phone: '', notes: '' });
        setShowAddCompany(false);
        await fetchAll();
        setSaving(false);
    };

    const deleteCompany = async (id: string) => {
        if (!supabase) return;
        await supabase.from('crm_companies').delete().eq('id', id);
        setCompanies(prev => prev.filter(c => c.id !== id));
    };

    // ─── CRUD: Deals ───
    const createDeal = async () => {
        if (!supabase || !user || !newDeal.title.trim()) return;
        setSaving(true);
        await supabase.from('crm_deals').insert({
            owner_id: user.id,
            title: newDeal.title,
            value: newDeal.value,
            stage: newDeal.stage,
            priority: newDeal.priority,
            contact_id: newDeal.contact_id || null,
            company_id: newDeal.company_id || null,
            expected_close_date: newDeal.expected_close_date || null,
            notes: newDeal.notes,
        });
        setNewDeal({ title: '', value: 0, contact_id: '', company_id: '', stage: 'lead', priority: 'medium', expected_close_date: '', notes: '' });
        setShowAddDeal(false);
        await fetchAll();
        setSaving(false);
    };

    const updateDealStage = async (dealId: string, stage: DealStage) => {
        if (!supabase) return;
        const updates: any = { stage, updated_at: new Date().toISOString() };
        if (stage === 'closed_won' || stage === 'closed_lost') updates.closed_at = new Date().toISOString();
        await supabase.from('crm_deals').update(updates).eq('id', dealId);
        setDeals(prev => prev.map(d => d.id === dealId ? { ...d, ...updates } : d));
    };

    const deleteDeal = async (id: string) => {
        if (!supabase) return;
        await supabase.from('crm_deals').delete().eq('id', id);
        setDeals(prev => prev.filter(d => d.id !== id));
    };

    // ─── CRUD: Activities ───
    const createActivity = async () => {
        if (!supabase || !user || !newActivity.subject.trim()) return;
        setSaving(true);
        await supabase.from('crm_activities').insert({
            owner_id: user.id,
            type: newActivity.type,
            subject: newActivity.subject,
            body: newActivity.body,
            contact_id: newActivity.contact_id || null,
            deal_id: newActivity.deal_id || null,
            due_date: newActivity.due_date || null,
        });
        setNewActivity({ type: 'note', subject: '', body: '', contact_id: '', deal_id: '', due_date: '' });
        setShowAddActivity(false);
        await fetchAll();
        setSaving(false);
    };

    const toggleActivityComplete = async (id: string, current: boolean) => {
        if (!supabase) return;
        await supabase.from('crm_activities').update({ completed: !current }).eq('id', id);
        setActivities(prev => prev.map(a => a.id === id ? { ...a, completed: !current } : a));
    };

    const deleteActivity = async (id: string) => {
        if (!supabase) return;
        await supabase.from('crm_activities').delete().eq('id', id);
        setActivities(prev => prev.filter(a => a.id !== id));
    };

    // ─── Pipeline stats ───
    const pipelineStats = DEAL_STAGES.map(s => ({
        ...s,
        count: deals.filter(d => d.stage === s.id).length,
        value: deals.filter(d => d.stage === s.id).reduce((sum, d) => sum + (d.value || 0), 0),
    }));
    const totalPipelineValue = deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).reduce((sum, d) => sum + (d.value || 0), 0);
    const wonValue = deals.filter(d => d.stage === 'closed_won').reduce((sum, d) => sum + (d.value || 0), 0);

    const views = [
        { id: 'pipeline' as CRMView, label: 'Deal Pipeline', icon: TrendingUp },
        { id: 'contacts' as CRMView, label: 'Contacts', icon: Users },
        { id: 'companies' as CRMView, label: 'Companies', icon: Building2 },
        { id: 'activities' as CRMView, label: 'Activities', icon: Activity },
    ];

    // ─── Modal overlay helper ───
    const Modal: React.FC<{ show: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ show, onClose, title, children }) => (
        <AnimatePresence>
            {show && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-[#0d1626] border border-white/10 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto">
                        <div className="sticky top-0 bg-[#0d1626] px-6 py-4 border-b border-white/10 flex items-center justify-between z-10">
                            <h3 className="font-black text-white">{title}</h3>
                            <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const InputField: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }> = ({ label, value, onChange, placeholder, type = 'text' }) => (
        <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50" />
        </div>
    );

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-blue-500 animate-spin" /></div>;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-6">

            {/* Sub-navigation */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
                    {views.map(v => {
                        const Icon = v.icon;
                        return (
                            <button key={v.id} onClick={() => setActiveView(v.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === v.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white'}`}>
                                <Icon className="h-4 w-4" /> {v.label}
                            </button>
                        );
                    })}
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={importLinkedInLeads} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-xs font-bold text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50">
                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Users className="h-3.5 w-3.5" />}
                        Import LinkedIn Leads
                    </button>
                    <button onClick={fetchAll} className="p-2 text-slate-400 hover:text-white transition-colors"><RefreshCw className="h-4 w-4" /></button>
                </div>
            </div>

            {/* ═══════════ DEAL PIPELINE ═══════════ */}
            {activeView === 'pipeline' && (
                <>
                    {/* Summary cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl p-5 border border-white/5">
                            <div className="text-sm text-slate-400 font-medium mb-1">Total Deals</div>
                            <div className="text-3xl font-black text-white">{deals.length}</div>
                        </div>
                        <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl p-5 border border-white/5">
                            <div className="text-sm text-slate-400 font-medium mb-1">Pipeline Value</div>
                            <div className="text-3xl font-black text-blue-400">{formatCurrency(totalPipelineValue)}</div>
                        </div>
                        <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl p-5 border border-white/5">
                            <div className="text-sm text-slate-400 font-medium mb-1">Won Revenue</div>
                            <div className="text-3xl font-black text-emerald-400">{formatCurrency(wonValue)}</div>
                        </div>
                        <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl p-5 border border-white/5">
                            <div className="text-sm text-slate-400 font-medium mb-1">Contacts</div>
                            <div className="text-3xl font-black text-white">{contacts.length}</div>
                        </div>
                    </div>

                    {/* Stage columns (Kanban) */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-white">Deal Pipeline</h2>
                        <button onClick={() => setShowAddDeal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all">
                            <Plus className="h-4 w-4" /> New Deal
                        </button>
                    </div>

                    <div className="grid grid-cols-6 gap-3 min-h-[400px]">
                        {pipelineStats.map(stage => (
                            <div key={stage.id} className={`rounded-2xl border ${stage.border} bg-white/[0.02] p-3`}>
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <div className={`text-xs font-black uppercase tracking-widest ${stage.color}`}>{stage.label}</div>
                                    <div className={`text-xs font-bold ${stage.color}`}>{stage.count}</div>
                                </div>
                                <div className="text-center mb-3">
                                    <div className={`text-sm font-black ${stage.color}`}>{formatCurrency(stage.value)}</div>
                                </div>
                                <div className="space-y-2">
                                    {deals.filter(d => d.stage === stage.id).map(deal => (
                                        <div key={deal.id} className="group bg-white/5 border border-white/5 rounded-xl p-3 hover:border-white/15 transition-all cursor-pointer">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="text-sm font-bold text-white leading-tight pr-2">{deal.title}</div>
                                                <button onClick={() => deleteDeal(deal.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all shrink-0">
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <div className="text-xs font-bold text-blue-400 mb-1">{formatCurrency(deal.value)}</div>
                                            {deal.contact && <div className="text-[10px] text-slate-500">{deal.contact.first_name} {deal.contact.last_name}</div>}
                                            {deal.company && <div className="text-[10px] text-slate-500 flex items-center gap-1"><Building2 className="h-2.5 w-2.5" />{deal.company.name}</div>}
                                            <div className="mt-2 flex gap-1">
                                                <select value={deal.stage} onChange={e => updateDealStage(deal.id, e.target.value as DealStage)}
                                                    className="text-[9px] font-bold bg-transparent border border-white/10 rounded-lg px-1.5 py-0.5 text-slate-400 outline-none cursor-pointer">
                                                    {DEAL_STAGES.map(s => <option key={s.id} value={s.id} className="bg-[#0d1626]">{s.label}</option>)}
                                                </select>
                                            </div>
                                            {deal.expected_close_date && (
                                                <div className="text-[9px] text-slate-600 mt-1 flex items-center gap-1"><Calendar className="h-2.5 w-2.5" />{new Date(deal.expected_close_date).toLocaleDateString()}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ═══════════ CONTACTS ═══════════ */}
            {activeView === 'contacts' && (
                <>
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50" />
                        </div>
                        <button onClick={() => setShowAddContact(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all">
                            <Plus className="h-4 w-4" /> Add Contact
                        </button>
                    </div>

                    <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/3">
                                        <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Company</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {contacts
                                        .filter(c => !search || `${c.first_name} ${c.last_name} ${c.email} ${(c.company as any)?.name || ''}`.toLowerCase().includes(search.toLowerCase()))
                                        .map(contact => (
                                            <tr key={contact.id} className="hover:bg-white/2 transition-colors group">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-black shrink-0">
                                                            {contact.first_name?.charAt(0) || 'C'}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-200">{contact.first_name} {contact.last_name}</div>
                                                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{contact.title || '—'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-400">{(contact.company as any)?.name || '—'}</td>
                                                <td className="px-4 py-3">
                                                    {contact.email ? <a href={`mailto:${contact.email}`} className="text-sm text-blue-400 hover:text-blue-300">{contact.email}</a> : <span className="text-sm text-slate-600">—</span>}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${contact.source === 'linkedin' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                                                        {contact.source}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        {contact.linkedin_url && (
                                                            <a href={contact.linkedin_url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all">
                                                                <ExternalLink className="h-3 w-3" />
                                                            </a>
                                                        )}
                                                        <button onClick={() => deleteContact(contact.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 transition-all">
                                                            <Trash2 className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    {contacts.length === 0 && (
                                        <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No contacts yet. Add manually or import from LinkedIn leads.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* ═══════════ COMPANIES ═══════════ */}
            {activeView === 'companies' && (
                <>
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-lg font-black text-white">Companies</h2>
                        <button onClick={() => setShowAddCompany(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all">
                            <Plus className="h-4 w-4" /> Add Company
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {companies.map(company => {
                            const companyContacts = contacts.filter(c => c.company_id === company.id);
                            const companyDeals = deals.filter(d => d.company_id === company.id);
                            return (
                                <div key={company.id} className="group backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 p-5 hover:border-white/15 transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-sm">
                                                {company.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{company.name}</div>
                                                <div className="text-[10px] text-slate-500">{company.industry || 'No industry'}</div>
                                            </div>
                                        </div>
                                        <button onClick={() => deleteCompany(company.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    {company.location && <div className="text-xs text-slate-500 flex items-center gap-1 mb-2"><MapPin className="h-3 w-3" />{company.location}</div>}
                                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                                        <div className="text-xs text-slate-400"><span className="font-bold text-white">{companyContacts.length}</span> contacts</div>
                                        <div className="text-xs text-slate-400"><span className="font-bold text-white">{companyDeals.length}</span> deals</div>
                                        {company.website && (
                                            <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 ml-auto flex items-center gap-1">
                                                <ExternalLink className="h-3 w-3" /> Site
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {companies.length === 0 && (
                            <div className="col-span-full backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 p-12 text-center">
                                <Building2 className="h-10 w-10 text-slate-600 mx-auto mb-4" />
                                <p className="text-sm text-slate-500">No companies yet. Add manually or import LinkedIn leads.</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* ═══════════ ACTIVITIES ═══════════ */}
            {activeView === 'activities' && (
                <>
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-lg font-black text-white">Recent Activities</h2>
                        <button onClick={() => setShowAddActivity(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all">
                            <Plus className="h-4 w-4" /> Log Activity
                        </button>
                    </div>
                    <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
                        <div className="divide-y divide-white/5">
                            {activities.map(act => {
                                const typeCfg = ACTIVITY_TYPES.find(t => t.id === act.type) || ACTIVITY_TYPES[0];
                                const Icon = typeCfg.icon;
                                return (
                                    <div key={act.id} className="group flex items-start gap-4 px-6 py-4 hover:bg-white/2 transition-colors">
                                        <div className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 ${typeCfg.color}`}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-bold text-white">{act.subject}</span>
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 ${typeCfg.color} uppercase tracking-widest`}>{typeCfg.label}</span>
                                                {act.type === 'task' && (
                                                    <button onClick={() => toggleActivityComplete(act.id, act.completed)} className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${act.completed ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                                                        {act.completed ? 'Done' : 'Pending'}
                                                    </button>
                                                )}
                                            </div>
                                            {act.body && <div className="text-xs text-slate-400 leading-relaxed">{act.body}</div>}
                                            <div className="text-[10px] text-slate-600 mt-1">{new Date(act.created_at).toLocaleString()}</div>
                                        </div>
                                        <button onClick={() => deleteActivity(act.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all shrink-0">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                );
                            })}
                            {activities.length === 0 && (
                                <div className="px-6 py-12 text-center text-slate-500">No activities logged yet.</div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* ═══════════ MODALS ═══════════ */}

            {/* Add Contact */}
            <Modal show={showAddContact} onClose={() => setShowAddContact(false)} title="Add Contact">
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="First Name" value={newContact.first_name} onChange={v => setNewContact(p => ({ ...p, first_name: v }))} placeholder="John" />
                    <InputField label="Last Name" value={newContact.last_name} onChange={v => setNewContact(p => ({ ...p, last_name: v }))} placeholder="Doe" />
                </div>
                <InputField label="Email" value={newContact.email} onChange={v => setNewContact(p => ({ ...p, email: v }))} placeholder="john@company.com" type="email" />
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Phone" value={newContact.phone} onChange={v => setNewContact(p => ({ ...p, phone: v }))} placeholder="+1 416..." />
                    <InputField label="Title" value={newContact.title} onChange={v => setNewContact(p => ({ ...p, title: v }))} placeholder="IT Director" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Company</label>
                    <select value={newContact.company_id} onChange={e => setNewContact(p => ({ ...p, company_id: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                        <option value="" className="bg-[#0d1626]">No company</option>
                        {companies.map(c => <option key={c.id} value={c.id} className="bg-[#0d1626]">{c.name}</option>)}
                    </select>
                </div>
                <InputField label="LinkedIn URL" value={newContact.linkedin_url} onChange={v => setNewContact(p => ({ ...p, linkedin_url: v }))} placeholder="https://linkedin.com/in/..." />
                <InputField label="Location" value={newContact.location} onChange={v => setNewContact(p => ({ ...p, location: v }))} placeholder="Toronto, ON" />
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Notes</label>
                    <textarea value={newContact.notes} onChange={e => setNewContact(p => ({ ...p, notes: e.target.value }))} rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white resize-none outline-none" />
                </div>
                <button onClick={createContact} disabled={saving || !newContact.first_name.trim()} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Contact
                </button>
            </Modal>

            {/* Add Company */}
            <Modal show={showAddCompany} onClose={() => setShowAddCompany(false)} title="Add Company">
                <InputField label="Company Name" value={newCompany.name} onChange={v => setNewCompany(p => ({ ...p, name: v }))} placeholder="Acme Corp" />
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Industry" value={newCompany.industry} onChange={v => setNewCompany(p => ({ ...p, industry: v }))} placeholder="Technology" />
                    <InputField label="Size" value={newCompany.size} onChange={v => setNewCompany(p => ({ ...p, size: v }))} placeholder="11-50 employees" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Location" value={newCompany.location} onChange={v => setNewCompany(p => ({ ...p, location: v }))} placeholder="Toronto, ON" />
                    <InputField label="Website" value={newCompany.website} onChange={v => setNewCompany(p => ({ ...p, website: v }))} placeholder="acme.com" />
                </div>
                <InputField label="Phone" value={newCompany.phone} onChange={v => setNewCompany(p => ({ ...p, phone: v }))} placeholder="+1 416..." />
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Notes</label>
                    <textarea value={newCompany.notes} onChange={e => setNewCompany(p => ({ ...p, notes: e.target.value }))} rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white resize-none outline-none" />
                </div>
                <button onClick={createCompany} disabled={saving || !newCompany.name.trim()} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Company
                </button>
            </Modal>

            {/* Add Deal */}
            <Modal show={showAddDeal} onClose={() => setShowAddDeal(false)} title="Create Deal">
                <InputField label="Deal Title" value={newDeal.title} onChange={v => setNewDeal(p => ({ ...p, title: v }))} placeholder="AI Automation Package — Acme" />
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Value (CAD)" value={String(newDeal.value)} onChange={v => setNewDeal(p => ({ ...p, value: Number(v) || 0 }))} placeholder="5000" type="number" />
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Stage</label>
                        <select value={newDeal.stage} onChange={e => setNewDeal(p => ({ ...p, stage: e.target.value as DealStage }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                            {DEAL_STAGES.map(s => <option key={s.id} value={s.id} className="bg-[#0d1626]">{s.label}</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Contact</label>
                        <select value={newDeal.contact_id} onChange={e => setNewDeal(p => ({ ...p, contact_id: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                            <option value="" className="bg-[#0d1626]">No contact</option>
                            {contacts.map(c => <option key={c.id} value={c.id} className="bg-[#0d1626]">{c.first_name} {c.last_name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Company</label>
                        <select value={newDeal.company_id} onChange={e => setNewDeal(p => ({ ...p, company_id: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                            <option value="" className="bg-[#0d1626]">No company</option>
                            {companies.map(c => <option key={c.id} value={c.id} className="bg-[#0d1626]">{c.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Priority</label>
                        <select value={newDeal.priority} onChange={e => setNewDeal(p => ({ ...p, priority: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                            <option value="low" className="bg-[#0d1626]">Low</option>
                            <option value="medium" className="bg-[#0d1626]">Medium</option>
                            <option value="high" className="bg-[#0d1626]">High</option>
                            <option value="urgent" className="bg-[#0d1626]">Urgent</option>
                        </select>
                    </div>
                    <InputField label="Expected Close" value={newDeal.expected_close_date} onChange={v => setNewDeal(p => ({ ...p, expected_close_date: v }))} type="date" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Notes</label>
                    <textarea value={newDeal.notes} onChange={e => setNewDeal(p => ({ ...p, notes: e.target.value }))} rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white resize-none outline-none" />
                </div>
                <button onClick={createDeal} disabled={saving || !newDeal.title.trim()} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <DollarSign className="h-4 w-4" />} Create Deal
                </button>
            </Modal>

            {/* Log Activity */}
            <Modal show={showAddActivity} onClose={() => setShowAddActivity(false)} title="Log Activity">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Type</label>
                        <select value={newActivity.type} onChange={e => setNewActivity(p => ({ ...p, type: e.target.value as ActivityType }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                            {ACTIVITY_TYPES.map(t => <option key={t.id} value={t.id} className="bg-[#0d1626]">{t.label}</option>)}
                        </select>
                    </div>
                    <InputField label="Due Date" value={newActivity.due_date} onChange={v => setNewActivity(p => ({ ...p, due_date: v }))} type="datetime-local" />
                </div>
                <InputField label="Subject" value={newActivity.subject} onChange={v => setNewActivity(p => ({ ...p, subject: v }))} placeholder="Follow-up call with John" />
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Details</label>
                    <textarea value={newActivity.body} onChange={e => setNewActivity(p => ({ ...p, body: e.target.value }))} rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white resize-none outline-none" placeholder="Notes about this activity..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Contact</label>
                        <select value={newActivity.contact_id} onChange={e => setNewActivity(p => ({ ...p, contact_id: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                            <option value="" className="bg-[#0d1626]">None</option>
                            {contacts.map(c => <option key={c.id} value={c.id} className="bg-[#0d1626]">{c.first_name} {c.last_name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Deal</label>
                        <select value={newActivity.deal_id} onChange={e => setNewActivity(p => ({ ...p, deal_id: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                            <option value="" className="bg-[#0d1626]">None</option>
                            {deals.map(d => <option key={d.id} value={d.id} className="bg-[#0d1626]">{d.title}</option>)}
                        </select>
                    </div>
                </div>
                <button onClick={createActivity} disabled={saving || !newActivity.subject.trim()} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Log Activity
                </button>
            </Modal>
        </motion.div>
    );
};

export default CRMDashboard;
