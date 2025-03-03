export interface Promotion {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  promo_code?: string;
  discount_percent?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  created_at?: string;
} 