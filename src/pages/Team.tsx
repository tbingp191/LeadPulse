import React, { useState, useEffect } from "react";
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
  Clock,
  X,
  Send,
  Shield
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useLeads } from "../hooks/useLeads";

import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Team() {
  const { leads } = useLeads();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "Real User",
          email: data.email || "user@leadpulse.com",
          role: data.role || "Sales Rep",
          status: data.status || "active",
          leads: 0, // In a real app we'd aggregate lead count per user
          won: 0,
          avatar: (data.name || "U").substring(0, 2).toUpperCase(),
          color: "bg-indigo-100 text-indigo-700",
          lastActive: "Active Now"
        };
      });
      setMembers(usersList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Invitation sent to ${inviteEmail}! They will receive a link to join your team.`);
    setInviteEmail("");
    setShowInvite(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sales Team</h2>
          <p className="text-slate-500 mt-1">Manage team members and monitor individual performance.</p>
        </div>
        <button 
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95"
        >
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

      <AnimatePresence>
        {showInvite && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Invite Teammate</h3>
                      <p className="text-xs text-slate-500">Add a new sales representative</p>
                    </div>
                  </div>
                  <button onClick={() => setShowInvite(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleInvite} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                    <input 
                      required
                      type="email"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/10 outline-none"
                      placeholder="teammate@company.com"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                    />
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
                    <Shield className="text-indigo-600 shrink-0 mt-0.5" size={16} />
                    <p className="text-[11px] text-indigo-700 leading-relaxed">
                      Invitees will receive an email to set up their account with <span className="font-bold">Sales Rep</span> permissions by default.
                    </p>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98]"
                  >
                    <Send size={18} />
                    Send Invitation
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
