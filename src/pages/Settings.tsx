import React, { useEffect, useState, useRef } from "react";
import { 
  Save, 
  Loader2, 
  MessageCircle, 
  Smartphone, 
  Bell, 
  User, 
  Shield, 
  Clock,
  Sparkles,
  Upload,
  Globe,
  Mail,
  Smartphone as PhoneIcon,
  X,
  Image as ImageIcon,
  CheckCircle,
  Share2,
  Copy
} from "lucide-react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";

export default function Settings() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [greeting, setGreeting] = useState("Hi! Thanks for reaching out. A sales expert has been assigned to you and will call shortly. How can we help?");
  const [branding, setBranding] = useState({
    name: "LeadPulse CRM",
    logo: "",
    website: "",
    phone: "9226920200",
    email: "Support@thebrandidentiry.online",
  });
  const [channels, setChannels] = useState({
    whatsappNumber: "",
    emailService: "gmail",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("branding");
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Settings | " + branding.name;
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        fetchSettings(u.uid);
      }
    });
    
    return () => unsubscribe();
  }, [branding.name]);

  const fetchSettings = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.whatsappGreeting) setGreeting(data.whatsappGreeting);
        if (data.branding) setBranding({ ...branding, ...data.branding });
        if (data.channels) setChannels(data.channels);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleSave = async (section: string) => {
    if (!user) return;
    setSaving(true);
    setMessage({ text: "", type: "" });
    try {
      const updates: any = { updatedAt: serverTimestamp() };
      if (section === 'automation') updates.whatsappGreeting = greeting;
      if (section === 'branding') updates.branding = branding;
      if (section === 'channels') updates.channels = channels;

      await updateDoc(doc(db, "users", user.uid), updates);
      setMessage({ text: `${section.charAt(0).toUpperCase() + section.slice(1)} settings updated!`, type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({ text: "Update failed. Please check your connection.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding({ ...branding, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: "branding", label: "Brand Identity", icon: Shield },
    { id: "automation", label: "AI & Automation", icon: Sparkles },
    { id: "channels", label: "Connectivity", icon: Smartphone },
    { id: "notifications", label: "Alert Config", icon: Bell },
  ];

  const handleShareApp = () => {
    const appUrl = window.location.origin;
    if (navigator.share) {
      navigator.share({
        title: branding.name,
        text: `Join our sales team on ${branding.name}! Install the app to get started.`,
        url: appUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(appUrl);
      setMessage({ text: "App invite link copied to clipboard!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Configuration</h1>
        <p className="text-slate-500 mt-2 font-medium">Control your platform's brain, voice, and visual identity.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="lg:w-72 shrink-0">
          <nav className="flex lg:flex-col p-1.5 bg-slate-100 rounded-[2rem] lg:bg-transparent lg:space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 lg:flex-none flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? "bg-white lg:bg-slate-900 text-indigo-700 lg:text-white shadow-sm lg:shadow-xl" 
                    : "text-slate-500 hover:text-slate-900 lg:hover:bg-slate-100"
                }`}
              >
                <tab.icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === "branding" && (
              <motion.div
                key="branding"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Share App Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                      <Share2 size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black">Share LeadPulse</h3>
                      <p className="text-indigo-200 text-sm font-medium">Invite team members to install the application.</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleShareApp}
                    className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all flex items-center gap-2 active:scale-95 shrink-0 shadow-lg"
                  >
                    <Copy size={16} />
                    Share Invite Link
                  </button>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-10 border-b border-slate-100 bg-slate-50/30">
                    <h2 className="text-xl font-black text-slate-900">Brand Persona</h2>
                    <p className="text-sm text-slate-500 font-medium">Your logo and name appear across all interfaces and reports.</p>
                  </div>
                  
                  <div className="p-10 space-y-10">
                    {/* Logo Section */}
                     <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                       <div className="relative group">
                          {branding.logo ? (
                            <img src={branding.logo} className="w-24 h-24 rounded-3xl object-contain border border-slate-100 shadow-inner bg-slate-50" alt="Logo" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-24 h-24 rounded-3xl bg-indigo-50 border border-dashed border-indigo-200 flex items-center justify-center text-indigo-400">
                               <ImageIcon size={32} />
                            </div>
                          )}
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-slate-900 transition-all active:scale-90"
                          >
                            <Upload size={14} />
                          </button>
                          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                       </div>
                       <div className="flex-1">
                          <h4 className="font-bold text-slate-900">Platform Logo</h4>
                          <p className="text-xs text-slate-500 mt-1">Upload a high-quality SVG or PNG (square aspect ratio preferred). This updates your dashboard branding immediately.</p>
                          {branding.logo && (
                            <button onClick={() => setBranding({...branding, logo: ""})} className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-2 hover:underline">Remove Logo</button>
                          )}
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Company Name</label>
                        <div className="relative">
                          <Shield className="absolute left-4 top-4 text-slate-400" size={18} />
                          <input 
                            className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/10 outline-none font-bold"
                            value={branding.name}
                            onChange={e => setBranding({...branding, name: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Official Website</label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-4 text-slate-400" size={18} />
                          <input 
                            className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/10 outline-none font-bold"
                            placeholder="www.yourbrand.com"
                            value={branding.website}
                            onChange={e => setBranding({...branding, website: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Support Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
                          <input 
                            className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/10 outline-none font-bold"
                            value={branding.email}
                            onChange={e => setBranding({...branding, email: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Contact Phone</label>
                        <div className="relative">
                          <PhoneIcon className="absolute left-4 top-4 text-slate-400" size={18} />
                          <input 
                            className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/10 outline-none font-bold"
                            value={branding.phone}
                            onChange={e => setBranding({...branding, phone: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-10 pt-0">
                    <button 
                      onClick={() => handleSave('branding')}
                      disabled={saving}
                      className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 shadow-xl transition-all active:scale-[0.98]"
                    >
                      {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                      Propagate Brand Changes
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "channels" && (
              <motion.div
                key="channels"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-10 border-b border-slate-100 bg-slate-50/30">
                    <h2 className="text-xl font-black text-slate-900">Communication Nodes</h2>
                    <p className="text-sm text-slate-500 font-medium">Link your outbound messaging engines.</p>
                  </div>
                  <div className="p-10 space-y-8">
                    <div className="space-y-4">
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                               <MessageCircle size={24} />
                            </div>
                            <div>
                               <h4 className="font-bold text-slate-900">WhatsApp Official Business</h4>
                               <p className="text-xs text-slate-500">API version 2.4 Active</p>
                            </div>
                         </div>
                         <button 
                            onClick={() => {
                              setApiKeyInput(channels.whatsappApiKey || "");
                              setShowApiModal(true);
                            }}
                            className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline"
                          >
                            {channels.whatsappApiKey ? 'Update API Key' : 'Config API Key'}
                          </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Sender Number</label>
                        <input 
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/10 outline-none font-bold"
                          placeholder="+91..."
                          value={channels.whatsappNumber}
                          onChange={e => setChannels({...channels, whatsappNumber: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                       <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                               <Mail size={24} />
                            </div>
                            <div>
                               <h4 className="font-bold text-slate-900">Email SMTP/IMAP</h4>
                               <p className="text-xs text-slate-500">For inbox & outbound sync</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connected</span>
                         </div>
                      </div>
                      <select 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm"
                        value={channels.emailService}
                        onChange={e => setChannels({...channels, emailService: e.target.value})}
                      >
                        <option value="leadpulse">LeadPulse Enterprise Proxy</option>
                        <option value="gmail">Google Workspace API</option>
                        <option value="outlook">Microsoft Outlook 365</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-10 pt-0">
                    <button 
                      onClick={() => handleSave('channels')}
                      className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-xl"
                    >
                      {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                      Verify & Save Connectivity
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "automation" && (
              <motion.div
                key="automation"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-10 border-b border-slate-100 bg-slate-50/30">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                        <Sparkles size={20} />
                      </div>
                      <h2 className="text-xl font-black text-slate-900">AI Outreach Engine</h2>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Control the instant automated replies for incoming leads.</p>
                  </div>

                  <div className="p-10">
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                            Greeting Narrative Template
                          </label>
                          <textarea 
                            className="w-full h-56 p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm font-semibold resize-none leading-relaxed"
                            placeholder="Enter your welcome message..."
                            value={greeting}
                            onChange={(e) => setGreeting(e.target.value)}
                          />
                        </div>

                        <div className="p-6 bg-slate-900 rounded-3xl text-white">
                           <div className="flex items-center gap-3 mb-4">
                              <Shield className="text-indigo-400" size={20} />
                              <h4 className="text-sm font-bold">Encrypted Dispatch</h4>
                           </div>
                           <p className="text-xs text-slate-400 leading-relaxed font-medium">Messages are signed by LeadPulse with End-to-End Encryption where supported by the underlying protocol.</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-8 shadow-inner">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Mobile Preview</p>
                           <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 max-w-[280px] mx-auto relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-1.5 bg-green-500" />
                              <div className="flex items-center gap-2 mb-4">
                                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">L</div>
                                 <p className="text-[10px] font-bold">Official {branding.name}</p>
                              </div>
                              <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none border border-slate-200 mb-2">
                                 <p className="text-[10px] text-slate-600 font-medium whitespace-pre-wrap">{greeting}</p>
                              </div>
                              <p className="text-[8px] text-slate-300 font-bold uppercase text-right">0.0s elapsed</p>
                           </div>
                        </div>

                        <button 
                          onClick={() => handleSave('automation')}
                          disabled={saving}
                          className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-xl active:scale-[0.98]"
                        >
                          {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                          Sync AI Configuration
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-96 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-slate-200"
              >
                <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mb-6">
                   <Bell size={40} strokeWidth={1} />
                </div>
                <p className="text-slate-900 font-black text-xl mb-1 mt-4">Configuring Alerts</p>
                <p className="text-sm text-slate-400 font-medium px-20 text-center">We're finalizing the push notification system. You'll receive real-time webhooks soon.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* API Config Modal */}
      <AnimatePresence>
        {showApiModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Shield size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900">Configure WhatsApp API</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                <p className="text-sm text-slate-500 font-medium">Enter your Meta WhatsApp Business API Token. This is required for official outreach.</p>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
                  <input 
                    type="password"
                    placeholder="EAA... (Permanent Token)"
                    className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/10 outline-none font-bold"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowApiModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setChannels({ ...channels, whatsappApiKey: apiKeyInput });
                    setShowApiModal(false);
                  }}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all"
                >
                  Confirm Key
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-12 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl text-sm font-black shadow-2xl border flex items-center gap-3 z-[100] ${
              message.type === "success" ? "bg-white text-green-600 border-green-100" : "bg-white text-red-600 border-red-100"
            }`}
          >
            {message.type === 'success' ? <CheckCircle size={18} /> : <X size={18} />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
