import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050B1A] flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ returnTo: '/admin' }} replace />;
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-[#050B1A] flex flex-col items-center justify-center text-white gap-6">
                <div className="flex flex-col items-center gap-4 text-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <ShieldAlert className="h-8 w-8 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-black">Access Denied</h1>
                    <p className="text-slate-400">You don't have administrator access. Contact your ClarityWorks admin to request access.</p>
                    <a href="/" className="mt-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-sm font-bold transition-colors">
                        Return to Home
                    </a>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default AdminRoute;
