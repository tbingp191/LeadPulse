import React, { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Lead, Activity } from "../types";

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
      setLeads(leadsList);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addLead = async (leadData: Partial<Lead>) => {
    try {
      const docRef = await addDoc(collection(db, "leads"), {
        ...leadData,
        status: leadData.status || 'new',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      // Log activity
      await addDoc(collection(db, `leads/${docRef.id}/activities`), {
        leadId: docRef.id,
        type: 'system',
        content: `Lead captured via ${leadData.source || 'Manual Input'}`,
        timestamp: serverTimestamp(),
      });

      // Simulation: Automatically send WhatsApp message
      setTimeout(async () => {
        await updateDoc(doc(db, "leads", docRef.id), {
          lastMessageSent: serverTimestamp(),
          status: 'contacted'
        });
        
        await addDoc(collection(db, `leads/${docRef.id}/activities`), {
          leadId: docRef.id,
          type: 'whatsapp',
          content: 'Auto-message sent: "Hi! Thanks for your interest. How can we help you today?"',
          timestamp: serverTimestamp(),
        });
      }, 3000);

      return docRef.id;
    } catch (e) {
      console.error("Error adding lead:", e);
    }
  };

  const updateLead = async (leadId: string, updates: Partial<Lead>) => {
    try {
      const leadRef = doc(db, "leads", leadId);
      await updateDoc(leadRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      if (updates.status) {
        await addDoc(collection(db, `leads/${leadId}/activities`), {
          leadId,
          type: 'system',
          content: `Status updated to ${updates.status}`,
          timestamp: serverTimestamp(),
        });
      }
    } catch (e) {
      console.error("Error updating lead:", e);
    }
  };

  return { leads, loading, addLead, updateLead };
}
