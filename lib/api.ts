import { 
  Category, 
  Product, 
  Promotion, 
  Order,
  OrderItem,
  CategoriesResponse,
  ProductsResponse,
  PromotionsResponse,
  ApiResponse
} from '@/types';

// Функция для получения категорий
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch('/api/categories');
    if (!response.ok) {
      throw new Error('Ошибка при получении категорий');
    }
    const data: CategoriesResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Функция для получения продуктов по категории
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  try {
    const response = await fetch(`/api/products/category?slug=${categorySlug}`);
    if (!response.ok) {
      throw new Error(`Ошибка при получении продуктов для категории ${categorySlug}`);
    }
    const data: ProductsResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error(`Error fetching products for category ${categorySlug}:`, error);
    return [];
  }
}

// Функция для получения популярных продуктов
export async function getPopularProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products/popular');
    if (!response.ok) {
      throw new Error('Ошибка при получении популярных продуктов');
    }
    const data: ProductsResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching popular products:', error);
    return [];
  }
}

// Функция для получения акций
export async function getPromotions(): Promise<Promotion[]> {
  try {
    const response = await fetch('/api/promotions');
    if (!response.ok) {
      throw new Error('Ошибка при получении акций');
    }
    const data: PromotionsResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return [];
  }
}

// Функция для проверки промокода
export async function checkPromoCode(promoCode: string): Promise<Promotion | null> {
  try {
    const response = await fetch(`/api/promo/check?code=${promoCode}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Ошибка при проверке промокода');
    }
    const data: ApiResponse<Promotion> = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error checking promo code:', error);
    return null;
  }
}

// Типы для данных заказа
export interface OrderData {
  user_id?: string;
  address: string;
  phone: string;
  payment_method: string;
  delivery_time: string;
  comment?: string;
  total: number;
}

// Функция для создания заказа
export async function createOrder(
  orderData: OrderData, 
  orderItems: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[]
): Promise<Order | null> {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderData, orderItems }),
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при создании заказа');
    }
    
    const data: ApiResponse<Order> = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
} 