export interface ICartItem {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image_url?: string;
  [key: string]: any;
    message: string;

}

export interface BuyerCartState {
  cart: ICartItem[];
  loading: string;
  apiName: string;
  alertType: string;
  message: string;
  error: boolean;
}
  