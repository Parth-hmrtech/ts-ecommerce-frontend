export interface ICartItem {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image_url?: string;
  message: string;
  [key: string]: any;
 newQty: number
}
export interface ICartAdd {
  product_id: string;
  quantity: number;
}

export interface ICartUpdate {
  id: string;
  quantity: number;
}
export interface BuyerCartState {
  cart: ICartItem[];
  loading: string;
  apiName: string;
  alertType: string;
  message: string;
  error: boolean;
}
