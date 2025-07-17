export interface IPayment {
  order_id?: string;
  seller_id?: string;
  amount?: number;
  payment_method?: string;
  transaction_id?: string;
  status?: string;
}

// Represents a single buyer payment response (checkout, verify, status)
export interface IPaymentResponse {
  id: string;              // Unique payment ID (e.g., from payment gateway)
  orderId: string;         // Associated order ID
  amount: number;          // Payment amount
  currency: string;        // Currency code, e.g. 'USD', 'INR'
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  method: string;          // Payment method (e.g., 'card', 'upi')
  createdAt: string;       // ISO date string of creation
  updatedAt?: string;      // ISO date string of last update (optional)
  [key: string]: any;      // Any additional dynamic fields
}

// Represents simplified payment status info (like from checkPaymentStatus API)
export interface IPaymentStatus {
  paymentId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  lastCheckedAt: string; // ISO date string when status was last checked
  [key: string]: any;
}

// Represents a single seller payment record (history of received payments)
export interface ISellerPayment {
  paymentId: string;
  orderId: string;
  sellerId: string;
  amount: number;
  paymentDate: string; // ISO date string
  status: 'completed' | 'pending' | 'failed';
  method: string;
  [key: string]: any;
}

// Represents a summary or individual earning record for the seller
export interface ISellerEarning {
  sellerId: string;
  totalEarnings: number;     // Total accumulated earnings
  payoutDate?: string;       // Optional last payout date ISO string
  currency: string;
  earningsBreakdown?: {      // Optional detailed breakdown
    [monthYear: string]: number; // e.g., "2025-07": 5000
  };
  [key: string]: any;
}
