import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Создаем клиент Supabase с типами
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Функция для получения категорий
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  return data;
}

// Функция для получения продуктов по категории
export async function getProductsByCategory(categorySlug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories!inner(*)')
    .eq('categories.slug', categorySlug)
    .eq('is_available', true)
    .order('name');
  
  if (error) {
    console.error(`Error fetching products for category ${categorySlug}:`, error);
    return [];
  }
  
  return data;
}

// Функция для получения всех продуктов
export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('is_available', true)
    .order('name');
  
  if (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
  
  return data;
}

// Функция для получения популярных продуктов
export async function getPopularProducts(limit = 4) {
  // В реальном приложении здесь может быть логика для определения популярных продуктов
  // Например, на основе количества заказов
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('is_available', true)
    .limit(limit);
  
  if (error) {
    console.error('Error fetching popular products:', error);
    return [];
  }
  
  return data;
}

// Функция для получения акций
export async function getPromotions() {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching promotions:', error);
    return [];
  }
  
  return data;
}

// Функция для создания заказа
export async function createOrder(orderData: any) {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating order:', error);
    throw error;
  }
  
  return data;
}

// Функция для создания элементов заказа
export async function createOrderItems(orderItems: any[]) {
  const { data, error } = await supabase
    .from('order_items')
    .insert(orderItems)
    .select();
  
  if (error) {
    console.error('Error creating order items:', error);
    throw error;
  }
  
  return data;
}

// Функция для получения заказов пользователя
export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
  
  return data;
}

// Функция для проверки промокода
export async function checkPromoCode(promoCode: string) {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('promo_code', promoCode)
    .eq('is_active', true)
    .single();
  
  if (error) {
    console.error('Error checking promo code:', error);
    return null;
  }
  
  // Проверяем, действует ли акция по датам
  const now = new Date();
  if (data.start_date && new Date(data.start_date) > now) {
    return null;
  }
  if (data.end_date && new Date(data.end_date) < now) {
    return null;
  }
  
  return data;
}