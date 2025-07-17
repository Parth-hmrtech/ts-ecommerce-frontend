export interface IPayment {
  order_id?: string;
  seller_id?: string;
  amount?: number;
  payment_method?: string;
  transaction_id?: string;
  status?: string;
}