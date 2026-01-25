
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Uses Supabase's reset password handling
        // Make sure "Site URL" is set to http://localhost:3000 in Supabase Auth Settings
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/update-password',
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({
                type: 'success',
                text: 'Check your email for the password reset link.'
            });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen indigo-gradient selection:bg-blue-500/30 flex items-center justify-center p-6">
            <SEO title="Reset Password - ClarityWorks Studio" description="Reset your account password." />

            <div className="glass-panel p-8 md:p-12 rounded-[2rem] max-w-md w-full border-white/10">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-6">
                        <img src="/logos/ClarityWorks_logoWH.png" alt="ClarityWorks" className="h-8 opacity-80" />
                    </Link>
                    <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
                    <p className="text-slate-400">Enter your email to receive recovery instructions.</p>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl mb-6 text-sm border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-200' : 'bg-red-500/10 border-red-500/20 text-red-200'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleReset} className="space-y-6">
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-clarity-blue text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="mt-8 text-center text-slate-500 text-sm">
                    Remember your password? <Link to="/login" className="text-clarity-blue hover:text-white transition-colors font-bold">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
