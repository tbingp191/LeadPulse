import React, { useState } from "react";
import { 
  Zap, 
  MessageCircle, 
  TrendingUp, 
  Image as ImageIcon,
  Video,
  Share2,
  BarChart3,
  Rocket,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Plus,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';

const AD_PERFORMANCE_DATA: any[] = [];
import { generateMessage, generateMarketingImage, generateReelVideo } from "../services/geminiService";

export default function Marketing() {
  const [activeTab, setActiveTab] = useState<'create' | 'ads' | 'bulk'>('create');
  const [generating, setGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<{type: 'image' | 'text' | 'video', content: string} | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [bulkMessage, setBulkMessage] = useState("");
  const [sendingBulk, setSendingBulk] = useState(false);
  const [bulkStep, setBulkStep] = useState<'upload' | 'compose' | 'sending' | 'done'>('upload');
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const phoneIndex = headers.indexOf('phone');
      const nameIndex = headers.indexOf('name');

      if (phoneIndex === -1) {
        alert("CSV must have a 'phone' column.");
        return;
      }

      const rows = lines.slice(1).map(line => {
        const values = line.split(',');
        return {
          phone: values[phoneIndex]?.trim(),
          name: nameIndex !== -1 ? values[nameIndex]?.trim() : "Customer"
        };
      }).filter(row => row.phone);

      setCsvData(rows);
      setBulkStep('compose');
    };
    reader.readAsText(file);
  };

  const startBulkCampaign = async () => {
    if (!bulkMessage) return;
    setSendingBulk(true);
    setBulkStep('sending');
    setProgress({ current: 0, total: csvData.length });

    for (let i = 0; i < csvData.length; i++) {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress({ current: i + 1, total: csvData.length });
    }

    setSendingBulk(false);
    setBulkStep('done');
  };

  const handleGenerateGraphics = async () => {
    setGenerating(true);
    try {
      const url = await generateMarketingImage(prompt);
      setResult({ type: 'image', content: url });
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateReelScript = async () => {
    setGenerating(true);
    try {
      const videoUrl = await generateReelVideo(prompt);
      setResult({ type: 'video', content: videoUrl });
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Marketing Hub</h2>
          <p className="text-slate-500 mt-1 font-medium">Empower your brand with AI-driven visual assets and ad campaigns.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('create')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'create' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Creative Suite
          </button>
          <button 
            onClick={() => setActiveTab('ads')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'ads' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Meta Ads
          </button>
          <button 
            onClick={() => setActiveTab('bulk')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'bulk' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Bulk Nexus
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'create' && (
          <motion.div 
            key="create"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid lg:grid-cols-12 gap-8"
          >
            {/* Input Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">AI Creative Engine</h3>
                    <p className="text-xs text-slate-500 font-medium">Gemini Pro Vision Enabled</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Creative Prompt</label>
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 outline-none resize-none transition-all"
                      placeholder="e.g. Modern minimalist graphic for a luxury watch brand with sunset lighting..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleGenerateGraphics}
                      disabled={generating || !prompt}
                      className="py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                    >
                      {generating ? <Loader2 className="animate-spin" size={18} /> : <ImageIcon size={18} />}
                      Graphics
                    </button>
                    <button 
                      onClick={handleGenerateReelScript}
                      disabled={generating || !prompt}
                      className="py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
                    >
                      {generating ? <Loader2 className="animate-spin" size={18} /> : <Video size={18} />}
                      AI Reel
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
                <h4 className="text-lg font-bold mb-2">Social Integrations</h4>
                <p className="text-white/70 text-xs mb-6 font-medium leading-relaxed">Instantly post your AI-generated assets to Instagram, Facebook, and LinkedIn.</p>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all">
                    <Share2 size={18} />
                  </div>
                  <button className="flex-1 bg-white text-indigo-600 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all">
                    Link Accounts
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 border-dashed p-4 min-h-[500px] flex flex-col">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-4 px-4 pt-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Generated Output</span>
                       <div className="flex gap-2">
                          <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-all">Download</button>
                          <button className="text-xs font-bold text-white bg-slate-900 px-3 py-1.5 rounded-full hover:bg-slate-800 transition-all">Launch Ad</button>
                       </div>
                    </div>
                    
                    {result.type === 'image' ? (
                      <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl bg-slate-100 flex items-center justify-center p-2">
                        <img 
                          src={result.content} 
                          className="w-full h-full object-cover rounded-xl" 
                          alt="AI Generated" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : result.type === 'video' ? (
                      <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl bg-slate-900 flex items-center justify-center p-2">
                        <video 
                          src={result.content} 
                          className="w-full h-full object-contain rounded-xl" 
                          controls
                          autoPlay
                          loop
                        />
                      </div>
                    ) : (
                      <div className="flex-1 bg-slate-50 rounded-2xl p-8 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap">
                        {result.content}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-300 opacity-60 px-12 text-center">
                    <Sparkles size={64} strokeWidth={1} className="mb-4 text-indigo-600/30" />
                    <p className="text-lg font-bold text-slate-900">Your vision starts here</p>
                    <p className="text-sm mt-1 max-w-xs">Enter a prompt on the left to generate graphics or reel scripts using Gemini.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {activeTab === 'ads' && (
          <motion.div 
             key="ads"
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="space-y-8"
          >
             <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Spend', value: '₹12,450', change: '+12%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Total Reach', value: '45,200', change: '+25%', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: 'Conversions', value: '842', change: '+8%', icon: Rocket, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Avg ROAS', value: '4.2x', change: '+15%', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl`}>
                        <stat.icon size={20} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                      <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">{stat.change}</span>
                    </div>
                  </div>
                ))}
             </div>

             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                   <div>
                      <h3 className="text-lg font-bold text-slate-900">Campaign Performance</h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">Growth analysis over the last 7 days</p>
                   </div>
                </div>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={AD_PERFORMANCE_DATA}>
                      <defs>
                        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ fontWeight: 800, color: '#1e293b' }}
                      />
                      <Area type="monotone" dataKey="spend" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                   <h3 className="font-bold text-slate-900">Active Campaigns</h3>
                   <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl">
                      <Plus size={18} />
                      New Campaign
                   </button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full">
                      <thead>
                         <tr className="border-b border-slate-100">
                            <th className="text-left py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign Name</th>
                            <th className="text-right py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="text-right py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Spent</th>
                            <th className="text-right py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">ROAS</th>
                            <th className="text-right py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">CPC</th>
                            <th className="text-right py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {[].map((ad: any, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                               <td className="py-6 px-8">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                                        <ImageIcon size={18} className="text-slate-300" />
                                     </div>
                                     <span className="font-bold text-slate-800 text-sm">{ad.name}</span>
                                  </div>
                               </td>
                               <td className="py-6 px-8 text-right">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${ad.status === 'Active' ? 'bg-green-50 text-green-600' : ad.status === 'Paused' ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'}`}>
                                     {ad.status}
                                  </span>
                               </td>
                               <td className="py-6 px-8 text-right font-bold text-slate-700 text-sm">{ad.spend}</td>
                               <td className="py-6 px-8 text-right font-black text-slate-900 text-sm">{ad.roas}</td>
                               <td className="py-6 px-8 text-right font-bold text-slate-500 text-sm">{ad.cpc}</td>
                               <td className="py-6 px-8 text-right">
                                  <button className="text-slate-400 hover:text-indigo-600">
                                     <ExternalLink size={18} />
                                  </button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'bulk' && (
          <motion.div 
             key="bulk"
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="grid lg:grid-cols-12 gap-8"
          >
             <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                   <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-bold">
                        <MessageCircle size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">Bulk WhatsApp</h3>
                        <p className="text-xs text-slate-500 font-medium">Broadcast Engine</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div 
                         onClick={() => document.getElementById('csv-upload')?.click()}
                         className={`p-8 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center group transition-all cursor-pointer ${csvData.length > 0 ? 'border-green-500 bg-green-50/30' : 'border-slate-200 hover:border-indigo-600'}`}
                      >
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all ${csvData.length > 0 ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                            {csvData.length > 0 ? <CheckCircle2 size={24} /> : <Upload size={24} />}
                         </div>
                         <p className="text-xs font-bold text-slate-900">
                           {csvData.length > 0 ? `${csvData.length} Contacts Ready` : 'Drop your .CSV here'}
                         </p>
                         <p className="text-[10px] text-slate-500 mt-1 uppercase font-black tracking-widest">
                           {csvData.length > 0 ? 'Click to change file' : 'or click to browse'}
                         </p>
                         <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <FileSpreadsheet size={18} className="text-slate-400" />
                         <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Must include 'name' and 'phone' headers</p>
                      </div>

                      {bulkStep === 'sending' && (
                        <div className="space-y-2">
                           <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              <span>Sending...</span>
                              <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                           </div>
                           <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-indigo-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                              />
                           </div>
                        </div>
                      )}
                   </div>
                </div>
             </div>

             <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex-1">
                   <h3 className="font-bold text-slate-900 mb-6">Campaign Builder</h3>
                   
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Broadcast Message</label>
                        <textarea 
                          value={bulkMessage}
                          onChange={(e) => setBulkMessage(e.target.value)}
                          className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-0 outline-none resize-none"
                          placeholder="Hey {{name}}, we have a special offer for your business..."
                        />
                      </div>

                      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-start gap-4">
                         <div className="p-2 bg-white rounded-xl text-amber-600 shadow-sm">
                            <Zap size={18} />
                         </div>
                         <div className="flex-1">
                            <h4 className="text-sm font-bold text-amber-900">Compliance Warning</h4>
                            <p className="text-xs text-amber-700 mt-1 leading-relaxed">Ensure you have explicit opt-in from all contacts. Sending unsolicited messages can lead to WhatsApp number banning.</p>
                         </div>
                      </div>

                      <div className="flex gap-4">
                         <button 
                           onClick={startBulkCampaign}
                           disabled={!csvData.length || !bulkMessage || sendingBulk}
                           className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
                         >
                            {sendingBulk ? `Sending (${progress.current}/${progress.total})...` : bulkStep === 'done' ? 'Campaign Finished!' : 'Launch Bulk Campaign'}
                         </button>
                         <button 
                           onClick={() => setBulkStep('upload')}
                           className="px-6 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                         >
                            {bulkStep === 'done' ? 'New Campaign' : 'Reset'}
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
