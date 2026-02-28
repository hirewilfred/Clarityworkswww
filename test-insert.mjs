import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://hpriqujsgrgqqfxhfsix.supabase.co',
    'sb_publishable_1ouUl515BoPgXvGc0D8YNg_kr12E6_-'
);

async function testInsert() {
    console.log("Testing Insert...");

    // First we need a dummy user ID. In Supabase RLS you usually can't insert for another user.
    // If we get an RLS error, then we know RLS exists. If we get a schema error, we know the schema is wrong.

    const scoreData = {
        user_id: '00000000-0000-0000-0000-000000000000',
        overall_score: 50,
        category_scores: { "test": 50 },
        recommendations: ["test"]
    };

    const { error: scoreError } = await supabase
        .from('audit_scores')
        .insert(scoreData);

    console.log("audit_scores insert error:", scoreError);
}

testInsert();
