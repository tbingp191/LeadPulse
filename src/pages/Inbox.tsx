import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Send, 
  Archive, 
  Trash2, 
  Star, 
  Mail, 
  MessageCircle,
  Clock,
  MoreVertical,
  X,
  Paperclip,
  Smile,
  ChevronRight,
  Zap,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  type: "email" | "whatsapp" | "system";
  unread: boolean;
  starred: boolean;
}

export default function Inbox() {
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch these from a 'messages' collection
    // For now, we'll keep it empty or try to list some lead activities as notification placeholders
    // But per user request to "remove dummy data", we'll just clear the hardcoded array.
  }, []);

  const currentMsg = messages.find(m => m.id === selectedMsg);

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Sidebar */}
      <aside className="w-80 border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-6">
          <button 
            onClick={() => setShowCompose(true)}
            className="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98]"
          >
            <Plus size={20} />
            Compose
          </button>

          <div className="mt-8 relative">
            <Search className="absolute left-4 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-1">
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelectedMsg(msg.id)}
              className={cn(
                "w-full p-4 rounded-2xl text-left transition-all border border-transparent",
                selectedMsg === msg.id 
                  ? "bg-indigo-50 border-indigo-100" 
                  : "hover:bg-slate-50"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    msg.unread ? "bg-indigo-600" : "bg-transparent"
                  )} />
                  <span className="text-xs font-bold text-slate-900">{msg.sender}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{msg.time}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-700 truncate">{msg.subject}</h4>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{msg.preview}</p>
              <div className="flex items-center gap-2 mt-2">
                {msg.type === "email" && <Mail size={12} className="text-blue-500" />}
                {msg.type === "whatsapp" && <MessageCircle size={12} className="text-green-500" />}
                {msg.type === "system" && <Zap size={12} className="text-amber-500" />}
                <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest">{msg.type}</span>
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <section className="flex-1 flex flex-col bg-slate-50/30">
        <AnimatePresence mode="wait">
          {selectedMsg ? (
            <motion.div 
              key={selectedMsg}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-700 font-bold">
                    {currentMsg?.sender.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{currentMsg?.sender}</h3>
                    <p className="text-xs text-slate-500">{currentMsg?.type === 'email' ? 'rahul@example.com' : '+91 9226920200'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                    <Star size={20} fill={currentMsg?.starred ? "currentColor" : "none"} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={20} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="max-w-3xl">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">{currentMsg?.subject}</h2>
                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm leading-relaxed text-slate-700 text-sm">
                    {currentMsg?.preview}
                    <div className="mt-6 pt-6 border-t border-slate-50 text-[11px] text-slate-400">
                      Sent from {currentMsg?.type.toUpperCase()} on {currentMsg?.time}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                   <div className="bg-indigo-600 text-white p-4 rounded-3xl rounded-tr-none max-w-md shadow-lg">
                      <p className="text-sm">We're glad you're interested! One of our experts will call you in 5 minutes.</p>
                   </div>
                </div>
              </div>

              <div className="p-6 bg-white border-t border-slate-100">
                <div className="bg-slate-50 rounded-2xl p-2 flex items-end gap-2 border border-slate-100 focus-within:border-indigo-500 transition-all">
                  <textarea 
                    placeholder="Type your reply..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-3 resize-none min-h-[50px] max-h-[150px]"
                  />
                  <div className="flex items-center gap-1 p-1">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg">
                      <Paperclip size={20} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg">
                      <Smile size={20} />
                    </button>
                    <button className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95">
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
               <Mail size={80} strokeWidth={1} />
               <p className="mt-4 font-bold text-slate-400">Select a conversation to start messaging</p>
               <p className="text-xs mt-1">Check your inbox for incoming emails and WhatsApp replies.</p>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl shadow-3xl overflow-hidden overflow-y-auto max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">New Message</h3>
                <button onClick={() => setShowCompose(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">To</label>
                    <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-0 outline-none" placeholder="recipient@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Channel</label>
                    <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none">
                      <option>Email</option>
                      <option>WhatsApp Official</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Subject</label>
                  <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-0 outline-none" placeholder="Enter subject..." />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Message बॉडी</label>
                  <textarea className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-0 outline-none resize-none" placeholder="Write your message here..." />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex gap-2">
                    <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                      <Paperclip size={20} />
                    </button>
                    <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                      <Sparkles size={20} />
                    </button>
                  </div>
                  <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 shadow-xl">
                    <Send size={18} />
                    Send Message
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
