import { Pool } from 'pg';

// Создаем пул соединений с PostgreSQL
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'sushi_db',
});

// Функция для выполнения запросов
export async function query(text: string, params?: any[]) {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Выполнен запрос', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Ошибка при выполнении запроса', error);
    throw error;
  }
}

// Функция для получения категорий
export async function getCategories() {
  try {
    const result = await query('SELECT * FROM categories ORDER BY name');
    return result.rows;
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    return [];
  }
}

// Функция для получения продуктов по категории
export async function getProductsByCategory(categorySlug: string) {
  try {
    const result = await query(
      `SELECT p.* 
       FROM products p 
       JOIN categories c ON p.category_id = c.id 
       WHERE c.slug = $1 AND p.is_available = true 
       ORDER BY p.name`,
      [categorySlug]
    );
    return result.rows;
  } catch (error) {
    console.error(`Ошибка при получении продуктов для категории ${categorySlug}:`, error);
    return [];
  }
}

// Функция для получения всех продуктов
export async function getAllProducts() {
  try {
    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug 
       FROM products p 
       JOIN categories c ON p.category_id = c.id 
       WHERE p.is_available = true 
       ORDER BY p.name`
    );
    return result.rows;
  } catch (error) {
    console.error('Ошибка при получении всех продуктов:', error);
    return [];
  }
}

// Функция для получения популярных продуктов
export async function getPopularProducts(limit = 4) {
  try {
    // Выбираем популярные продукты из разных категорий
    const result = await query(
      `WITH ProductsByCategory AS (
         SELECT 
           p.*,
           c.name as category_name,
           c.slug as category_slug,
           ROW_NUMBER() OVER (PARTITION BY c.slug ORDER BY p.name) as row_num
         FROM products p 
         JOIN categories c ON p.category_id = c.id 
         WHERE p.is_available = true
       )
       SELECT * FROM ProductsByCategory
       WHERE (category_slug = 'rolls' AND row_num <= 2)
          OR (category_slug = 'sets' AND row_num = 1)
          OR (category_slug = 'sushi' AND row_num = 1)
       ORDER BY 
         CASE 
           WHEN category_slug = 'rolls' THEN 1
           WHEN category_slug = 'sets' THEN 2
           WHEN category_slug = 'sushi' THEN 3
           ELSE 4
         END
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  } catch (error) {
    console.error('Ошибка при получении популярных продуктов:', error);
    return [];
  }
}

// Функция для получения акций
export async function getPromotions() {
  try {
    const result = await query(
      `SELECT * FROM promotions 
       WHERE is_active = true 
       ORDER BY created_at DESC`
    );
    return result.rows;
  } catch (error) {
    console.error('Ошибка при получении акций:', error);
    return [];
  }
}

// Функция для создания заказа
export async function createOrder(orderData: any) {
  try {
    const { user_id, total, address, phone, payment_method, delivery_time, comment } = orderData;
    
    const result = await query(
      `INSERT INTO orders 
         (user_id, total, address, phone, payment_method, delivery_time, comment) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [user_id, total, address, phone, payment_method, delivery_time, comment]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    throw error;
  }
}

// Функция для создания элементов заказа
export async function createOrderItems(orderItems: any[]) {
  try {
    const values = orderItems.map(item => {
      return `('${item.order_id}', '${item.product_id}', ${item.quantity}, ${item.price})`;
    }).join(', ');
    
    const result = await query(
      `INSERT INTO order_items (order_id, product_id, quantity, price) 
       VALUES ${values} 
       RETURNING *`
    );
    
    return result.rows;
  } catch (error) {
    console.error('Ошибка при создании элементов заказа:', error);
    throw error;
  }
}

// Функция для получения заказов пользователя
export async function getUserOrders(userId: string) {
  try {
    const result = await query(
      `SELECT o.*, 
              json_agg(
                json_build_object(
                  'id', oi.id,
                  'quantity', oi.quantity,
                  'price', oi.price,
                  'product', (
                    SELECT json_build_object(
                      'id', p.id,
                      'name', p.name,
                      'price', p.price,
                      'image_url', p.image_url
                    )
                    FROM products p
                    WHERE p.id = oi.product_id
                  )
                )
              ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Ошибка при получении заказов пользователя:', error);
    return [];
  }
}

// Функция для проверки промокода
export async function checkPromoCode(promoCode: string) {
  try {
    const result = await query(
      `SELECT * FROM promotions 
       WHERE promo_code = $1 AND is_active = true`,
      [promoCode]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const promo = result.rows[0];
    
    // Проверяем, действует ли акция по датам
    const now = new Date();
    if (promo.start_date && new Date(promo.start_date) > now) {
      return null;
    }
    if (promo.end_date && new Date(promo.end_date) < now) {
      return null;
    }
    
    return promo;
  } catch (error) {
    console.error('Ошибка при проверке промокода:', error);
    return null;
  }
}

// При необходимости добавьте эту функцию в начало файла
export function getLocalImageUrl(path: string): string {
  // Если URL уже полный (начинается с http или https), возвращаем его без изменений
  if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
    return path;
  }
  
  // Если путь начинается с "/", убираем "/"
  if (path && path.startsWith('/')) {
    path = path.substring(1);
  }
  
  // Если путь не указан, возвращаем путь к изображению по умолчанию
  if (!path) {
    return '/images/default-product.jpg';
  }
  
  // Возвращаем локальный путь
  return `/${path}`;
} 