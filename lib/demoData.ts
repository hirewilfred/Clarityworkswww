// Demo data for live-audience walkthrough.
// Persona: Petal & Stem Florist — boutique florist, Toronto.
// All numbers are static-but-believable. The activity ticker rotates so the
// feed feels alive on a projector.

export interface DemoAgent {
    name: string;
    label: string;
    description: string;
    status: 'running' | 'idle' | 'queued';
    currentTask?: string;
    outcomeMetric: string; // short outcome shown in the "running now" box (e.g. "47 captions / wk")
    weeklyHoursSaved: number; // estimated hours per week this agent saves a human marketer
}

export interface DemoCampaign {
    id: string;
    name: string;
    status: 'live' | 'queued' | 'draft';
    channels: string[];
    progress: number;
    posts: number;
    posted: number;
    metrics: { reach: number; engagement: number; saves: number };
    image: string;
    accent: string; // tailwind from-X-Y to-X-Y for fallback gradient
}

export interface DemoEvent {
    id: string;
    title: string;
    date: string; // human label
    type: 'wedding' | 'funeral' | 'corporate' | 'showcase' | 'birthday';
    arrangements: number;
    status: 'confirmed' | 'preview' | 'in-progress';
    image: string;
}

export interface DemoQueuedPost {
    id: string;
    platform: 'instagram' | 'facebook' | 'tiktok' | 'pinterest' | 'google';
    title: string;
    scheduledFor: string;
    type: 'reel' | 'carousel' | 'single' | 'story';
    image: string;
}

export interface DemoReel {
    id: string;
    platform: 'instagram' | 'tiktok';
    title: string;
    duration: string;
    views: string;
    image: string;
    accent: string;
}

export const DEMO_PERSONA = {
    businessName: 'Petal & Stem Florist',
    tagline: 'Boutique florals · Toronto · Same-day delivery',
    accent: 'rose',
    location: 'Toronto, ON',
    nextHoliday: { name: "Mother's Day", daysOut: 14 },
};

export const DEMO_KPIS = {
    activeAgents: 6,
    agentRunsToday: 47,
    postsQueued: 47,
    weeklyReach: 184_300,
    engagementRate: 6.8,
    eventsThisWeek: 12,
    liveCampaigns: 4,
    avgResponseTime: '8m',
};

export const DEMO_AGENTS: DemoAgent[] = [
    { name: 'content-strategist', label: 'Content Strategist', description: 'Plans the editorial calendar around holidays, weather, and stock.', status: 'running', currentTask: "Building Mother's Day countdown calendar (12 posts)", outcomeMetric: '32 posts planned / wk', weeklyHoursSaved: 4 },
    { name: 'caption-writer', label: 'Caption Writer', description: 'Drafts captions in the Petal & Stem voice — warm, seasonal, romantic.', status: 'running', currentTask: 'Drafting 3 caption variants for "For the Women Who Bloom Us" reel', outcomeMetric: '47 captions / wk', weeklyHoursSaved: 9.4 },
    { name: 'visual-director', label: 'Visual Director', description: 'Storyboards reels and TikToks; specifies shot list and pacing.', status: 'running', currentTask: 'Scripting 60s reel: bouquet wrap timelapse + voiceover', outcomeMetric: '8 reels storyboarded / wk', weeklyHoursSaved: 6 },
    { name: 'hashtag-researcher', label: 'Hashtag & SEO', description: 'Finds trending hashtags and local search terms.', status: 'idle', currentTask: 'Last run found 14 Mother\'s Day tags · avg 8.2k posts', outcomeMetric: '14 tag sets / wk', weeklyHoursSaved: 5.8 },
    { name: 'scheduler', label: 'Scheduler', description: 'Pushes approved posts to IG, FB, TikTok, Pinterest, Google Business.', status: 'running', currentTask: 'Queuing 9 posts for the long weekend', outcomeMetric: '47 posts scheduled / wk', weeklyHoursSaved: 4 },
    { name: 'engagement-responder', label: 'Engagement Responder', description: 'Replies to DMs and comments within target SLA.', status: 'running', currentTask: '12 DMs replied · avg 8m response time', outcomeMetric: '84 DMs replied / wk', weeklyHoursSaved: 7 },
    { name: 'ugc-curator', label: 'UGC Curator', description: 'Collects tagged customer photos and requests reuse permission.', status: 'idle', currentTask: '2 new tags pending permission DM', outcomeMetric: '12 photos curated / wk', weeklyHoursSaved: 1.6 },
    { name: 'analytics-watcher', label: 'Analytics Watcher', description: 'Flags posts running above/below baseline and adjusts strategy.', status: 'idle', currentTask: 'Tuesday Tulips reel: +312% above baseline reach', outcomeMetric: 'Weekly perf review', weeklyHoursSaved: 2 },
    { name: 'influencer-liaison', label: 'Influencer Liaison', description: 'Manages partnerships with local wedding planners and photographers.', status: 'queued', currentTask: 'Draft pitch to @torontoweddingplanners (47k followers)', outcomeMetric: '5 partnership pitches / wk', weeklyHoursSaved: 2.5 },
    { name: 'events-coordinator', label: 'Special Events Coordinator', description: 'Tracks weddings, funerals, corporate galas, and matches content to each.', status: 'running', currentTask: 'Sarah & James wedding — final preview booked Saturday', outcomeMetric: '6 events tracked / wk', weeklyHoursSaved: 3.5 },
];

