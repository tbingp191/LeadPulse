import React, { useEffect, useState } from "react";
import { 
  Users, 
  ShieldAlert, 
  Mail, 
  MessageSquare, 
  Search, 
  Filter, 
  ChevronRight, 
  Activity,
  Calendar,
  Lock,
  Unlock,
  Bell,
  Send,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { collection, query, onSnapshot, doc, updateDoc, Timestamp, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { cn, formatDate } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { startRazorpaySubscription } from "../lib/razorpay";

interface SystemUser {
  uid: string;
  email: string;
  createdAt: any;
  trialEndsAt: any;
  isSubscriptionActive: boolean;
  whatsappGreeting?: string;
  name?: string;
}

export default function Admin() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [whatsAppMsg, setWhatsAppMsg] = useState("Hello! This is an official update regarding your LeadPulse subscription. How can we assist you today?");

  const isAdmin = auth.currentUser?.email === "shwetaarenaanimationngp@gmail.com";

  useEffect(() => {
    document.title = "Admin Console | LeadPulse";
    
    if (!isAdmin) return;

    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userData = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as SystemUser[];
      setUsers(userData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const toggleSubscription = async (user: SystemUser) => {
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        isSubscriptionActive: !user.isSubscriptionActive
      });
      setSelectedUser(prev => prev ? { ...prev, isSubscriptionActive: !prev.isSubscriptionActive } : null);
    } catch (error) {
      console.error("Error updating subscription:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const sendNotification = () => {
    // Logic for triggering FCM or Notification Service
    console.log(`System: Dispatching Notification to ${selectedUser?.email}`, notificationMsg);
    setShowNotificationModal(false);
    setNotificationMsg("");
  };

  const sendWhatsApp = () => {
    // Logic for triggering WhatsApp API Gateway
    console.log(`System: Dispatching WhatsApp Greeting to ${selectedUser?.email}`, whatsAppMsg);
    setShowWhatsAppModal(false);
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isAdmin) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-red-50">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Access Restricted</h2>
        <p className="text-slate-500 max-w-sm mb-8 font-medium">
          You don't have administrative privileges to access this console. Please contact the system owner if you believe this is an error.
        </p>
        <button 
          onClick={() => window.location.href = "/"}
          className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Admin Console</h2>
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest">Master</span>
          </div>
          <p className="text-slate-500 font-medium">Global subscription control and user lifecycle management.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
            <Activity className="text-green-500" size={18} />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Users</p>
              <p className="text-sm font-black text-slate-900">{users.filter(u => u.isSubscriptionActive).length}/{users.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* User List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Search by user identifier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                />
              </div>
              <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                <Filter size={18} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Subscriber</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Created</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Trial Ends</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="animate-spin text-indigo-500" size={24} />
                          <p className="text-sm font-medium text-slate-400 italic">Syncing global user records...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic font-medium">No records found matching your search.</td>
                    </tr>
                  ) : filteredUsers.map((user) => (
                    <tr 
                      key={user.uid} 
                      onClick={() => setSelectedUser(user)}
                      className={cn(
                        "hover:bg-slate-50 transition-all cursor-pointer group",
                        selectedUser?.uid === user.uid && "bg-indigo-50/50"
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm",
                            user.isSubscriptionActive ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-400"
                          )}>
                            {user.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">{user.name || "System User"}</p>
                            <p className="text-xs font-medium text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">
                        {formatDate(user.trialEndsAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                          user.isSubscriptionActive 
                            ? "bg-green-100 text-green-700 shadow-sm shadow-green-100" 
                            : "bg-red-100 text-red-700 shadow-sm shadow-red-100"
                        )}>
                          {user.isSubscriptionActive ? "Active" : "Suspended"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* User Detail & Control */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {selectedUser ? (
              <motion.div 
                key={selectedUser.uid}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden"
              >
                <div className="p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-black">
                        {selectedUser.email[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900">{selectedUser.name || "Account Profile"}</h3>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Mail size={14} className="text-slate-400" />
                          {selectedUser.email}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Joined Port</p>
                      <div className="flex items-center gap-2 text-slate-900">
                        <Calendar size={14} />
                        <span className="text-xs font-black">{formatDate(selectedUser.createdAt)}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Trial Termination</p>
                      <div className="flex items-center justify-between gap-2 text-slate-900">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span className="text-xs font-black">{formatDate(selectedUser.trialEndsAt)}</span>
                        </div>
                        <button 
                          onClick={() => {
                            const newDate = prompt("Enter new trial end date (YYYY-MM-DD):", new Date(selectedUser.trialEndsAt.seconds * 1000).toISOString().split('T')[0]);
                            if (newDate) {
                              updateDoc(doc(db, "users", selectedUser.uid), {
                                trialEndsAt: Timestamp.fromDate(new Date(newDate))
                              }).then(() => {
                                setSelectedUser(prev => prev ? { ...prev, trialEndsAt: Timestamp.fromDate(new Date(newDate)) } : null);
                              });
                            }
                          }}
                          className="text-[10px] font-black text-indigo-600 hover:underline uppercase"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subscription Controller</h4>
                      <button 
                        onClick={() => {
                          window.open("https://paytm.me/iPaytm/OjdCkCP", "_blank");
                        }}
                        className="text-[10px] bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-black hover:bg-indigo-100 transition-all flex items-center gap-1"
                      >
                        <Calendar size={12} />
                        Manual Renew
                      </button>
                    </div>
                    <button 
                      onClick={() => toggleSubscription(selectedUser)}
                      disabled={isUpdating}
                      className={cn(
                        "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98]",
                        selectedUser.isSubscriptionActive 
                          ? "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100" 
                          : "bg-green-50 text-green-600 border border-green-100 hover:bg-green-100"
                      )}
                    >
                      {isUpdating ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : selectedUser.isSubscriptionActive ? (
                        <>
                          <Lock size={18} />
                          Suspend Account
                        </>
                      ) : (
                        <>
                          <Unlock size={18} />
                          Reactivate Account
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Communication Tools</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setShowWhatsAppModal(true)}
                        className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50 transition-all text-indigo-600 group"
                      >
                        <MessageSquare className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp Msg</span>
                      </button>
                      <button 
                        onClick={() => setShowNotificationModal(true)}
                        className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl hover:border-amber-600 hover:bg-amber-50 transition-all text-amber-600 group"
                      >
                        <Bell className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Push Alert</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-300 mb-6">
                  <Activity size={32} />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2">Monitor Station</h4>
                <p className="text-sm font-medium text-slate-400 max-w-[200px]">Select a subscriber record from the list to manage their cycle.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* WhatsApp Modal Trigger */}
      <AnimatePresence>
        {showWhatsAppModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Send WhatsApp Greeting</h3>
                    <p className="text-sm font-medium text-slate-500">To: {selectedUser.email}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Outgoing Message</label>
                    <textarea 
                      className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/10 focus:border-green-600 transition-all font-medium text-sm"
                      value={whatsAppMsg}
                      onChange={(e) => setWhatsAppMsg(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowWhatsAppModal(false)}
                      className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={sendWhatsApp}
                      className="flex-1 px-6 py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2"
                    >
                      <Send size={18} />
                      Direct Transmit
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showNotificationModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                    <Bell size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Issue Push Alert</h3>
                    <p className="text-sm font-medium text-slate-500">Recipient: {selectedUser.email}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Alert Content</label>
                    <textarea 
                      className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-600 transition-all font-medium text-sm"
                      placeholder="Enter the push notification text..."
                      value={notificationMsg}
                      onChange={(e) => setNotificationMsg(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowNotificationModal(false)}
                      className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={sendNotification}
                      className="flex-1 px-6 py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-100 flex items-center justify-center gap-2"
                    >
                      <Bell size={18} />
                      Broadcast Alert
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
