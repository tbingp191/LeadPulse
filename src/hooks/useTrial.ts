import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { differenceInDays, parseISO } from "date-fns";

export interface TrialStatus {
  trialEndsAt: string;
  isSubscriptionActive: boolean;
  daysRemaining: number;
  isTrialExpired: boolean;
  loading: boolean;
}

export function useTrial() {
  const [status, setStatus] = useState<TrialStatus>({
    trialEndsAt: "",
    isSubscriptionActive: false,
    daysRemaining: 0,
    isTrialExpired: false,
    loading: true,
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const trialEndsAt = parseISO(data.trialEndsAt);
        const now = new Date();
        const daysRemaining = Math.max(0, differenceInDays(trialEndsAt, now));
        const isTrialExpired = daysRemaining <= 0 && !data.isSubscriptionActive;

        setStatus({
          trialEndsAt: data.trialEndsAt,
          isSubscriptionActive: data.isSubscriptionActive,
          daysRemaining,
          isTrialExpired,
          loading: false,
        });
      } else {
        // Fallback for users without a document (e.g., direct Google sign-in)
        setStatus(prev => ({ ...prev, loading: false }));
      }
    });

    return () => unsubscribe();
  }, []);

  return status;
}
