import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://hpriqujsgrgqqfxhfsix.supabase.co',
    'sb_publishable_1ouUl515BoPgXvGc0D8YNg_kr12E6_-'
);

async function checkDatabase() {
    console.log("Checking Database Tables...");

    const { error: e1 } = await supabase.from('audit_scores').select('id').limit(1);
    console.log("audit_scores table check:", e1 ? e1.message : "Exists and accessible");

    const { error: e2 } = await supabase.from('audit_responses').select('id').limit(1);
    console.log("audit_responses table check:", e2 ? e2.message : "Exists and accessible");

    const { error: e3 } = await supabase.from('experts').select('id').limit(1);
    console.log("experts table check:", e3 ? e3.message : "Exists and accessible");
}

checkDatabase();
