export interface Order {
  id?: string;
  user_id?: string;
  customer_name: string;
  observation?: string;
  status: string;
  total: number;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id?: string;
  size_id?: string;
  quantity: number;
  unit_price: number;
  total: number;
}
