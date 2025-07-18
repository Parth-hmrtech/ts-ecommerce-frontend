export interface IPayment {
  paymentId?: string;
  orderId?: string;
  sellerId?: string;
  amount?: number;
  currency?: string;
  status?: 'pending' | 'completed' | 'failed' | 'cancelled' | 'success';
  method?: string;
  transactionId?: string;
  paymentDate?: string;
  createdAt?: string;
  updatedAt?: string;
  lastCheckedAt?: string;
  payoutDate?: string;
  totalEarnings?: number;
  earningsBreakdown?: {
    [monthYear: string]: number;
  };
  [key: string]: any;
}