// Aggregate impact — calculated from agent weeklyHoursSaved.
const _totalWeeklyHours = DEMO_AGENTS.reduce((s, a) => s + a.weeklyHoursSaved, 0);
const _hourlyMarketerRate = 32; // CAD/hr — conservative blended rate (junior + senior social marketer)
export const DEMO_IMPACT = {
    weeklyHoursSaved: Math.round(_totalWeeklyHours * 10) / 10,
    fteEquivalent: Math.round((_totalWeeklyHours / 40) * 100) / 100, // 1 FTE = 40 hrs/wk
    annualHoursSaved: Math.round(_totalWeeklyHours * 52),
    annualCostSaved: Math.round(_totalWeeklyHours * 52 * _hourlyMarketerRate),
    hourlyRate: _hourlyMarketerRate,
};

// Real Unsplash photo URLs — flowers, florists, weddings, events. Stable IDs.
const U = (id: string, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const DEMO_CAMPAIGNS: DemoCampaign[] = [
    {
        id: 'c1', name: "Mother's Day '26: For the Women Who Bloom Us",
        status: 'live', channels: ['Instagram', 'Facebook', 'TikTok', 'Pinterest', 'Google'],
        progress: 28, posts: 32, posted: 9,
        metrics: { reach: 84_120, engagement: 7.2, saves: 1_840 },
        image: U('photo-1487530811176-3780de880c2d'),
        accent: 'from-rose-500 to-pink-500',
    },
    {
        id: 'c2', name: 'Bridal Showcase Spring 2026',
        status: 'live', channels: ['Instagram', 'Pinterest'],
        progress: 64, posts: 24, posted: 15,
        metrics: { reach: 41_500, engagement: 9.1, saves: 2_310 },
        image: U('photo-1519741497674-611481863552'),
        accent: 'from-pink-400 to-rose-300',
    },
    {
        id: 'c3', name: 'Tuesday Tulips — Weekly Series',
        status: 'live', channels: ['Instagram', 'TikTok'],
        progress: 80, posts: 52, posted: 41,
        metrics: { reach: 38_600, engagement: 8.4, saves: 1_120 },
        image: U('photo-1490750967868-88aa4486c946'),
        accent: 'from-fuchsia-500 to-rose-500',
    },
    {
        id: 'c4', name: 'Behind the Bouquet — Reels Series',
        status: 'live', channels: ['Instagram', 'TikTok', 'Pinterest'],
        progress: 45, posts: 16, posted: 7,
        metrics: { reach: 22_080, engagement: 11.2, saves: 980 },
        image: U('photo-1455659817273-f96807779a8a'),
        accent: 'from-amber-400 to-rose-400',
    },
    {
        id: 'c5', name: "Father's Day Teasers",
        status: 'queued', channels: ['Instagram', 'Facebook'],
        progress: 0, posts: 8, posted: 0,
        metrics: { reach: 0, engagement: 0, saves: 0 },
        image: U('photo-1561181286-d3fee7d55364'),
        accent: 'from-emerald-400 to-teal-400',
    },
];

export const DEMO_REELS: DemoReel[] = [
    { id: 'r1', platform: 'instagram', title: '"For the Women Who Bloom Us" — Mother\'s Day reel', duration: '0:58', views: '12.4k', image: U('photo-1525310072745-f49212b5ac6d'), accent: 'from-rose-500 to-pink-500' },
    { id: 'r2', platform: 'tiktok', title: 'Wrapping a peony bouquet timelapse', duration: '0:42', views: '38.1k', image: U('photo-1487530811176-3780de880c2d'), accent: 'from-fuchsia-500 to-rose-500' },
    { id: 'r3', platform: 'instagram', title: 'Behind the Bouquet — Sarah & James preview', duration: '1:14', views: '8.7k', image: U('photo-1519741497674-611481863552'), accent: 'from-pink-400 to-rose-300' },
    { id: 'r4', platform: 'tiktok', title: 'POV: I\'m the bouquet she sent herself', duration: '0:31', views: '24.6k', image: U('photo-1490750967868-88aa4486c946'), accent: 'from-violet-500 to-fuchsia-500' },
];

export const DEMO_EVENTS: DemoEvent[] = [
    { id: 'e1', title: 'Sarah & James — Trinity Bellwoods', date: 'Sat Apr 28', type: 'wedding', arrangements: 18, status: 'confirmed', image: U('photo-1519741497674-611481863552', 200) },
    { id: 'e2', title: 'Aisha & Michael — Royal Conservatory', date: 'Sun Apr 29', type: 'wedding', arrangements: 14, status: 'in-progress', image: U('photo-1561181286-d3fee7d55364', 200) },
    { id: 'e3', title: 'Shopify HQ — Annual Gala', date: 'Mon Apr 30', type: 'corporate', arrangements: 40, status: 'confirmed', image: U('photo-1464366400600-7168b8af9bc3', 200) },
    { id: 'e4', title: 'Nguyen family arrangements', date: 'Wed May 1', type: 'funeral', arrangements: 3, status: 'preview', image: U('photo-1490750967868-88aa4486c946', 200) },
    { id: 'e5', title: 'Distillery District Bridal Booth', date: 'Fri May 3', type: 'showcase', arrangements: 12, status: 'in-progress', image: U('photo-1455659817273-f96807779a8a', 200) },
    { id: 'e6', title: 'Priya — 30th birthday surprise', date: 'Sat May 4', type: 'birthday', arrangements: 1, status: 'confirmed', image: U('photo-1525310072745-f49212b5ac6d', 200) },
];

export const DEMO_QUEUED_POSTS: DemoQueuedPost[] = [
    { id: 'p1', platform: 'instagram', title: '"A Bouquet for Mom Who Did It All" — 60s reel', scheduledFor: 'Today · 11:30 AM', type: 'reel', image: U('photo-1525310072745-f49212b5ac6d', 200) },
    { id: 'p2', platform: 'tiktok', title: 'Wrapping a peony bouquet timelapse', scheduledFor: 'Today · 4:15 PM', type: 'reel', image: U('photo-1487530811176-3780de880c2d', 200) },
    { id: 'p3', platform: 'instagram', title: "Mother's Day Pre-order carousel (8 slides)", scheduledFor: 'Tomorrow · 9:00 AM', type: 'carousel', image: U('photo-1561181286-d3fee7d55364', 200) },
    { id: 'p4', platform: 'pinterest', title: 'Spring tablescape inspiration board', scheduledFor: 'Tomorrow · 12:00 PM', type: 'single', image: U('photo-1519741497674-611481863552', 200) },
    { id: 'p5', platform: 'instagram', title: 'Behind the bouquet: Sarah & James wedding teaser', scheduledFor: 'Sat · 10:00 AM', type: 'story', image: U('photo-1469259943454-aa100abba749', 200) },
    { id: 'p6', platform: 'facebook', title: "Same-day delivery promo + Mother's Day countdown", scheduledFor: 'Sat · 2:00 PM', type: 'single', image: U('photo-1490750967868-88aa4486c946', 200) },
    { id: 'p7', platform: 'google', title: "Google Business: Open Mother's Day weekend", scheduledFor: 'Sun · 8:00 AM', type: 'single', image: U('photo-1455659817273-f96807779a8a', 200) },
    { id: 'p8', platform: 'tiktok', title: "POV: I'm the bouquet she sent herself", scheduledFor: 'Sun · 7:00 PM', type: 'reel', image: U('photo-1525310072745-f49212b5ac6d', 200) },
];

// Activity ticker — rotates so the feed always shows fresh entries during a live demo.
const ACTIVITY_LINES: { agent: string; status: 'running' | 'succeeded'; task: string }[] = [
    { agent: 'caption-writer', status: 'succeeded', task: 'Drafted 3 caption variants for "For the Women Who Bloom Us" reel' },
    { agent: 'visual-director', status: 'running', task: 'Storyboarding "Wrapping a Peony Bouquet" 45s timelapse' },
    { agent: 'hashtag-researcher', status: 'succeeded', task: 'Found 14 trending Mother\'s Day hashtags · avg 8.2k posts' },
    { agent: 'ugc-curator', status: 'succeeded', task: 'Sent permission DMs for 2 customer-tagged photos' },
    { agent: 'analytics-watcher', status: 'succeeded', task: 'Flagged: Tuesday Tulips reel +312% above baseline reach' },
    { agent: 'engagement-responder', status: 'running', task: 'Replying to 4 wedding inquiry DMs' },
    { agent: 'events-coordinator', status: 'succeeded', task: 'Sarah & James wedding — final preview booked Sat 2pm' },
    { agent: 'scheduler', status: 'succeeded', task: 'Queued 9 posts for the long weekend across IG, FB, TikTok' },
    { agent: 'content-strategist', status: 'running', task: 'Generating Father\'s Day teaser calendar (8 posts)' },
    { agent: 'caption-writer', status: 'running', task: 'Drafting Google Business post for Mother\'s Day weekend hours' },
    { agent: 'influencer-liaison', status: 'succeeded', task: 'Sent partnership pitch to @torontoweddingplanners (47k)' },
    { agent: 'analytics-watcher', status: 'succeeded', task: 'Best-performing reel this week: "Tulip wrap timelapse" — 38k reach' },
    { agent: 'visual-director', status: 'succeeded', task: 'Approved shot list for "Behind the Bouquet — Episode 7"' },
    { agent: 'hashtag-researcher', status: 'running', task: 'Cross-referencing #TorontoFlorist regional saturation' },
    { agent: 'engagement-responder', status: 'succeeded', task: 'Replied to 12 DMs · avg response 8 min · 3 quote requests' },
    { agent: 'ugc-curator', status: 'running', task: 'Curating bridal-party photos from Trinity Bellwoods wedding' },
    { agent: 'scheduler', status: 'succeeded', task: 'Synced this week\'s content to Buffer + native scheduling' },
    { agent: 'events-coordinator', status: 'running', task: 'Building post template for Shopify HQ gala (40 centerpieces)' },
    { agent: 'content-strategist', status: 'succeeded', task: 'Locked next 14 days of grid layout — alternating reel/carousel' },
    { agent: 'caption-writer', status: 'succeeded', task: 'Refreshed evergreen captions library (87 entries)' },
];

export function makeActivityEntry(seedIndex: number, baseTime: number) {
    const line = ACTIVITY_LINES[seedIndex % ACTIVITY_LINES.length];
    return {
        id: `demo-${seedIndex}-${baseTime}`,
        agent_name: line.agent,
        status: line.status as string,
        task: line.task,
        created_at: new Date(baseTime - seedIndex * 47_000).toISOString(),
    };
}

export function buildInitialActivity(count = 8) {
    const now = Date.now();
    return Array.from({ length: count }).map((_, i) => makeActivityEntry(i, now));
}
