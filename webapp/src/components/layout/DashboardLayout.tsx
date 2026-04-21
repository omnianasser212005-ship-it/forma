import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '../dashboard/Sidebar';
import { AdminLogin } from '../dashboard/AdminLogin';
import { Bell, Search, User } from 'lucide-react';
import { supabase } from '@/services/supabase';

// Infer the Session type from the supabase client to avoid module resolution issues
type Session = any; // Fallback to any if inference is too complex, but let's try to be explicit

export const DashboardLayout = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-white/50">Loading dashboard...</div>;
  
  // Dev Bypass for Rate Limit issues
  const isBypass = localStorage.getItem('debug_auth_bypass') === 'true';
  if (!session && !isBypass) return <AdminLogin />;

  return (
    <div className="flex min-h-screen bg-[#0B0B0B] text-white">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0B0B0B]/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-4 text-white/60 font-medium">
            <Search size={20} />
            <span className="text-sm">Search command (⌘K)</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-white/80 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#c8a45d] rounded-full border-2 border-[#0B0B0B]"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">Admin User</p>
                <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mt-1">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/5 rounded-full border border-white/10 flex items-center justify-center">
                <User size={20} className="text-white/90" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="p-8 pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
