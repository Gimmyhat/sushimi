// Функция для получения категорий
export async function getCategories() {
  try {
    const response = await fetch('/api/categories');
    if (!response.ok) {
      throw new Error('Ошибка при получении категорий');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Функция для получения продуктов по категории
export async function getProductsByCategory(categorySlug: string) {
  try {
    const response = await fetch(`/api/products/category?slug=${categorySlug}`);
    if (!response.ok) {
      throw new Error(`Ошибка при получении продуктов для категории ${categorySlug}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching products for category ${categorySlug}:`, error);
    return [];
  }
}

// Функция для получения популярных продуктов
export async function getPopularProducts() {
  try {
    const response = await fetch('/api/products/popular');
    if (!response.ok) {
      throw new Error('Ошибка при получении популярных продуктов');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching popular products:', error);
    return [];
  }
}

// Функция для получения акций
export async function getPromotions() {
  try {
    const response = await fetch('/api/promotions');
    if (!response.ok) {
      throw new Error('Ошибка при получении акций');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return [];
  }
}

// Функция для проверки промокода
export async function checkPromoCode(promoCode: string) {
  try {
    const response = await fetch(`/api/promo/check?code=${promoCode}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Ошибка при проверке промокода');
    }
    return await response.json();
  } catch (error) {
    console.error('Error checking promo code:', error);
    return null;
  }
}

// Функция для создания заказа
export async function createOrder(orderData: any, orderItems: any[]) {
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
    
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
} 