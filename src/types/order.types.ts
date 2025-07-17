
export interface IOrder {
  id: string;
  products: string[];
  delivery_address: string;
  status: string;
   orderId: string;
   
}

export interface IOrderProduct {
  product_id: string;
  quantity: number;
}
export interface IOrderPayload {
  delivery_address: string;
  products: IOrderProduct[];
}