import React, { useEffect, useState } from 'react';
import { getAllServiceRequests, updateRequestStatus, getFileSignedUrl } from '@/services/serviceApi';
import { Search, Download, Filter, ExternalLink, FileText, X, ChevronRight, Info } from 'lucide-react';

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'details' | 'docs'>('details');
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [fetchingUrls, setFetchingUrls] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const filtered = requests.filter(r => 
      r.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.phone && r.phone.includes(searchTerm)) ||
      (r.email && r.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.company && r.company.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredRequests(filtered);
  }, [searchTerm, requests]);

  const fetchRequests = async () => {
    try {
      const data = await getAllServiceRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateRequestStatus(id, newStatus);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = async (req: any, mode: 'details' | 'docs') => {
    setSelectedReq(req);
    setViewMode(mode);
    
    if (mode === 'docs' && req.file_urls && req.file_urls.length > 0) {
      setFetchingUrls(true);
      const urls: Record<string, string> = {};
      try {
        for (const path of req.file_urls) {
          const signedUrl = await getFileSignedUrl(path);
          urls[path] = signedUrl;
        }
        setSignedUrls(urls);
      } catch (err) {
        console.error("Error fetching signed URLs:", err);
      } finally {
        setFetchingUrls(false);
      }
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Request ID', 'Service Name', 'Client Email', 'Phone', 'Age', 
      'Company Name', 'Company Type', 'Business Activity', 'Initial Capital', 
      'Status', 'Files Count', 'Submitted Date'
    ];
    
    const rows = filteredRequests.map(r => [
      r.request_id,
      r.service_name,
      r.email || 'N/A',
      r.phone || 'N/A',
      r.age || 'N/A',
      r.company || 'Private',
      r.company_type || 'N/A',
      r.activity || 'N/A',
      r.capital ? `${r.capital} EGP` : 'N/A',
      r.status,
      r.files_count || 0,
      new Date(r.created_at).toLocaleString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" // Add BOM for Excel Arabic support
      + headers.join(",") + "\n"
      + rows.map(e => e.map(val => `"${val}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `forma_requests_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'In Progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-white/10 text-white border-white/20';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-[#c8a45d] rounded-full shadow-[0_0_15px_rgba(200,164,93,0.3)]"></div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Service Requests</h1>
            <p className="text-white/70 text-sm font-medium">Comprehensive view of all legal service applications.</p>
          </div>
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all transform active:scale-95 shadow-lg shadow-white/5"
        >
          <Download size={18} />
          <span>Export All Data</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#c8a45d] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by ID, email, service, or company name..."
            className="w-full bg-[#161616]/50 backdrop-blur-sm border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#c8a45d]/30 focus:bg-[#161616] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#161616] border border-white/5 text-white/50 rounded-2xl hover:text-white transition-colors">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Advanced Full-Width Table */}
      <div className="bg-[#161616]/40 backdrop-blur-xl border border-white/5 rounded-[32px] overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse min-w-[1500px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04]">
                <th className="sticky left-0 z-10 bg-[#121212] px-6 py-5 text-left text-[10px] font-black text-white/80 uppercase tracking-widest border-r border-white/5 backdrop-blur-xl">Request ID</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-white/80 uppercase tracking-widest">Service</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-white/80 uppercase tracking-widest">Company</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-white/80 uppercase tracking-widest">Type</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-white/80 uppercase tracking-widest">Capital</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-white/80 uppercase tracking-widest">Contact Info</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-white/80 uppercase tracking-widest">Age</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-white/80 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-white/80 uppercase tracking-widest">Documents</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-white/80 uppercase tracking-widest">Date</th>
                <th className="sticky right-0 z-10 bg-[#121212] px-6 py-5 text-center text-[10px] font-black text-white/80 uppercase tracking-widest border-l border-white/5 backdrop-blur-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={11} className="px-6 py-24 text-center text-white/20 italic">Loading database records...</td></tr>
              ) : filteredRequests.length === 0 ? (
                <tr><td colSpan={11} className="px-6 py-24 text-center text-white/20 italic">No matching records found.</td></tr>
              ) : filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-white/[0.03] transition-all group">
                  <td className="sticky left-0 z-10 bg-[#131313] px-6 py-4 font-mono text-xs text-[#c8a45d] border-r border-white/5 group-hover:bg-[#1a1a1a] transition-colors">{req.request_id}</td>
                  <td className="px-6 py-4">
                    <span className="text-white font-semibold text-sm block">{req.service_name}</span>
                  </td>
                  <td className="px-6 py-4 text-white/80 text-sm">{req.company || 'Private Application'}</td>
                  <td className="px-6 py-4 text-white/70 text-xs font-bold uppercase tracking-tight">{req.company_type || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className="text-green-500/80 font-mono text-xs tabular-nums">
                      {req.capital ? `${Number(req.capital).toLocaleString()} EGP` : '---'}
                    </span>
                  </td>
                  <td className="px-6 py-4 min-w-[200px]">
                    <div className="text-white text-sm font-medium truncate">{req.email}</div>
                    <div className="text-white/60 text-xs font-mono">{req.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-white/70 text-sm font-mono">{req.age || '--'}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={req.status}
                      onChange={(e) => handleStatusUpdate(req.id, e.target.value)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${getStatusColor(req.status)} bg-transparent focus:outline-none cursor-pointer hover:brightness-110 transition-all`}
                    >
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => openModal(req, 'docs')}
                      className="px-3 py-1.5 flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg text-white/70 group-hover:text-[#c8a45d] group-hover:border-[#c8a45d]/30 transition-all"
                    >
                      <FileText size={14} />
                      <span className="text-xs font-bold">{req.files_count || 0}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-white/70 text-xs tabular-nums font-medium">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>
                  <td className="sticky right-0 z-10 bg-[#131313] px-6 py-4 border-l border-white/5 group-hover:bg-[#1a1a1a] transition-colors">
                    <div className="flex items-center justify-center gap-2">
                       <button 
                         onClick={() => openModal(req, 'details')}
                         className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-all shadow-sm"
                         title="Full Details"
                       >
                         <Info size={16} />
                       </button>
                       <button 
                         onClick={() => openModal(req, 'details')}
                         className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-[#c8a45d] transition-all shadow-sm"
                       >
                         <ExternalLink size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advanced Request Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-[#111111] border border-white/10 w-full max-w-4xl rounded-[40px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-white/[0.02] to-transparent">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-black uppercase bg-[#c8a45d] text-black px-2 py-0.5 rounded-md">Request #{selectedReq.request_id}</span>
                  <h3 className="text-2xl font-bold text-white">{viewMode === 'details' ? 'Detailed Application View' : 'Attached Documents'}</h3>
                </div>
                <p className="text-white/70 text-sm font-medium">Managing client data and compliance files.</p>
              </div>
              <button 
                onClick={() => setSelectedReq(null)}
                className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/5 hover:border-white/20 rounded-2xl text-white/40 transition-all font-mono"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex p-2 bg-white/5 mx-8 mt-6 rounded-2xl border border-white/5">
               <button 
                 onClick={() => setViewMode('details')}
                 className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'details' ? 'bg-[#c8a45d] text-black shadow-lg shadow-[#c8a45d]/20' : 'text-white/40 hover:text-white'}`}
               >
                 Information Summary
               </button>
               <button 
                 onClick={() => setViewMode('docs')}
                 className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'docs' ? 'bg-[#c8a45d] text-black shadow-lg shadow-[#c8a45d]/20' : 'text-white/40 hover:text-white'}`}
               >
                 Files & Attachments ({selectedReq.files_count})
               </button>
            </div>

            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {viewMode === 'details' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-8 col-span-1 lg:col-span-1">
                    <section>
                      <h4 className="text-[10px] font-black uppercase text-[#c8a45d] tracking-[0.2em] mb-4">Personal Profile</h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                          <p className="text-[10px] text-white/60 uppercase font-black tracking-widest mb-1">Email Reference</p>
                          <p className="text-white font-medium break-all">{selectedReq.email}</p>
                        </div>
                        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                          <p className="text-[10px] text-white/60 uppercase font-black tracking-widest mb-1">Phone Number</p>
                          <p className="text-white font-medium font-mono">{selectedReq.phone}</p>
                        </div>
                        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                          <p className="text-[10px] text-white/60 uppercase font-black tracking-widest mb-1">Age Declaration</p>
                          <p className="text-white font-medium">{selectedReq.age || 'Not specified'} years old</p>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-8 col-span-1 lg:col-span-2">
                    <section>
                      <h4 className="text-[10px] font-black uppercase text-[#c8a45d] tracking-[0.2em] mb-4">Company & Business Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl">
                          <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Legal Entity Name</p>
                          <p className="text-white text-lg font-bold">{selectedReq.company || 'Private Individual'}</p>
                        </div>
                        <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl">
                          <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Company Framework</p>
                          <p className="text-white font-medium uppercase tracking-wider">{selectedReq.company_type || 'N/A'}</p>
                        </div>
                        <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl col-span-1 md:col-span-2">
                          <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Primary Business Activity</p>
                          <p className="text-white font-medium">{selectedReq.activity || 'N/A'}</p>
                        </div>
                        <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl">
                          <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Declared Capital</p>
                          <p className="text-green-500 text-xl font-black tabular-nums">
                            {selectedReq.capital ? `${Number(selectedReq.capital).toLocaleString()} EGP` : 'No capital declared'}
                          </p>
                        </div>
                        <div className="p-5 bg-[#c8a45d]/5 border border-[#c8a45d]/10 rounded-2xl">
                          <p className="text-[10px] text-[#c8a45d] uppercase font-bold mb-1">Service Requested</p>
                          <p className="text-white font-bold">{selectedReq.service_name}</p>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              ) : (
                fetchingUrls ? (
                  <div className="py-24 flex flex-col items-center justify-center text-white/20 gap-6">
                     <div className="w-10 h-10 border-2 border-[#c8a45d] border-t-transparent rounded-full animate-spin"></div>
                     <p className="text-sm font-bold uppercase tracking-widest">Generating Secure Access Links</p>
                  </div>
                ) : selectedReq.file_urls?.length === 0 ? (
                  <div className="py-24 flex flex-col items-center justify-center text-white/10 gap-4">
                     <FileText size={48} strokeWidth={1} />
                     <p className="text-sm font-medium italic">No document attachments found for this request.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {selectedReq.file_urls?.map((path: string, idx: number) => {
                      const ext = path.split('.').pop()?.toLowerCase();
                      const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(ext || '');
                      const fileName = path.split('/').pop()?.split('.').shift()?.replace(/_/g, ' ') || `Document ${idx+1}`;
                      
                      return (
                        <div key={path} className="group relative">
                          <div className="bg-white/[0.03] border border-white/5 rounded-[32px] overflow-hidden transition-all hover:border-[#c8a45d]/40 shadow-xl group-hover:shadow-[#c8a45d]/5">
                            {isImage ? (
                              <div className="aspect-[4/3] relative overflow-hidden bg-black/40">
                                <img 
                                  src={signedUrls[path]} 
                                  alt={fileName} 
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                  <a 
                                    href={signedUrls[path]} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#c8a45d] hover:text-white transition-colors"
                                  >
                                    <ExternalLink size={14} /> Full View
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div className="aspect-[4/3] flex flex-col items-center justify-center bg-white/[0.02] gap-4">
                                <div className="p-5 bg-white/5 rounded-3xl text-white/20 group-hover:text-[#c8a45d] transition-colors">
                                  <FileText size={48} strokeWidth={1} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{ext} Document</span>
                                <a 
                                  href={signedUrls[path]} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="mt-2 bg-white/5 hover:bg-[#c8a45d] hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all border border-white/10"
                                >
                                  Download PDF
                                </a>
                              </div>
                            )}
                            
                            <div className="p-5 border-t border-white/5 flex items-center justify-between">
                              <span className="text-xs font-bold text-white truncate max-w-[150px] capitalize">{fileName}</span>
                              <div className="flex gap-2">
                                <span className="text-[10px] font-black text-white/20 uppercase px-2 py-1 bg-white/5 rounded-md">{ext}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </div>
            
            <div className="p-8 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row gap-4">
               <button 
                 onClick={() => setSelectedReq(null)}
                 className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all border border-white/5"
               >
                 Dismiss View
               </button>
               {selectedReq.status !== 'Completed' && (
                 <button 
                   onClick={() => {
                     handleStatusUpdate(selectedReq.id, 'Completed');
                     setSelectedReq(null);
                   }}
                   className="flex-[2] py-4 bg-[#c8a45d] hover:bg-[#b08d4a] text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all shadow-[0_10px_30px_rgba(200,164,93,0.3)] hover:shadow-[0_15px_40px_rgba(200,164,93,0.4)] transform hover:-translate-y-0.5"
                 >
                   Authorize & Mark Completed ✓
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
