import { Product } from './product';

export type OrderStatus = 
  | 'pending'     // ожидает подтверждения
  | 'confirmed'   // подтвержден
  | 'cooking'     // готовится
  | 'delivery'    // в доставке
  | 'completed'   // завершен
  | 'cancelled';  // отменен

export type PaymentMethod = 
  | 'cash'         // наличные
  | 'card_online'  // карта онлайн
  | 'card_courier'; // карта курьеру

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  price: number;
  created_at?: string;
}

export interface Order {
  id: string;
  user_id?: string;
  status: OrderStatus;
  total: number;
  address: string;
  phone: string;
  payment_method: PaymentMethod;
  delivery_time?: string;
  comment?: string;
  created_at: string;
  items?: OrderItem[];
} 