import React from "react";
import { useLeads } from "../hooks/useLeads";
import { LeadStatus } from "../types";
import { cn } from "../lib/utils";
import { MoreHorizontal, Plus, MessageCircle, Phone, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LeadDetail } from "../components/LeadDetail";

const STAGES: { id: LeadStatus; label: string; color: string }[] = [
  { id: "new", label: "New Leads", color: "bg-blue-500" },
  { id: "contacted", label: "Contacted", color: "bg-amber-500" },
  { id: "qualified", label: "Qualified", color: "bg-purple-500" },
  { id: "proposal", label: "Proposal", color: "bg-indigo-500" },
  { id: "negotiation", label: "Negotiation", color: "bg-orange-500" },
  { id: "won", label: "Closed Won", color: "bg-green-500" },
];

export default function Pipeline() {
  const { leads, updateLead } = useLeads();
  const [selectedLead, setSelectedLead] = React.useState<any>(null);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sales Pipeline</h2>
          <p className="text-slate-500 mt-1">Manage and track your lead progression through the funnel.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all shadow-sm">
          <Plus size={18} />
          Add Stage
        </button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-6 h-full min-w-max pb-2">
          {STAGES.map((stage) => (
            <div key={stage.id} className="w-80 flex flex-col h-full bg-slate-100/50 rounded-2xl border border-slate-200/50 p-2">
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", stage.color)} />
                  <h3 className="font-bold text-slate-800 text-sm">{stage.label}</h3>
                  <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                    {leads.filter(l => l.status === stage.id).length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-700">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 p-2">
                {leads
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
                            AU
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextStatusMap: Record<LeadStatus, LeadStatus> = {
                                'new': 'contacted',
                                'contacted': 'qualified',
                                'qualified': 'proposal',
                                'proposal': 'negotiation',
                                'negotiation': 'won',
                                'won': 'won',
                                'lost': 'lost'
                              };
                              updateLead(lead.id, { status: nextStatusMap[lead.status] });
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
                  onClick={() => {/* Open Add Lead Modal */}}
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
