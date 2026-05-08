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
  MoreVertical,
  Sparkles,
  Brain,
  Handshake,
  Loader2,
  TrendingUp,
  AlertCircle,
  Image as ImageIcon,
  Video
} from "lucide-react";
import { Lead, Activity } from "../types";
import { db, auth } from "../lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { cn, formatDate } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { getLeadInsights, LeadInsight } from "../services/geminiService";
import { AIGeneratorModal } from "./AIGeneratorModal";

interface LeadDetailProps {
  lead: Lead;
  onClose: () => void;
}

export function LeadDetail({ lead, onClose }: LeadDetailProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [note, setNote] = useState("");
  const [aiInsight, setAiInsight] = useState<LeadInsight | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  
  // AI Modal States
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiModalType, setAiModalType] = useState<'email' | 'whatsapp' | 'graphics' | 'reel'>('whatsapp');
  const [aiModalContext, setAiModalContext] = useState("");

  const handleAction = async (type: 'whatsapp' | 'call' | 'assign' | 'graphics' | 'reel') => {
    if (type === 'whatsapp') {
      setAiModalType('whatsapp');
      setAiModalContext("Initial follow-up based on lead score");
      setShowAiModal(true);
    } else if (type === 'graphics') {
      setAiModalType('graphics');
      setAiModalContext("");
      setShowAiModal(true);
    } else if (type === 'reel') {
      setAiModalType('reel');
      setAiModalContext("");
      setShowAiModal(true);
    } else if (type === 'call') {
      await addDoc(collection(db, `leads/${lead.id}/activities`), {
        leadId: lead.id,
        type: 'phone',
        content: `Attempted voice call to ${lead.phone}`,
        timestamp: serverTimestamp(),
        performedBy: auth.currentUser?.email?.split('@')[0] || 'Sales Agent'
      });
      window.location.href = `tel:${lead.phone}`;
    } else if (type === 'assign') {
      setIsAssigning(true);
      try {
        const agentName = auth.currentUser?.email?.split('@')[0] || 'LeadPulse AI';
        await updateDoc(doc(db, "leads", lead.id), {
          assignedTo: agentName,
          updatedAt: serverTimestamp()
        });
        await addDoc(collection(db, `leads/${lead.id}/activities`), {
          leadId: lead.id,
          type: 'system',
          content: `Lead assigned to ${agentName}`,
          timestamp: serverTimestamp(),
          performedBy: 'System'
        });
      } finally {
        setIsAssigning(false);
      }
    }
  };

  const handleStrategyUsage = () => {
    if (aiInsight) {
      setAiModalType('whatsapp');
      setAiModalContext(`Follow up strategy: ${aiInsight.followUpSuggestion}`);
      setShowAiModal(true);
    }
  };

  useEffect(() => {
    // Reset AI insights when switching leads
    setAiInsight(null);
    setAiError("");
  }, [lead.id]);

  const generateAiInsights = async () => {
    setAiLoading(true);
    setAiError("");
    try {
      const insight = await getLeadInsights({
        ...lead,
        history: activities
      });
      setAiInsight(insight);
    } catch (err) {
      setAiError("Failed to generate AI insights. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

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
        <div className="p-6 border-b border-slate-100 bg-slate-50/30">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Direct Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button 
              onClick={() => handleAction('whatsapp')}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/10 transition-all group active:scale-95 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                <MessageCircle size={18} />
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase">WhatsApp</span>
            </button>
            <button 
              onClick={() => handleAction('call')}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all group active:scale-95 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Phone size={18} />
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase">Voice Call</span>
            </button>
            <button 
              onClick={() => handleAction('graphics')}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/10 transition-all group active:scale-95 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <ImageIcon size={18} />
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase">Graphics</span>
            </button>
            <button 
              onClick={() => handleAction('reel')}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 transition-all group active:scale-95 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Video size={18} />
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase">Reel</span>
            </button>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-6">
          {/* AI Advisor section */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-2xl p-5 text-white shadow-lg shadow-indigo-100 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 transform translate-x-1/3 -translate-y-1/3 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Brain size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-amber-400" />
                  <h3 className="font-bold text-lg tracking-tight">Lead Advisor AI</h3>
                </div>
                {!aiInsight && !aiLoading && (
                  <button 
                    onClick={generateAiInsights}
                    className="text-[10px] uppercase font-bold tracking-widest bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all"
                  >
                    Analyze Lead
                  </button>
                )}
              </div>

              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-6 gap-3">
                  <Loader2 className="animate-spin text-white/70" size={32} />
                  <p className="text-sm font-medium text-white/70 italic">Processing lead intelligence...</p>
                </div>
              ) : aiInsight ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1">Conversion Potential</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${aiInsight.hotnessScore}%` }}
                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                          />
                        </div>
                        <span className="text-lg font-black text-amber-400">{aiInsight.hotnessScore}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1">AI Summary</p>
                    <p className="text-sm leading-relaxed text-indigo-50 font-medium">
                      {aiInsight.summary}
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle size={14} className="text-amber-400" />
                      <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Recommended Approach</p>
                    </div>
                    <p className="text-xs italic leading-relaxed text-white font-medium">
                      "{aiInsight.followUpSuggestion}"
                    </p>
                    <button 
                      onClick={handleStrategyUsage}
                      className="w-full mt-3 py-2 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Handshake size={14} />
                      Use this Strategy
                    </button>
                  </div>
                </div>
              ) : aiError ? (
                <div className="flex items-center gap-3 bg-red-500/20 p-3 rounded-xl border border-red-500/30">
                  <AlertCircle size={18} className="text-red-200" />
                  <p className="text-xs font-medium text-red-100">{aiError}</p>
                  <button onClick={generateAiInsights} className="text-[10px] font-bold uppercase ml-auto underline">Retry</button>
                </div>
              ) : (
                <p className="text-sm text-indigo-100/80 leading-relaxed font-medium">
                  Use our AI model to analyze {lead.name}'s data, history, and status to get closure probability and personalized follow-up suggestions.
                </p>
              )}
            </div>
          </div>

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

      <AnimatePresence>
        {showAiModal && (
          <AIGeneratorModal 
            lead={lead}
            initialType={aiModalType}
            initialContext={aiModalContext}
            onClose={() => setShowAiModal(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
