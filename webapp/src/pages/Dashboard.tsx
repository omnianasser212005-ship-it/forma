import React, { useEffect, useState } from 'react';
import { getAllServiceRequests, getAllProfiles } from '@/services/serviceApi';
import { ClipboardList, Users, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    newRequests: 0,
    totalProfiles: 0,
    completedRequests: 0,
  });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const requests = await getAllServiceRequests();
        const profiles = await getAllProfiles();
        
        setStats({
          totalRequests: requests.length,
          newRequests: requests.filter((r: any) => r.status === 'New').length,
          totalProfiles: profiles.length,
          completedRequests: requests.filter((r: any) => r.status === 'Completed').length,
        });

        // Get only first 5 recent requests
        setRecentRequests(requests.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { name: 'Total Requests', value: stats.totalRequests, icon: ClipboardList, color: 'text-blue-400' },
    { name: 'New Requests', value: stats.newRequests, icon: AlertCircle, color: 'text-yellow-400' },
    { name: 'Total Users', value: stats.totalProfiles, icon: Users, color: 'text-purple-400' },
    { name: 'Completed', value: stats.completedRequests, icon: CheckCircle2, color: 'text-green-400' },
  ];

  if (loading) return <div className="p-8 text-white/50">Loading dashboard data...</div>;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-1 text-right md:text-left">
        <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">Overview</h1>
        <p className="text-white/50">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="bg-[#161616] border border-white/5 p-6 rounded-[22px] hover:border-white/10 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${card.color}`}>
                <card.icon size={24} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-white/80 text-xs font-bold uppercase tracking-wider">{card.name}</p>
              <h3 className="text-3xl font-bold text-white tracking-tight group-hover:scale-105 transition-transform origin-left">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Requests Table */}
        <div className="xl:col-span-2 bg-[#161616] border border-white/5 rounded-[22px] overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Recent Requests</h3>
            <Link to="/dashboard/requests" className="text-[#c8a45d] text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-white/70 text-[10px] font-black uppercase tracking-widest border-b border-white/10 bg-white/[0.03]">
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm text-white font-medium">{req.service_name}</p>
                      <p className="text-[10px] text-white/30">{req.request_id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-white">{req.email?.split('@')[0] || 'Unknown'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        req.status === 'New' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/10' : 
                        req.status === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/10' : 
                        'bg-blue-500/10 text-blue-500 border-blue-500/10'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-white/50">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {recentRequests.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-white/20 italic text-sm">No activity yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          <div className="bg-[#161616] border border-white/5 p-6 rounded-[22px]">
            <h3 className="text-xl font-bold text-white mb-4 text-right md:text-left">Quick Actions</h3>
            <div className="flex flex-col gap-3">
               <Link to="/dashboard/requests" className="w-full py-3 bg-white text-black font-bold rounded-xl text-center hover:bg-gray-200 transition-colors">Manage Requests</Link>
               <Link to="/dashboard/profiles" className="w-full py-3 bg-white/5 text-white font-bold rounded-xl text-center border border-white/10 hover:bg-white/10 transition-colors">User Directory</Link>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#c8a45d]/20 to-transparent border border-[#c8a45d]/10 p-6 rounded-[22px] relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-white font-bold mb-2">Need Support?</h4>
              <p className="text-white/50 text-sm mb-4 leading-relaxed">Our technical team is available 24/7 to assist you with any dashboard issues.</p>
              <button className="text-[#c8a45d] text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                Contact Technical Support <ArrowRight size={14} />
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#c8a45d]/10 rounded-full blur-2xl group-hover:bg-[#c8a45d]/20 transition-colors"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
