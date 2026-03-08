import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://hpriqujsgrgqqfxhfsix.supabase.co',
    'sb_publishable_1ouUl515BoPgXvGc0D8YNg_kr12E6_-'
);

async function checkDatabase() {
    console.log("Checking Database Inserts...");

    // 1. Sign up a random user
    const email = `test-${Date.now()}@example.com`;
    const password = 'Password123!';
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
    });

    if (authError) {
        console.log("Auth error:", authError);
        return;
    }

    const userId = authData.user.id;
    console.log("Created test user:", userId);

    // 2. Test response insert
    const responseData = [{
        user_id: userId,
        question_id: 'test',
        answer: 50
    }];

    const { error: respError } = await supabase
        .from('audit_responses')
        .insert(responseData);

    console.log("audit_responses error:", respError);

    // 3. Test score insert
    const scoreData = {
        user_id: userId,
        overall_score: 50,
        category_scores: [{ "category": "test", "score": 50, "fullMark": 100 }],
        recommendations: ["test"]
    };

    const { error: scoreError } = await supabase
        .from('audit_scores')
        .insert(scoreData);

    console.log("audit_scores error:", scoreError);

    // 4. Test profile update
    const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        has_completed_audit: true,
        last_audit_score: 50,
        updated_at: new Date().toISOString()
    });

    console.log("profiles error:", profileError);
}

checkDatabase();
