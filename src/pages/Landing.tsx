import React from "react";
import { Link } from "react-router-dom";
import { 
  Rocket, 
  Sparkles, 
  MessageCircle, 
  TrendingUp, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle2,
  Users,
  Smartphone
} from "lucide-react";
import { motion } from "motion/react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-indigo-100 shadow-xl">
              <Zap className="text-white fill-white" size={24} />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">LeadPulse<span className="text-indigo-600">.</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Features</a>
            <a href="#solutions" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Solutions</a>
            <a href="#pricing" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2">Login</Link>
            <Link to="/signup" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Sparkles size={14} /> The Future of Sales
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
              Convert Leads into <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Revenue</span> with AI.
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium mb-12 leading-relaxed">
              The world's most aggressive CRM. Instant WhatsApp outreach, AI lead scoring, and bulk campaign automation built for high-growth teams.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/signup" className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-lg shadow-2xl hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                Claim Your Pipeline
                <ArrowRight size={20} />
              </Link>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-50 bg-slate-200 shadow-sm" />
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-900 leading-none">500+ Teams</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Trust LeadPulse</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 relative px-4"
          >
            <div className="relative max-w-5xl mx-auto bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden aspect-[16/9] flex items-center justify-center group">
               <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-transparent group-hover:opacity-50 transition-opacity" />
               <TrendingUp size={80} className="text-indigo-600 stroke-[3] opacity-20" />
               <div className="absolute bottom-10 left-10 p-6 bg-white rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-6 animate-bounce">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                    <Rocket size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase">Growth Rate</p>
                    <p className="text-xl font-black text-slate-900">+342% Year</p>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Built for Speed-to-Lead</h2>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">Traditional CRMs are slow database managers. LeadPulse is an active sales engine.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                title: "Instant WhatsApp", 
                desc: "Auto-reply to every lead within milliseconds. Don't let your prospects go cold.", 
                icon: MessageCircle, 
                color: "bg-green-50 text-green-600" 
              },
              { 
                title: "AI Analysis", 
                desc: "Gemini AI analyzes every lead to provide scoring and personalized closing strategy.", 
                icon: Sparkles, 
                color: "bg-indigo-50 text-indigo-600" 
              },
              { 
                title: "Bulk Marketing", 
                desc: "Launch high-conversion bulk campaigns via WA and Email with single-click execution.", 
                icon: TrendingUp, 
                color: "bg-blue-50 text-blue-600" 
              },
              { 
                title: "Team Velocity", 
                desc: "Real-time assignment and tracking to push your sales team to absolute peak performance.", 
                icon: Users, 
                color: "bg-amber-50 text-amber-600" 
              },
              { 
                title: "White Label", 
                desc: "Customize the interface with your brand logo and themes across the entire system.", 
                icon: Shield, 
                color: "bg-slate-900 text-white" 
              },
              { 
                title: "Mobile First", 
                desc: "Manage everything from your pocket with a fully responsive cloud architecture.", 
                icon: Smartphone, 
                color: "bg-red-50 text-red-600" 
              }
            ].map((feature, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all group">
                <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                  <feature.icon size={30} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-20">Stop collecting data.<br/><span className="text-indigo-400">Start closing deals.</span></h2>
          
          <div className="grid md:grid-cols-2 gap-12 text-left">
            <div className="p-12 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-2xl font-bold leading-relaxed italic mb-10">"LeadPulse changed our business. We went from a 12-hour response time to under 1 minute. Our conversion rate tripled in 30 days."</p>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-slate-800 rounded-2xl" />
                   <div>
                      <p className="font-black text-lg">Aryan Sharma</p>
                      <p className="text-indigo-400 font-bold text-sm">CEO, TechFlow Solutions</p>
                   </div>
                </div>
            </div>
            <div className="p-12 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-2xl font-bold leading-relaxed italic mb-10">"The AI lead scoring is scarily accurate. It tells us exactly who to talk to and what to say. It's like having a senior consultant for every lead."</p>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-slate-800 rounded-2xl" />
                   <div>
                      <p className="font-black text-lg">Sarah Jenkins</p>
                      <p className="text-indigo-400 font-bold text-sm">Sales Director, Global Real Estate</p>
                   </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-600 to-blue-600 rounded-[4rem] p-16 text-center text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)]">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Ready to pulse?</h2>
            <p className="text-xl text-indigo-100 font-medium mb-12 max-w-xl mx-auto">Join the high-performance teams using LeadPulse to dominate their market. No credit card required.</p>
            <Link to="/signup" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 rounded-full font-black text-xl hover:bg-slate-50 transition-all active:scale-95 shadow-2xl">
              Start Your Free Trial
              <ArrowRight size={24} />
            </Link>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-[100px]" />
             <div className="absolute bottom-10 right-10 w-64 h-64 bg-white rounded-full blur-[100px]" />
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-slate-200 bg-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Zap className="text-white fill-white" size={18} />
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tight">LeadPulse<span className="text-indigo-600">.</span></span>
          </div>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest text-center">© 2026 LEADPULSE CRM. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
