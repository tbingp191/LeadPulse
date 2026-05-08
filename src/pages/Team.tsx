import { 
  Users, 
  Mail, 
  MoreVertical, 
  MessageSquare, 
  Phone,
  BarChart2,
  Calendar,
  CheckCircle,
  Plus,
  Clock
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "motion/react";
import { useLeads } from "../hooks/useLeads";

export default function Team() {
  const { leads } = useLeads();

  const members = [
    { 
      id: "1", 
      name: "Admin User", 
      email: "admin@leadpulse.com", 
      role: "Sales Manager", 
      status: "active",
      leads: leads.length,
      won: leads.filter(l => l.status === 'won').length,
      avatar: "AU",
      color: "bg-indigo-100 text-indigo-700"
    },
    { 
      id: "2", 
      name: "Shweta Verma", 
      email: "shweta@leadpulse.com", 
      role: "Senior Exec", 
      status: "active",
      leads: 12,
      won: 8,
      avatar: "SV",
      color: "bg-green-100 text-green-700"
    },
    { 
      id: "3", 
      name: "Rohan Das", 
      email: "rohan@leadpulse.com", 
      role: "Sales Rep", 
      status: "away",
      leads: 5,
      won: 2,
      avatar: "RD",
      color: "bg-amber-100 text-amber-700"
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sales Team</h2>
          <p className="text-slate-500 mt-1">Manage team members and monitor individual performance.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all shadow-sm">
          <Plus size={18} />
          Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={member.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl border-2 border-white shadow-sm", member.color)}>
                  {member.avatar}
                </div>
                <div className="flex flex-col items-end">
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm",
                    member.status === 'active' ? "bg-green-500" : "bg-amber-500"
                  )} />
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{member.status}</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
              <p className="text-sm font-medium text-slate-500 mb-6">{member.role}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Managed</p>
                  <p className="text-lg font-bold text-slate-800">{member.leads}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Closed Won</p>
                  <p className="text-lg font-bold text-green-600">{member.won}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  <Mail size={16} />
                  Email
                </button>
                <button className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all">
                  <BarChart2 size={18} />
                </button>
                <button className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Clock size={14} />
                Last active 2h ago
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => (
                  <div key={s} className={cn("w-1 h-3 rounded-full", s <= 4 ? "bg-indigo-300" : "bg-slate-200")} />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
