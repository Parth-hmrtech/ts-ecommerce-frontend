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
  [key: string]: any;

}
export interface IAddProduct {
  product_name: string;
  description: string;
  price: number;
  quantity: number;
  category_id: string;
  subcategory_id: string;
}

export interface IUpdateProduct {
  id: string; 
  product_name: string;
  description: string;
  price: number;
  quantity: number;
  category_id: string;
  subcategory_id: string;
}

export interface IWishlistItem {
  id: string;
  product_id: string;
  buyer_id: string;
  wishlistId: string;
}

export interface IWishlistAdd {
  buyer_id: string;
  product_id: string;
}
