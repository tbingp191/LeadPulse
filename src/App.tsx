import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./lib/firebase";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Pipeline from "./pages/Pipeline";
import Team from "./pages/Team";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";
import Inbox from "./pages/Inbox";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Marketing from "./pages/Marketing";
import Landing from "./pages/Landing";
import { BrandingProvider } from "./BrandingContext";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <BrandingProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
          
          {/* Protected App Routes */}
          <Route 
            path="/dashboard" 
            element={user ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/pipeline" 
            element={user ? <Layout><Pipeline /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/team" 
            element={user ? <Layout><Team /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={user ? <Layout><Admin /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/settings" 
            element={user ? <Layout><Settings /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/inbox" 
            element={user ? <Layout><Inbox /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path="/marketing" 
            element={user ? <Layout><Marketing /></Layout> : <Navigate to="/login" />} 
          />

          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
        </Routes>
      </BrandingProvider>
    </Router>
  );
}
