export interface IReview {
  id: string;
  product_id?: string;
  order_id?: string;
  buyer_id?: string;
  seller_id?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
  created_at: string | Date;
  updated_at: string | Date;
  updatedAt?: string;
  loading:string;
}
export type IReviewAdd = {
  order_id: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  rating: number;
  comment: string;
};
export interface ISellerReviewState {
  loading: boolean;
  error: string | null;
  reviews: IReview[];
}
