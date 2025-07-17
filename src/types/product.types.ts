export interface IProduct {
  id: string;
  _id?: string;
  product_name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id?: string;
  subcategory_id?: string;
  seller_id?: string;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IWishlistItem {
  id: string;
  product_id: string;
  buyer_id: string;
  wishlistId: string;
}

export interface IReview {
  id?: string;
  product_id: string;
  order_id: string;
  buyer_id: string;
  seller_id: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
  productId : string;
}
