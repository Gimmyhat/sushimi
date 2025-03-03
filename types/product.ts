export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight?: string;
  image_url?: string;
  category_id?: string;
  category_slug?: string;
  is_available: boolean;
  created_at?: string;
}

export interface ProductWithQuantity extends Product {
  quantity: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
} 