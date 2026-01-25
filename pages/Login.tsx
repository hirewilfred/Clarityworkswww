
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            // Check if there's a pending audit to save
            const pendingAudit = localStorage.getItem('pendingAudit');
            if (pendingAudit) {
                navigate('/ai-assessment'); // Redirect back to save
            } else {
                navigate('/dashboard');
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen indigo-gradient selection:bg-blue-500/30 flex items-center justify-center p-6">
            <SEO title="Login - ClarityWorks Studio" description="Login to your AI Studio account." />

            <div className="glass-panel p-8 md:p-12 rounded-[2rem] max-w-md w-full border-white/10">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-6">
                        <img src="/logos/ClarityWorks_logoWH.png" alt="ClarityWorks" className="h-8 opacity-80" />
                    </Link>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-slate-400">Sign in to access your audit dashboard.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-clarity-blue outline-none transition-colors"
                            placeholder="you@company.com"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-slate-300 text-xs font-bold uppercase tracking-widest">Password</label>
                            <Link to="/forgot-password" className="text-xs text-clarity-blue hover:text-white transition-colors">Forgot?</Link>
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-clarity-blue outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-clarity-blue text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-slate-500 text-sm">
                    Don't have an account? <Link to="/signup" className="text-clarity-blue hover:text-white transition-colors font-bold">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
