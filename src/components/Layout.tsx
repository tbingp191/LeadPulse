import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  Settings, 
  MessageSquare, 
  Home, 
  Filter,
  PlusCircle,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Zap,
  ShieldCheck
} from "lucide-react";
import { cn } from "../lib/utils";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { useBranding } from "../BrandingContext";

import { TrialBanner } from "./TrialBanner";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { branding } = useBranding();
  const user = auth.currentUser;

  const isAdmin = user?.email === "shwetaarenaanimationngp@gmail.com";

  const navItems = isAdmin 
    ? [
        { icon: ShieldCheck, label: "Admin Console", path: "/admin" },
        { icon: Home, label: "App View", path: "/dashboard" },
        { icon: Settings, label: "Settings", path: "/settings" },
      ]
    : [
        { icon: Home, label: "Dashboard", path: "/dashboard" },
        { icon: Filter, label: "Pipeline", path: "/pipeline" },
        { icon: Users, label: "Sales Team", path: "/team" },
        { icon: Zap, label: "Marketing", path: "/marketing" },
        { icon: MessageSquare, label: "Inbox", path: "/inbox" },
        { icon: Settings, label: "Settings", path: "/settings" },
      ];

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform lg:relative lg:translate-x-0 shadow-2xl lg:shadow-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {branding.logo ? (
              <img src={branding.logo} alt="Logo" className="w-10 h-10 object-contain rounded-xl" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                {branding.name.charAt(0)}
              </div>
            )}
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">{branding.name}</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
          <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 mb-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Support</p>
            <p className="text-xs font-semibold text-slate-700">{branding.phone}</p>
            <p className="text-[10px] text-slate-500 truncate">{branding.email}</p>
          </div>

          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
          
          <div className="bg-slate-50 rounded-xl p-4 mt-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Automated Ingress</p>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-sm font-medium text-slate-900 truncate">System Active</p>
            </div>
            <p className="text-xs text-slate-500 mt-1">Listening to API v2.4</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-500 lg:hidden hover:bg-slate-50 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <div className="items-center gap-4 hidden sm:flex flex-1 max-w-xl">
              <Search className="text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search leads, tasks..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1 sm:mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-900 leading-none">{user?.displayName || "User"}</p>
                <p className="text-xs text-slate-500 mt-1 truncate max-w-[120px]">{user?.email}</p>
              </div>
              {user?.photoURL ? (
                <img src={user.photoURL} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="Avatar" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-700 font-bold">
                  {user?.displayName?.charAt(0) || "U"}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {!isAdmin && <TrialBanner />}
          {children}
        </div>
      </main>
    </div>
  );
}
