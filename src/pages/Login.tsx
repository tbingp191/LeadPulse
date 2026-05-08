import React from "react";
import { LogIn, ShieldCheck, Zap } from "lucide-react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Login() {
  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((error) => {
      console.error("Login failed:", error);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-10">
        <div className="flex flex-col items-center text-center mb-10">
          <img src="/logo.png" alt="LeadPulse Logo" className="h-20 w-auto mb-6 drop-shadow-sm" />
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">LeadPulse CRM</h1>
          <p className="text-slate-500">The advanced sales platform for your team.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-start gap-3">
            <Zap className="text-indigo-600 shrink-0" size={20} />
            <p className="text-xs text-indigo-700 leading-relaxed font-medium">
              Automate lead importing from social media, send instant WhatsApp greetings, and boost closures.
            </p>
          </div>

          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 h-14 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Sign in with Google
          </button>

          <div className="flex items-center gap-2 justify-center text-slate-400">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Enterprise Security Enabled</span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-2">
        <p className="text-slate-400 text-sm font-medium">© 2026 LeadPulse Technologies • v2.0.4</p>
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
          <span>9226920200</span>
          <span>•</span>
          <span>Support@thebrandidentiry.online</span>
        </div>
      </div>
    </div>
  );
}
