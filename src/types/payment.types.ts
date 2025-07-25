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
  total_earnings: number;
   total_orders: number; 
  earningsBreakdown?: {
    [monthYear: string]: number;
  };
  [key: string]: any;
}
export interface ISellerPaymentState {
  sellerPayments: IPayment[];
  sellerEarnings: number;
  loading: boolean;
  error: string | null;
}


export interface IEarnings {
  total_earnings: number;
  total_orders: number;
}

export interface ICheckoutPaymentPayload {
  order_id: string;
  seller_id: string;
  amount: number;
  payment_method: string;
  transaction_id: string;
}
export interface IVerifyPaymentPayload {
  status: 'success' | 'failed';
  transaction_id: string;
}
