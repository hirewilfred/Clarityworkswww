
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            // Handle "User already registered" specifically
            if (error.message.includes("already registered")) {
                setError("This email is already registered. Please log in.");
            } else {
                setError(error.message);
            }
        } else {
            // Show success message or redirect
            alert("Account created! Please check your email to verify your account before logging in.");
            navigate('/login');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen indigo-gradient selection:bg-blue-500/30 flex items-center justify-center p-6">
            <SEO title="Sign Up - ClarityWorks Studio" description="Create your AI Studio account." />

            <div className="glass-panel p-8 md:p-12 rounded-[2rem] max-w-md w-full border-white/10">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-6">
                        <img src="/logos/ClarityWorks_logoWH.png" alt="ClarityWorks" className="h-8 opacity-80" />
                    </Link>
                    <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-slate-400">Save your AI audit results securely.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-6">
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
                        <label className="block text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-clarity-blue outline-none transition-colors"
                            placeholder="Min. 6 characters"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">Confirm Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-clarity-blue outline-none transition-colors"
                            placeholder="Re-enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-clarity-blue text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-8 text-center text-slate-500 text-sm">
                    Already have an account? <Link to="/login" className="text-clarity-blue hover:text-white transition-colors font-bold">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
