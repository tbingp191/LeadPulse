import React from "react";
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
  Globe
} from "lucide-react";
import { Layout } from "../components/Layout";
import { useLeads } from "../hooks/useLeads";
import { formatDate, cn } from "../lib/utils";
import { LeadStatus } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { LeadDetail } from "../components/LeadDetail";

export default function Dashboard() {
  const { leads, loading, addLead } = useLeads();
  const [selectedLead, setSelectedLead] = React.useState<any>(null);

  const stats = [
    { label: "Total Leads", value: leads.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Conversion Rate", value: "24.5%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "Avg. Response Time", value: "3.2m", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Won Deals", value: leads.filter(l => l.status === 'won').length, icon: CheckCircle2, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  const seedData = async () => {
    const dummyLeads: { name: string; source: string; status: LeadStatus; email: string; phone: string }[] = [
      { name: "John Smith", source: "LinkedIn", status: "new", email: "john@techcorp.com", phone: "+1 202-555-0143" },
      { name: "Maria Garcia", source: "Facebook", status: "contacted", email: "maria@agency.io", phone: "+1 202-555-0176" },
      { name: "Satoshi Nakamoto", source: "Web Form", status: "qualified", email: "bitcoin@genesis.com", phone: "+1 202-555-0199" },
      { name: "Elena Gilbert", source: "Direct", status: "proposal", email: "elena@vamp.org", phone: "+1 202-555-0182" },
      { name: "Bruce Wayne", source: "LinkedIn", status: "won", email: "bruce@wayne.tech", phone: "+1 202-555-0111" },
      { name: "Diana Prince", source: "Facebook", status: "won", email: "diana@themyscira.com", phone: "+1 202-555-0155" },
      { name: "Tony Stark", source: "Web Form", status: "lost", email: "tony@stark.com", phone: "+1 202-555-0122" },
      { name: "Peter Parker", source: "LinkedIn", status: "new", email: "peter@dailybugle.com", phone: "+1 202-555-0133" },
    ];

    for (const data of dummyLeads) {
      await addLead(data);
    }
  };

  const simulateLeadImport = () => {
    const names = ["Alex Rivera", "Jamie Chen", "Sarah Miller", "Michael Ross"];
    const sources = ["LinkedIn", "Facebook", "Web Form"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    
    addLead({
      name: randomName,
      email: `${randomName.toLowerCase().replace(" ", ".")}@example.com`,
      phone: "+1 (555) " + Math.floor(Math.random() * 900 + 100) + "-" + Math.floor(Math.random() * 9000 + 1000),
      source: randomSource,
    });
  };

  const getSourceIcon = (source: string) => {
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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
          <p className="text-slate-500 mt-1">Welcome back, manager. Here's what's happening with your leads today.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={seedData}
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-900 transition-all shadow-sm active:scale-95"
          >
            <Users size={18} />
            Seed Demo Data
          </button>
          <button 
            onClick={simulateLeadImport}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 active:scale-95"
          >
            <ExternalLink size={18} />
            Simulate Import
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">+12.5%</span>
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Leads Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recent Lead Ingress</h3>
          <button className="text-indigo-600 font-semibold text-sm hover:underline">View all Pipeline</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Info</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">Connecting to CRM database...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">No leads captured yet. Use "Simulate Import" to start.</td>
                </tr>
              ) : leads.slice(0, 10).map((lead) => (
                <tr 
                  key={lead.id} 
                  onClick={() => setSelectedLead(lead)}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{lead.name}</p>
                        <p className="text-xs text-slate-500">{lead.email || lead.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 px-2 py-1 bg-slate-100 rounded-lg w-fit">
                      {getSourceIcon(lead.source)}
                      <span className="text-xs font-medium text-slate-600">{lead.source}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border",
                      getStatusStyle(lead.status)
                    )}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                    {lead.createdAt?.toDate ? formatDate(lead.createdAt.toDate()) : 'Pending...'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Send WhatsApp">
                        <MessageCircle size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Call Lead">
                        <Phone size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedLead && (
          <LeadDetail lead={selectedLead} onClose={() => setSelectedLead(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
