import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://hpriqujsgrgqqfxhfsix.supabase.co',
    'sb_publishable_1ouUl515BoPgXvGc0D8YNg_kr12E6_-'
);

const knowledge = [
    { category: 'Pricing', content: 'Foundation Essentials: $2,500. Includes AI Readiness, 1 Custom Agent, and staff training.', source_url: '/' },
    { category: 'Pricing', content: 'Operational Catalyst: $6,500. Includes 2-3 Custom Agents, CRM Integration, and Analytics.', source_url: '/pricing' },
    { category: 'Pricing', content: 'Digital Workforce: $12,500+. Full multi-agent system, Unlimited Vector KB, AgentOps monitoring.', source_url: '/pricing' },
    { category: 'Agents', content: 'Executive Orchestrator: Specialized for long-term planning and reasoning.', source_url: '/agent-studio' },
    { category: 'Agents', content: 'AI Receptionist: 24/7 greeting, call routing, and smart scheduling.', source_url: '/services' },
    { category: 'Mission', content: 'Architecting Autonomous Legacies by bridging human insight with multi-agent frameworks.', source_url: '/about' }
];

async function sync() {
    console.log("Syncing knowledge base to Supabase...");
    const { data, error } = await supabase
        .from('knowledge_base')
        .insert(knowledge);

    if (error) {
        if (error.code === '42P01') {
            console.error("❌ Table 'knowledge_base' not found! Make sure you ran the SQL migration in Supabase.");
        } else if (error.code === '42501') {
            console.error("❌ RLS Permission Denied! Update your RLS policy to allow inserts.");
        } else {
            console.error("❌ Error syncing:", error.message);
        }
    } else {
        console.log("✅ Successfully synced 6 knowledge items to the database!");
    }
}

sync();
