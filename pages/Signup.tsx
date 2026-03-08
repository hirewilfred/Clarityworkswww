import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import { Mail, Lock, Eye, EyeOff, Building, Phone } from 'lucide-react';

const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (!supabase) {
            setError("Database connection not configured. Please add Supabase environment variables.");
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({ email, password });

            if (error) {
                if (error.message.includes("already registered")) {
                    setError("This email is already registered. Please log in.");
                } else {
                    setError(error.message);
                }
            } else if (data.session) {
                // Auto-confirmed: save business info and go straight to the survey
                await supabase.from('profiles').upsert({
                    id: data.user!.id,
                    organization: companyName || null,
                    phone: phone || null,
                    updated_at: new Date().toISOString()
                } as any);
                const returnTo = location.state?.returnTo || '/ai-audit/survey';
                navigate(returnTo);
            } else {
                // Email verification required
                setSuccess("Account created! Please check your email to verify your account, then sign in.");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred during signup.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen bg-slate-50 font-sans items-center justify-center">
                <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center max-w-sm w-full mx-auto border border-slate-100">
                    <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-[26px] font-extrabold text-[#1a1f36] mb-3 tracking-tight">Check Your Email</h2>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">{success}</p>
                    <Link
                        to="/login"
                        state={location.state}
                        className="w-full flex justify-center rounded-xl bg-[#0f53e6] py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(15,83,230,0.39)] transition-all hover:bg-[#0c40b3] hover:shadow-[0_6px_20px_rgba(15,83,230,0.23)]"
                    >
                        Go to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            <SEO title="Sign Up - ClarityWorks Studio" description="Create your AI Studio account." />
            
            {/* Left Column (Form) */}
            <div className="flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-24 xl:px-32 relative bg-white overflow-y-auto">
                <div className="absolute top-8 left-8 lg:left-12">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logos/ClarityWorks_logo.png" alt="ClarityWorks" className="h-6" onError={(e) => { (e.target as HTMLImageElement).src = '/logos/ClarityWorks_logoWH.png'; (e.target as HTMLImageElement).style.filter = 'invert(1)'; }} />
                    </Link>
                </div>

                <div className="mx-auto w-full max-w-sm mt-12 lg:mt-0">
                    <h2 className="text-[28px] font-extrabold text-[#1a1f36] mb-2 tracking-tight">Create your Account</h2>
                    <p className="text-slate-500 text-sm mb-8 font-medium">Get started with your operational assessment.</p>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Building className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                required
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-700 text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                                placeholder="Company Name"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Phone className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-700 text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                                placeholder="Phone Number (Optional)"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Mail className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-700 text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                                placeholder="Email Address"
                            />
                        </div>
                        
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Lock className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-11 outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-700 text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                                placeholder="Password (Min. 6 chars)"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Lock className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                minLength={6}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-11 outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-700 text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                                placeholder="Confirm Password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-[#0f53e6] py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(15,83,230,0.39)] transition-all hover:bg-[#0c40b3] hover:shadow-[0_6px_20px_rgba(15,83,230,0.23)] disabled:opacity-70 mt-4 hover:-translate-y-[1px]"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm font-medium text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" state={location.state} className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Column (Hero Graphic) */}
            <div className="hidden w-1/2 bg-[#0d59f2] lg:flex lg:flex-col lg:items-center lg:justify-center relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[80px]"></div>
                
                {/* App UI Graphic Illustration */}
                <div className="relative z-10 w-[450px] aspect-[4/3] flex items-center justify-center rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 overflow-hidden bg-white/5 backdrop-blur-sm p-1">
                    <div className="w-full h-full rounded-xl overflow-hidden relative">
                        <img src="/images/realistic_ai_agents.png" alt="Futuristic AI Agents" className="w-full h-full object-cover" />
                        {/* Overlay Gradient for Text Readability later */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d59f2]/80 via-[#0d59f2]/10 to-transparent"></div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="relative z-10 text-center mt-12 mb-8 px-8">
                    <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Your Autonomous Workforce.</h3>
                    <p className="text-blue-100 font-medium text-[15px] max-w-md mx-auto leading-relaxed">Leverage intelligent agents to automate assessments, unblock bottlenecks, and modernize your operations effortlessly.</p>
                </div>
                
                {/* Dots indicator */}
                <div className="relative z-10 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                    <div className="w-2 h-2 rounded-full bg-white/30"></div>
                    <div className="w-2 h-2 rounded-full bg-white/30"></div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
