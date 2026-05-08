import React, { useState, useEffect } from "react";
import { 
  X, 
  Sparkles, 
  MessageCircle, 
  Mail, 
  Send, 
  Copy, 
  Check, 
  Loader2,
  RefreshCw,
  AlertCircle,
  Image as ImageIcon,
  ChevronRight,
  Video
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateMessage, generateMarketingImage, generateEmailSubject, generateReelVideo } from "../services/geminiService";
import { Lead } from "../types";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface AIGeneratorModalProps {
  lead: Lead;
  onClose: () => void;
  initialType?: 'email' | 'whatsapp' | 'graphics' | 'reel';
  initialContext?: string;
}

export function AIGeneratorModal({ lead, onClose, initialType = 'whatsapp', initialContext }: AIGeneratorModalProps) {
  const [type, setType] = useState<'email' | 'whatsapp' | 'graphics' | 'reel'>(initialType as any);
  const [context, setContext] = useState(initialContext || "");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [generatedVideo, setGeneratedVideo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGeneratingSubject, setIsGeneratingSubject] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (type === 'graphics' && !context) {
      setContext(`Professional marketing illustration for ${lead.name} in the ${lead.industry} industry, highlighting: ${lead.products}`);
    } else if (type === 'reel' && !context) {
      setContext(`Engaging TikTok/Instagram Reel showcasing ${lead.products} for a ${lead.industry} client like ${lead.name}`);
    }
  }, [type, lead, context]);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      if (type === 'graphics') {
        const url = await generateMarketingImage(context || `Innovative solutions for ${lead.industry}`);
        setGeneratedImage(url);
      } else if (type === 'reel') {
        const url = await generateReelVideo(context || `Creative reel for ${lead.industry}`);
        setGeneratedVideo(url);
      } else {
        const msg = await generateMessage(lead, type as any, context);
        setGeneratedMessage(msg);
      }
    } catch (err) {
      setError("AI generation paused. Please check your configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSubject = async () => {
    if (!generatedMessage) return;
    setIsGeneratingSubject(true);
    try {
      const subject = await generateEmailSubject(lead, generatedMessage);
      setEmailSubject(subject);
    } catch (err) {
      setError("Failed to generate subject.");
    } finally {
      setIsGeneratingSubject(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    setSending(true);
    try {
      const content = type === 'graphics' ? "Sent Marketing Graphic" : type === 'reel' ? "Sent Marketing Reel" : `Sent ${type}: ${generatedMessage.substring(0, 50)}...`;
      
      await addDoc(collection(db, `leads/${lead.id}/activities`), {
        leadId: lead.id,
        type: (type === 'graphics' || type === 'reel') ? 'marketing' : type,
        content: content,
        timestamp: serverTimestamp(),
        performedBy: 'AI Sales Agent'
      });
      
      if (type === 'whatsapp') {
        window.open(`https://wa.me/${lead.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(generatedMessage)}`);
      } else if (type === 'email') {
        const subject = emailSubject || "Personalized Offer";
        window.location.href = `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(generatedMessage)}`;
      } else if (type === 'graphics') {
        window.open(`https://wa.me/${lead.phone?.replace(/\D/g, '')}?text=${encodeURIComponent("Check out this personalized offer: " + generatedImage)}`);
      } else if (type === 'reel') {
        window.open(`https://wa.me/${lead.phone?.replace(/\D/g, '')}?text=${encodeURIComponent("Check out this personalized reel: " + generatedVideo)}`);
      }
      
      onClose();
    } catch (err) {
      setError("Failed to dispatch. Stale session detected.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="flex h-[550px]">
          {/* Controls */}
          <div className="w-64 bg-slate-50 border-r border-slate-100 p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <h3 className="font-bold text-slate-900">AI Composer</h3>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Goal</label>
                <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                  <button 
                    onClick={() => { setType('whatsapp'); setGeneratedMessage(""); setGeneratedImage(""); setEmailSubject(""); }}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg transition-all ${type === 'whatsapp' ? 'bg-green-50 text-green-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <MessageCircle size={18} />
                    <span className="text-[9px] font-bold">WA</span>
                  </button>
                  <button 
                    onClick={() => { setType('email'); setGeneratedMessage(""); setGeneratedImage(""); setEmailSubject(""); }}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg transition-all ${type === 'email' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Mail size={18} />
                    <span className="text-[9px] font-bold">Mail</span>
                  </button>
                  <button 
                    onClick={() => { setType('graphics'); setGeneratedMessage(""); setGeneratedImage(""); setGeneratedVideo(""); setEmailSubject(""); }}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg transition-all ${type === 'graphics' ? 'bg-amber-50 text-amber-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <ImageIcon size={18} />
                    <span className="text-[9px] font-bold">Image</span>
                  </button>
                  <button 
                    onClick={() => { setType('reel'); setGeneratedMessage(""); setGeneratedImage(""); setGeneratedVideo(""); setEmailSubject(""); }}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg transition-all ${type === 'reel' ? 'bg-purple-50 text-purple-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Video size={18} />
                    <span className="text-[9px] font-bold">Reel</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Creative Context</label>
                <textarea 
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-indigo-500/10 outline-none resize-none h-24"
                  placeholder={type === 'graphics' ? 'Describe the graphic theme...' : 'e.g. Asking for a demo...'}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-lg"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <RefreshCw size={18} />
                  {type === 'graphics' ? 'Generate Art' : 'Compose'}
                </>
              )}
            </button>
          </div>

          {/* Generator Area */}
          <div className="flex-1 flex flex-col p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Recipient</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-black text-slate-900">{lead.name}</p>
                  <ChevronRight size={14} className="text-slate-300" />
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded-md text-slate-500 uppercase tracking-tighter">{type}</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Email Subject Section */}
            {type === 'email' && generatedMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 space-y-2"
              >
                <div className="flex items-center justify-between pl-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Subject Line</label>
                  <button 
                    onClick={handleGenerateSubject}
                    disabled={isGeneratingSubject}
                    className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:underline disabled:opacity-50"
                  >
                    {isGeneratingSubject ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                    {emailSubject ? 'Regenerate Subject' : 'AI Generate Subject'}
                  </button>
                </div>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
                  placeholder="Subject of the email..."
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </motion.div>
            )}

            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-3xl p-6 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!generatedMessage && !generatedImage && !loading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center opacity-40 px-10"
                  >
                    <Sparkles size={48} className="text-indigo-600 mb-4" />
                    <p className="text-sm font-bold text-slate-900">AI Creative Engine</p>
                    <p className="text-xs mt-1">Compose personalized text or generate visual marketing assets in seconds.</p>
                  </motion.div>
                ) : loading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center"
                  >
                    <Loader2 className="animate-spin text-indigo-600 mb-4" size={32} />
                    <p className="text-sm font-bold text-slate-600 animate-pulse">Gemini is being creative...</p>
                  </motion.div>
                ) : error ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center text-red-500"
                  >
                    <AlertCircle size={32} className="mb-4" />
                    <p className="text-sm font-bold">{error}</p>
                  </motion.div>
                ) : type === 'graphics' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full w-full rounded-2xl overflow-hidden shadow-inner bg-slate-200 flex items-center justify-center border-4 border-white"
                  >
                    <img 
                      src={generatedImage} 
                      className="w-full h-full object-cover" 
                      alt="Generated Art" 
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                ) : type === 'reel' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full w-full rounded-2xl overflow-hidden shadow-inner bg-slate-900 flex items-center justify-center border-4 border-white"
                  >
                    <video 
                      src={generatedVideo} 
                      className="w-full h-full object-contain" 
                      controls
                      autoPlay
                      loop
                    />
                  </motion.div>
                ) : (
                  <motion.textarea 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full h-full bg-transparent border-none outline-none resize-none text-sm font-medium leading-relaxed font-sans"
                    value={generatedMessage}
                    onChange={(e) => setGeneratedMessage(e.target.value)}
                  />
                )}
              </AnimatePresence>

              {generatedMessage && !loading && (
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={handleCopy}
                    className="p-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all"
                  >
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-4">
              <button 
                onClick={handleSend}
                disabled={(!generatedMessage && !generatedImage) || loading || sending}
                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50 active:scale-[0.98]"
              >
                {sending ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                {type === 'whatsapp' ? 'Send WhatsApp' : type === 'email' ? 'Send Email' : 'Dispatch Graphic'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
