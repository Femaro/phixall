export interface MaterialRecommendation {
  id: string;
  jobId: string;
  phixerId: string;
  phixerName: string;
  materialName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  photoUrl?: string;
  note?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  status: 'pending' | 'approved' | 'declined' | 'rejected' | 'modified';
  adminMarkup?: number; // Percentage markup added by admin
  finalCost?: number; // Cost after markup
  procurementMethod?: 'phixer' | 'phixall'; // Who will procure
  adminNotes?: string;
  createdAt: Date | { seconds: number; nanoseconds: number } | { toDate: () => Date };
  updatedAt?: Date | { seconds: number; nanoseconds: number } | { toDate: () => Date };
  approvedAt?: Date | { seconds: number; nanoseconds: number } | { toDate: () => Date };
  approvedBy?: string; // Admin user ID
}

export interface MaterialInvoice {
  id: string;
  jobId: string;
  clientId: string;
  clientName: string;
  materials: MaterialRecommendation[];
  subtotal: number; // Sum of all material costs
  markupAmount: number; // Total markup revenue
  totalAmount: number; // Subtotal + markup
  serviceFee: number; // 10% service fee
  grandTotal: number; // Total + service fee
  status: 'pending' | 'paid' | 'cancelled';
  paymentMethod?: string;
  paymentReference?: string;
  paidAt?: Date | { seconds: number; nanoseconds: number } | { toDate: () => Date };
  createdAt: Date | { seconds: number; nanoseconds: number } | { toDate: () => Date };
}

export interface MaterialPayment {
  invoiceId: string;
  jobId: string;
  clientId: string;
  amount: number;
  materialCost: number;
  markupRevenue: number;
  serviceFee: number;
  paymentMethod: string;
  reference: string;
  timestamp: Date | { seconds: number; nanoseconds: number } | { toDate: () => Date };
}

export interface JobTimelineEvent {
  id: string;
  jobId: string;
  type: 'material-recommended' | 'material-approved' | 'invoice-sent' | 'material-paid' | 'material-procured' | 'job-resumed';
  description: string;
  userId?: string;
  userName?: string;
  metadata?: Record<string, any>;
  createdAt: Date | { seconds: number; nanoseconds: number } | { toDate: () => Date };
}

