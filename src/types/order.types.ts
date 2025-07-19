export interface IOrder {
  id: string;
  orderId?: string;
  buyer_id: string;
  seller_id: string;
  delivery_address: string;
  status: string;
  order_date: string;
  order_items: IOrderItem[];
}
export interface IOrderAddressUpdate {
  orderId: string;
  delivery_address: string;
}



export interface IOrderProduct {
  product_id: string;
  quantity: number;
}
export interface IOrderPayload {
  delivery_address: string;
  products: IOrderProduct[];
}

export interface IOrderItem {
  id: string;
  product_id: string;
  price: number;
  quantity: number;
}
