import React, { useEffect, useState } from "react";
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Phone,
  MoreVertical,
  Linkedin,
  Facebook,
  Globe,
  Search,
  Zap,
  BarChart3,
  Plus
} from "lucide-react";
import { Layout } from "../components/Layout";
import { useLeads } from "../hooks/useLeads";
import { formatDate, cn } from "../lib/utils";
import { LeadStatus } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { LeadDetail } from "../components/LeadDetail";
import { AddLeadModal } from "../components/AddLeadModal";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export default function Dashboard() {
  const { leads, loading, addLead } = useLeads();
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddLead, setShowAddLead] = useState(false);

  useEffect(() => {
    document.title = "Dashboard | LeadPulse";
  }, []);

  // Process data for charts - Last 7 Days
  const getAnalyticsData = () => {
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      days.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
    }

    const dataMap = days.reduce((acc, day) => {
      acc[day] = { name: day, leads: 0, connects: 0, whatsapp: 0 };
      return acc;
    }, {} as any);

    leads.forEach(lead => {
      const createdDate = lead.createdAt?.toDate ? lead.createdAt.toDate() : null;
      const updatedDate = lead.updatedAt?.toDate ? lead.updatedAt.toDate() : null;
      const waDate = lead.lastMessageSent?.toDate ? lead.lastMessageSent.toDate() : null;

      if (createdDate) {
        const d = createdDate.toLocaleDateString('en-US', { weekday: 'short' });
        if (dataMap[d]) dataMap[d].leads++;
      }
      if (updatedDate && lead.status !== 'new') {
        const d = updatedDate.toLocaleDateString('en-US', { weekday: 'short' });
        if (dataMap[d]) dataMap[d].connects++;
      }
      if (waDate) {
        const d = waDate.toLocaleDateString('en-US', { weekday: 'short' });
        if (dataMap[d]) dataMap[d].whatsapp++;
      }
    });

    return Object.values(dataMap);
  };

  const chartData = getAnalyticsData();
  
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isToday = (date: any) => {
    if (!date?.toDate) return false;
    const d = date.toDate();
    const today = new Date();
    return d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
  };

  const winningLeads = leads.filter(l => l.status === 'won').length;
  const todayConnects = leads.filter(l => l.status !== 'new' && isToday(l.updatedAt)).length;
  const todayWaSends = leads.filter(l => isToday(l.lastMessageSent)).length;
  
  const stats = [
    { label: "Total Leads", value: leads.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Today Connect", value: todayConnects, icon: Phone, color: "text-green-600", bg: "bg-green-50" },
    { label: "WhatsApp Today", value: todayWaSends, icon: MessageCircle, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Won Deals", value: winningLeads, icon: CheckCircle2, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const getSourceIcon = (source: string = "") => {
    switch (source.toLowerCase()) {
      case 'linkedin': return <Linkedin size={14} className="text-blue-700" />;
      case 'facebook': return <Facebook size={14} className="text-blue-600" />;
      default: return <Globe size={14} className="text-slate-500" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'new': return "bg-blue-100 text-blue-700 border-blue-200";
      case 'won': return "bg-green-100 text-green-700 border-green-200";
      case 'lost': return "bg-red-100 text-red-700 border-red-200";
      case 'contacted': return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Lead Insights</h2>
          <p className="text-slate-500 mt-1 font-medium">Real-time performance analytics and pipeline tracking.</p>
        </div>
        <button 
          onClick={() => setShowAddLead(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          <Plus size={18} />
          Create New Lead
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", stat.bg)}>
                <stat.icon className={stat.color} size={22} />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</span>
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1 animate-pulse" />
              </div>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900 mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Analytics Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900">Lead Volume</h3>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">Acquisition over 7 days</p>
            </div>
            <BarChart3 className="text-indigo-600 opacity-20" size={32} />
          </div>
          
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#6366f1" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorLeads)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900">Engagement Pulse</h3>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">WA Messages & Outreach</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="text-[9px] font-black text-slate-400">WA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-black text-slate-400">CONNECT</span>
              </div>
            </div>
          </div>
          
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar dataKey="whatsapp" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={16} />
                <Bar dataKey="connects" fill="#10b981" radius={[6, 6, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-black text-slate-900">Recent Activity</h3>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">Live lead sync enabled</p>
          </div>
          <div className="flex items-center gap-4 flex-1 max-w-xl w-full">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search pipeline..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all font-bold placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Source</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Cloud Syncing...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-sm font-bold text-slate-400 italic">No deals found matching "{searchQuery}"</p>
                  </td>
                </tr>
              ) : filteredLeads.slice(0, 5).map((lead) => (
                <tr 
                  key={lead.id} 
                  onClick={() => setSelectedLead(lead)}
                  className="hover:bg-slate-50/50 transition-all group cursor-pointer"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center text-lg font-black group-hover:scale-110 transition-transform">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-tight">{lead.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 capitalize">{lead.source || 'General'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white border border-slate-100 rounded-xl w-fit shadow-sm">
                      {getSourceIcon(lead.source)}
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{lead.source}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border",
                      getStatusStyle(lead.status)
                    )}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm bg-slate-50 border border-slate-100">
                        <MessageCircle size={18} />
                      </button>
                      <button className="p-3 text-slate-400 hover:text-green-600 hover:bg-white rounded-xl transition-all shadow-sm bg-slate-50 border border-slate-100">
                        <Phone size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-8 bg-slate-50/30 flex justify-between items-center border-t border-slate-50">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Leads Pulse: {leads.length}</p>
             <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View Pipeline Analytics →</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedLead && (
          <LeadDetail lead={selectedLead} onClose={() => setSelectedLead(null)} />
        )}
        {showAddLead && (
          <AddLeadModal onClose={() => setShowAddLead(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
