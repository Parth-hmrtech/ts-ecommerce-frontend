export interface IPayment {
  order_id?: string;
  seller_id?: string;
  amount?: number;
  payment_method?: string;
  transaction_id?: string;
  status?: string;
}

export interface IPaymentResponse {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  method: string;
  createdAt: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface IPaymentStatus {
  paymentId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  lastCheckedAt: string;
  [key: string]: any;
}

export interface ISellerPayment {
  paymentId: string;
  orderId: string;
  sellerId: string;
  amount: number;
  paymentDate: string;
  status: 'completed' | 'pending' | 'failed';
  method: string;
  [key: string]: any;
}

export interface ISellerEarning {
  sellerId: string;
  totalEarnings: number;
  payoutDate?: string;
  currency: string;
  earningsBreakdown?: {
    [monthYear: string]: number;
  };
  [key: string]: any;
}
