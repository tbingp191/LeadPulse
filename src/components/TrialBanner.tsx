import React, { useState } from "react";
import { Clock, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { useTrial } from "../hooks/useTrial";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import { startRazorpaySubscription } from "../lib/razorpay";
import { auth } from "../lib/firebase";

export function TrialBanner() {
  const { daysRemaining, isTrialExpired, loading: trialLoading, isSubscriptionActive } = useTrial();
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = () => {
    window.open("https://paytm.me/iPaytm/OjdCkCP", "_blank");
  };

  if (trialLoading || !isSubscriptionActive) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 mb-8",
        isTrialExpired ? "bg-red-50 border-red-100 text-red-700" : "bg-indigo-50 border-indigo-100 text-indigo-700"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-xl",
          isTrialExpired ? "bg-red-100/50" : "bg-indigo-100/50"
        )}>
          {isTrialExpired ? <AlertCircle size={20} /> : <Clock size={20} />}
        </div>
        <div>
          <p className="text-sm font-bold">
            {isTrialExpired 
              ? "Your trial has expired" 
              : `7-Day Free Trial: ${daysRemaining} days remaining`}
          </p>
          <p className="text-xs opacity-80 font-medium">
            {isTrialExpired 
              ? "Upgrade now to keep your Leads flowing." 
              : "Experience the full power of LeadPulse automation."}
          </p>
        </div>
      </div>
      <button 
        onClick={handleUpgrade}
        disabled={upgrading}
        className={cn(
          "px-6 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50",
          isTrialExpired 
            ? "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-100" 
            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
        )}
      >
        {upgrading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
        Upgrade Plan
      </button>
    </motion.div>
  );
}
