import React, { useEffect, useState } from 'react';
import { getAllProfiles } from '@/services/serviceApi';
import { Search, UserPlus, Mail, Phone, Calendar } from 'lucide-react';

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const data = await getAllProfiles();
      setProfiles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(p => 
    (p.full_name && p.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.phone && p.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">User Profiles</h1>
          <p className="text-white/50">Manage registered clients and company representatives.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors">
          <UserPlus size={18} />
          <span>Add User</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
        <input 
          type="text" 
          placeholder="Search by name, email, or company..."
          className="w-full bg-[#161616] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-white/20 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-white/30">Loading profiles...</div>
        ) : filteredProfiles.length === 0 ? (
          <div className="col-span-full py-12 text-center text-white/30">No users found matching your search.</div>
        ) : filteredProfiles.map((p) => (
          <div key={p.id} className="bg-[#161616] border border-white/5 p-6 rounded-[22px] hover:border-white/10 transition-all group hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-xl border border-white/5">
                {p.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="text-white font-bold leading-none mb-1">{p.full_name || 'Anonymous User'}</h3>
                <p className="text-white/40 text-xs">{p.company_name || 'No Company'}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <Mail size={14} className="text-white/30" />
                <span>{p.email}</span>
              </div>
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <Phone size={14} className="text-white/30" />
                <span>{p.phone || 'No phone added'}</span>
              </div>
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <Calendar size={14} className="text-white/30" />
                <span>Joined {new Date(p.updated_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-lg transition-colors border border-white/10">View Details</button>
              <button className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10">...</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
