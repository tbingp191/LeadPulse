import React from "react";
import { 
  Zap, 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Smartphone, 
  Globe, 
  ShieldCheck,
  ChevronRight,
  Import,
  CheckCircle2,
  Bell
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Marketing() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="LeadPulse Logo" className="h-10 w-auto" />
            <span className="font-bold text-xl tracking-tight">LeadPulse</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#automation" className="hover:text-indigo-600 transition-colors">Automation</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
          </div>
          <Link 
            to="/login" 
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Zap size={14} />
              Next-Gen Lead Management
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Turn every social lead into a <span className="text-indigo-600">loyal customer.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-lg">
              LeadPulse automatically imports leads from social media, sends instant WhatsApp greetings, and assigns them to your best sales reps in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/login"
                className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                Start Free Trial
                <ChevronRight size={20} />
              </Link>
              <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                Watch Demo
              </button>
            </div>
            <div className="mt-8 flex items-center gap-4 text-xs font-bold text-slate-400">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />
                ))}
              </div>
              <span>Trusted by 500+ growth-focused sales teams</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&ixlib=rb-4.0.3" 
              alt="LeadPulse CRM Dashboard" 
              className="relative rounded-3xl shadow-2xl border border-slate-200/50 z-10"
              referrerPolicy="no-referrer"
            />
            {/* Animated Badges */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-20 hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <Smartphone size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">WhatsApp</p>
                  <p className="text-sm font-bold text-slate-900">Auto-sent Message</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Social Media Integration Section */}
      <section id="features" className="py-24 bg-slate-50 border-y border-slate-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Omnichannel Lead Capturing</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Stop manual entry. LeadPulse listens to your social channels and webhooks to bring leads directly into your funnel.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">FB & LinkedIn Import</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Direct integration with Facebook Lead Ads and LinkedIn Sales Navigator for instant syncing.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Import size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Website Webhooks</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Connect any website form via our super-fast API or Webhook listener in minutes.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bell size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Notifications</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Your sales team gets notified the millisecond a lead arrives, ensuring sub-5 minute response times.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Split - WhatsApp Automation */}
      <section id="automation" className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-indigo-600 rounded-3xl p-2 shadow-2xl relative">
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="bg-indigo-600 p-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full" />
                    <span className="font-bold">WhatsApp Automation</span>
                  </div>
                  <MessageCircle size={20} />
                </div>
                <div className="p-6 space-y-4 bg-slate-50 h-80 overflow-y-auto">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                    <p className="text-sm font-medium">Hello there! I just submitted a form for your property listing.</p>
                  </div>
                  <div className="bg-indigo-600 p-3 rounded-2xl rounded-tr-none shadow-md max-w-[80%] ml-auto text-white">
                    <p className="text-sm font-medium italic">Auto-replying via LeadPulse...</p>
                    <p className="text-sm">Hi! Thanks for reaching out. A sales expert has been assigned to you and will call shortly. How can we help?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl font-bold mb-6 tracking-tight">AI-Driven WhatsApp Speed-to-Lead</h2>
            <p className="text-lg text-slate-500 mb-8 border-l-4 border-indigo-600 pl-6 py-2">
              Leads are 100x more likely to convert if they hear from you within 5 minutes. We make it 0 minutes.
            </p>
            <ul className="space-y-4">
              {[
                "Personalized greeting templates",
                "Instant attachment sending (e.g., Brochures)",
                "Full conversation history in CRM",
                "Human handover when ready"
              ].map(item => (
                <li key={item} className="flex items-center gap-3 font-bold text-slate-700">
                  <CheckCircle2 className="text-green-500" size={20} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="bg-indigo-600 py-24 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">Ready to grow your business?</h2>
          <p className="text-xl text-indigo-100 mb-10">Join thousands of companies using LeadPulse to automate their sales engine.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/login"
              className="w-full sm:w-auto bg-white text-indigo-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-indigo-50 transition-all shadow-2xl"
            >
              Get Started for Free
            </Link>
            <p className="text-sm font-semibold opacity-70">No credit card required. Cancel anytime.</p>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-white px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="LeadPulse Logo" className="h-8 w-auto" />
            <span className="font-bold text-xl tracking-tight">LeadPulse</span>
          </div>
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-slate-400 text-sm">© 2026 LeadPulse Technologies. All rights reserved.</p>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                <Smartphone size={14} className="text-indigo-600" />
                <span>9226920200</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                <Globe size={14} className="text-indigo-600" />
                <span>Support@thebrandidentiry.online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <Globe size={20} className="hover:text-indigo-600 cursor-pointer" />
            <Smartphone size={20} className="hover:text-indigo-600 cursor-pointer" />
            <ShieldCheck size={20} className="hover:text-indigo-600 cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}
