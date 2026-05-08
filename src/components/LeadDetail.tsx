import React, { useState, useEffect } from "react";
import { 
  X, 
  MessageCircle, 
  Phone, 
  Mail, 
  Calendar, 
  UserPlus, 
  FileText,
  Clock,
  Send,
  MoreVertical
} from "lucide-react";
import { Lead, Activity } from "../types";
import { db } from "../lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { cn, formatDate } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface LeadDetailProps {
  lead: Lead;
  onClose: () => void;
}

export function LeadDetail({ lead, onClose }: LeadDetailProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, `leads/${lead.id}/activities`), 
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity)));
    });
    return () => unsubscribe();
  }, [lead.id]);

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    await addDoc(collection(db, `leads/${lead.id}/activities`), {
      leadId: lead.id,
      type: 'note',
      content: note,
      timestamp: serverTimestamp(),
      performedBy: 'Admin User'
    });
    setNote("");
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'whatsapp': return <MessageCircle size={14} className="text-green-500" />;
      case 'note': return <FileText size={14} className="text-blue-500" />;
      case 'system': return <Clock size={14} className="text-slate-400" />;
      default: return <Clock size={14} className="text-slate-400" />;
    }
  };

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
            {lead.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>{lead.source}</span>
              <span>•</span>
              <span className="text-indigo-600">{lead.status}</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 p-6 border-b border-slate-100">
          <button className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-200 hover:bg-green-50 hover:border-green-200 transition-all group">
            <MessageCircle className="text-slate-400 group-hover:text-green-600" size={20} />
            <span className="text-xs font-bold text-slate-600 group-hover:text-green-700">WhatsApp</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-all group">
            <Phone className="text-slate-400 group-hover:text-blue-600" size={20} />
            <span className="text-xs font-bold text-slate-600 group-hover:text-blue-700">Call</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 transition-all group">
            <UserPlus className="text-slate-400 group-hover:text-indigo-600" size={20} />
            <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-700">Assign</span>
          </button>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-slate-400" />
                <span className="text-sm text-slate-600 font-medium">{lead.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-slate-400" />
                <span className="text-sm text-slate-600 font-medium">{lead.phone || 'No phone provided'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-slate-400" />
                <span className="text-sm text-slate-600 font-medium">Captured {lead.createdAt?.toDate ? formatDate(lead.createdAt.toDate()) : 'Pending'}</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Activity Log</h3>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">{activities.length} Events</span>
            </div>
            
            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
              {activities.map((activity) => (
                <div key={activity.id} className="relative pl-8">
                  <div className="absolute left-0 top-0.5 w-[23px] h-[23px] rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm z-10">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                    <p className="text-sm text-slate-800 leading-snug">{activity.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold text-slate-400">
                        {activity.timestamp?.toDate ? formatDate(activity.timestamp.toDate()) : 'Recent'}
                      </span>
                      {activity.performedBy && (
                        <>
                          <span className="text-[10px] text-slate-300">•</span>
                          <span className="text-[10px] font-bold text-indigo-500 uppercase">{activity.performedBy}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Note Input */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <form onSubmit={addNote} className="flex gap-2">
          <input 
            type="text" 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note or internal comment..."
            className="flex-1 bg-slate-50 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 px-4 py-3 outline-none"
          />
          <button type="submit" className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 disabled:opacity-50" disabled={!note.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
