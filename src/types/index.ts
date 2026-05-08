export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source: string;
  status: LeadStatus;
  assignedTo?: string;
  createdAt: any; // Timestamp
  updatedAt?: any;
  lastMessageSent?: any;
  industry?: string;
  products?: string;
  description?: string;
  scale?: string;
}

export interface Salesperson {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface Activity {
  id: string;
  leadId: string;
  type: 'system' | 'whatsapp' | 'call' | 'note';
  content: string;
  timestamp: any;
  performedBy?: string;
}
