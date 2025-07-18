export interface IReview {
  id: string;
  product_id?: string;
  order_id?: string;
  buyer_id?: string;
  seller_id?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}
export type IReviewAdd = Required<Pick<
  IReview,
  'order_id' | 'product_id' | 'buyer_id' | 'seller_id' | 'rating' | 'comment'
>>;