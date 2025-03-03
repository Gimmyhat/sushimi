export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  address?: string;
  created_at?: string;
}

export interface UserProfile extends User {
  orders_count?: number;
  last_order_date?: string;
} 