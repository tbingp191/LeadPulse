import React, { useState, useEffect } from "react";
import { useLeads } from "../hooks/useLeads";
import { LeadStatus } from "../types";
import { cn } from "../lib/utils";
import { MoreHorizontal, Plus, MessageCircle, Phone, Clock, Search, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LeadDetail } from "../components/LeadDetail";
import { AddLeadModal } from "../components/AddLeadModal";
import { db } from "../lib/firebase";
import { collection, onSnapshot, addDoc, query, orderBy, serverTimestamp } from "firebase/firestore";

interface Stage {
  id: string;
  label: string;
  color: string;
  order: number;
}

const DEFAULT_STAGES: Stage[] = [
  { id: "new", label: "New Leads", color: "bg-blue-500", order: 0 },
  { id: "contacted", label: "Contacted", color: "bg-amber-500", order: 1 },
  { id: "qualified", label: "Qualified", color: "bg-purple-500", order: 2 },
  { id: "proposal", label: "Proposal", color: "bg-indigo-500", order: 3 },
  { id: "won", label: "Closed Won", color: "bg-green-500", order: 4 },
];

export default function Pipeline() {
  const { leads, updateLead } = useLeads();
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddLead, setShowAddLead] = useState(false);
  const [stages, setStages] = useState<Stage[]>(DEFAULT_STAGES);
  const [showAddStageModal, setShowAddStageModal] = useState(false);
  const [newStageName, setNewStageName] = useState("");

  useEffect(() => {
    const q = query(collection(db, "pipeline_stages"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setStages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Stage)));
      }
    });
    return () => unsubscribe();
  }, []);

  const addStage = async () => {
    if (!newStageName.trim()) return;
    try {
      await addDoc(collection(db, "pipeline_stages"), {
        label: newStageName,
        color: "bg-slate-500",
        order: stages.length,
        createdAt: serverTimestamp()
      });
      setNewStageName("");
      setShowAddStageModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sales Pipeline</h2>
          <p className="text-slate-500 mt-1">Manage and track your lead progression through the funnel.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search in pipeline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
            />
          </div>
          <button 
            onClick={() => setShowAddStageModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all shadow-sm shrink-0"
          >
            <Plus size={18} />
            Add Stage
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-6 h-full min-w-max pb-2">
          {stages.map((stage) => (
            <div key={stage.id} className="w-80 flex flex-col h-full bg-slate-100/50 rounded-2xl border border-slate-200/50 p-2">
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", stage.color)} />
                  <h3 className="font-bold text-slate-800 text-sm">{stage.label}</h3>
                  <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                    {filteredLeads.filter(l => l.status === stage.id).length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-700">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 p-2">
                {filteredLeads
                  .filter((l) => l.status === stage.id)
                  .map((lead) => (
                    <motion.div
                      layoutId={lead.id}
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{lead.source}</span>
                        {lead.lastMessageSent && (
                          <div className="text-green-500 bg-green-50 p-1 rounded" title="Auto-WhatsApp Sent">
                            <MessageCircle size={12} />
                          </div>
                        )}
                      </div>
                      <p className="font-bold text-slate-900 text-sm mb-1">{lead.name}</p>
                      <p className="text-xs text-slate-500 truncate mb-3">{lead.email || lead.phone}</p>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-700">
                            {lead.name.charAt(0)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentIndex = stages.findIndex(s => s.id === stage.id);
                              const nextStage = stages[currentIndex + 1];
                              if (nextStage) {
                                updateLead(lead.id, { status: nextStage.id as any });
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <TrendingUp size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                
                <button 
                  onClick={() => setShowAddLead(true)}
                  className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-medium hover:border-indigo-300 hover:text-indigo-500 transition-all flex items-center justify-center gap-2 group"
                >
                  <Plus size={16} className="group-hover:scale-110 transition-transform" />
                  Add Lead
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedLead && (
          <LeadDetail lead={selectedLead} onClose={() => setSelectedLead(null)} />
        )}
        {showAddLead && (
          <AddLeadModal onClose={() => setShowAddLead(false)} />
        )}
        {showAddStageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-8"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6">Create New Stage</h3>
              <input 
                autoFocus
                type="text"
                placeholder="e.g. Technical Review"
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm mb-6 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowAddStageModal(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
                <button onClick={addStage} className="flex-1 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Create Stage</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TrendingUp(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="1em" 
      height="1em" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
