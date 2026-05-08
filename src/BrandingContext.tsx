import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

interface Branding {
  name: string;
  logo: string;
  email: string;
  phone: string;
  website: string;
}

interface BrandingContextType {
  branding: Branding;
  loading: boolean;
}

const defaultBranding: Branding = {
  name: "LeadPulse",
  logo: "",
  email: "Support@thebrandidentiry.online",
  phone: "9226920200",
  website: "",
};

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<Branding>(defaultBranding);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Listen for real-time updates to user branding settings
        const unsubscribeDoc = onSnapshot(doc(db, "users", user.uid), (doc) => {
          if (doc.exists() && doc.data().branding) {
            setBranding({
              ...defaultBranding,
              ...doc.data().branding
            });
          }
          setLoading(false);
        });
        return () => unsubscribeDoc();
      } else {
        setBranding(defaultBranding);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <BrandingContext.Provider value={{ branding, loading }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error("useBranding must be used within a BrandingProvider");
  }
  return context;
}
