import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Users, Clock, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/moving-border';
import SEO from '../components/SEO';

const AIAudit: React.FC = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    // Redirect logged-in users who already completed the audit to their dashboard
    useEffect(() => {
        if (!loading && user) {
            const checkProfile = async () => {
                const { data: profile } = await supabase.from('profiles').select('has_completed_audit').eq('id', user.id).single();
                if (profile?.has_completed_audit) {
                    navigate('/dashboard');
                }
            };
            checkProfile();
        }
    }, [user, loading, navigate]);

    // Hide the global navbar and footer for this immersive landing page
    useEffect(() => {
        const navbar = document.querySelector('nav');
        const footer = document.querySelector('footer');

        if (navbar) navbar.style.display = 'none';
        if (footer) footer.style.display = 'none';

        return () => {
            if (navbar) navbar.style.display = 'block';
            if (footer) footer.style.display = 'block';
        };
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#050B1A] text-white">
            <SEO
              title="Free AI Readiness Audit | Hamilton & Toronto"
              description="Take our free AI readiness audit to discover where your business stands with AI adoption. Get a custom scorecard and actionable roadmap from ClarityWorks Studio."
            />
            {/* Dynamic Background Shapes */}
            <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[130px]" />
            <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-400/5 blur-[130px]" />

            <header className="fixed top-0 z-50 flex w-full items-center justify-between px-8 py-6 backdrop-blur-md border-b border-white/5">
                <Link to="/" className="flex items-center">
                    <img
                        src="/logos/ClarityWorks_logoWH.png"
                        alt="ClarityWorks Studio"
                        className="h-24 md:h-32 w-auto"
                    />
                </Link>
                {user ? (
                    <Link
                        to="/ai-audit/survey"
                        className="rounded-full bg-blue-600/10 border border-blue-500/20 px-6 py-2 text-sm font-medium transition-colors hover:bg-blue-600/20"
                    >
                        Continue to Survey
                    </Link>
                ) : (
                    <Link
                        to="/login"
                        state={{ returnTo: '/ai-audit/survey' }}
                        className="rounded-full bg-blue-600/10 border border-blue-500/20 px-6 py-2 text-sm font-medium transition-colors hover:bg-blue-600/20"
                    >
                        Client Login
                    </Link>
                )}
            </header>

            <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-sm font-medium text-blue-400 backdrop-blur-xl">
                        <TrendingUp className="h-4 w-4" />
                        Empowering Organizations with Smarter AI Solutions
                    </div>

                    <h1 className="mb-8 text-5xl font-bold tracking-tight sm:text-7xl">
                        Is Your Business Ready <br />
                        <span className="text-blue-500">For The AI Revolution?</span>
                    </h1>

                    <p className="mx-auto mb-12 max-w-2xl text-lg text-slate-400 sm:text-xl leading-relaxed">
                        Stop guessing and start optimizing. Get a professional AI readiness score
                        and a custom roadmap to save hours every week.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            to={user ? "/ai-audit/survey" : "/signup"}
                            state={!user ? { returnTo: '/ai-audit/survey' } : undefined}
                            className="group flex items-center justify-center gap-2 bg-blue-600 text-white h-16 w-full sm:w-72 rounded-[1.75rem] font-black text-lg transition-all hover:scale-[1.02] hover:bg-blue-700 shadow-xl shadow-blue-600/20"
                        >
                            Free AI Assessment
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        {!user && (
                            <Link
                                to="/login"
                                state={{ returnTo: '/ai-audit/survey' }}
                                className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                            >
                                Already have an account? Sign in
                            </Link>
                        )}
                    </div>
                </motion.div>

                {/* The AI Journey Section */}
                <div className="mt-32 w-full max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-purple-400">
                                The Roadmap
                            </div>
                            <h2 className="mb-6 text-4xl font-black tracking-tight sm:text-5xl">
                                Mapping The <br />
                                <span className="text-blue-500">Autonomous Journey</span>
                            </h2>
                            <p className="mb-6 text-lg text-slate-400 leading-relaxed">
                                Adopting Agentic AI isn't a simple software installation—it's a strategic evolution. Whether you are exploring basic workflow automations or looking to deploy fully custom autonomous agents, success requires a precise understanding of your current digital maturity.
                            </p>
                            <p className="mb-8 text-lg text-slate-400 leading-relaxed">
                                Without a clear baseline, businesses risk misaligning their tools, exposing sensitive data, or building fragmented systems that cannot scale.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { step: '01', title: 'Discovery & Assessment', desc: 'Identify immediate inefficiencies and high-value AI opportunities.' },
                                    { step: '02', title: 'Infrastructure Readiness', desc: 'Evaluate data security, API preparedness, and team capabilities.' },
                                    { step: '03', title: 'Integration & Deployment', desc: 'Seamlessly embed custom AI agents into your daily operations.' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-start group">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold group-hover:bg-blue-500/20 transition-colors">
                                            {item.step}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{item.title}</h4>
                                            <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative flex flex-col gap-6"
                        >
                            <div className="absolute inset-0 bg-blue-600/10 blur-[120px] rounded-full"></div>
                            {[
                                {
                                    category: "Real Estate",
                                    title: "Property Matchmaker",
                                    result: "40% Faster Closing",
                                    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
                                },
                                {
                                    category: "Healthcare",
                                    title: "Patient Acquisition",
                                    result: "65% More Consults",
                                    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800"
                                },
                                {
                                    category: "Media Agency",
                                    title: "Automated Output",
                                    result: "10x Content Scaling",
                                    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800"
                                }
                            ].map((study, idx) => (
                                <div key={idx} className="group relative z-10 overflow-hidden rounded-3xl border border-white/10 bg-[#050614]/60 p-5 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/40 hover:bg-[#050614]/80 flex flex-col sm:flex-row items-center gap-6">
                                    <div className="h-40 sm:h-32 w-full sm:w-32 shrink-0 overflow-hidden rounded-2xl relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 sm:hidden"></div>
                                        <img src={study.image} alt={study.title} className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100" />
                                    </div>
                                    <div className="flex flex-col flex-1 w-full sm:w-auto text-center sm:text-left">
                                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-2">{study.category}</span>
                                        <h4 className="text-xl font-bold text-white mb-4 sm:mb-2">{study.title}</h4>
                                        <div className="mt-auto inline-flex justify-center sm:justify-start">
                                            <span className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-4 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-blue-400 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                                                <TrendingUp className="h-3 w-3" />
                                                {study.result}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* The Importance of the Free Audit */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-32 w-full max-w-5xl mx-auto text-center glass rounded-[3rem] p-12 lg:p-20 border border-white/5 bg-slate-900/40 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>

                    <h2 className="text-4xl sm:text-5xl font-black mb-8 relative z-10 tracking-tight">Why The <span className="text-purple-400 italic">Free Baseline Assessment</span> Is Critical</h2>
                    <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-12 relative z-10 font-medium max-w-4xl mx-auto">
                        Our Free AI Audit isn't just a generic survey. It is a comprehensive diagnostic designed to illuminate your operational reality. By analyzing your unique workflows, we generate a tailored roadmap that highlights immediate high-ROI targets while shielding you from costly implementation pitfalls. Find out exactly where you stand, so you can move forward with absolute clarity.
                    </p>
                    <div className="relative z-10 flex justify-center">
                        <Link
                            to={user ? "/ai-audit/survey" : "/signup"}
                            state={!user ? { returnTo: '/ai-audit/survey' } : undefined}
                            className="group flex items-center justify-center gap-2 bg-blue-600 text-white h-16 w-full sm:w-72 rounded-[1.75rem] font-black text-lg transition-all hover:scale-[1.02] hover:bg-blue-700 shadow-xl shadow-blue-600/20"
                        >
                            Free AI Assessment
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </motion.div>

                {/* Service Feature Grid */}
                <div className="mt-32 grid gap-8 sm:grid-cols-3 w-full">
                    {[
                        {
                            icon: Clock,
                            title: "Save 10+ Hours/Week",
                            desc: "Identify repetitive tasks that AI can handle instantly so you can focus on growth."
                        },
                        {
                            icon: Shield,
                            title: "Secure Your Data",
                            desc: "Learn how to use AI tools safely without risking your client's private information."
                        },
                        {
                            icon: Users,
                            title: "Business Focused",
                            desc: "No corporate jargon. Practical, actionable advice tailored for modern businesses."
                        },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                            className="glass rounded-2xl p-8 border border-white/5 bg-slate-900/40 hover:border-blue-500/30 transition-all group"
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10 group-hover:bg-blue-600/20 transition-colors">
                                <feature.icon className="h-6 w-6 text-blue-500" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                            <p className="text-slate-400">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </main>

            <footer className="mt-20 border-t border-white/5 py-12 text-center text-sm text-slate-500 bg-black/20">
                © {new Date().getFullYear()} AUDCOMP Information Technology Solutions. Supporting Business Excellence.
            </footer>
        </div>
    );
};

export default AIAudit;
