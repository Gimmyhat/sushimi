import { Pool, PoolClient } from 'pg';

// Определение пула соединений, который может использоваться повторно
let pool: Pool | null = null;

// Таймаут для повторных попыток подключения в мс
const RETRY_TIMEOUT = 500;
const MAX_RETRIES = 5;

// Функция для получения пула соединений
export function getPool(): Pool {
  if (pool) return pool;

  // Используем строку подключения, если она доступна (Vercel с Neon)
  if (process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.USE_SSL === 'false' ? false : { rejectUnauthorized: false },
      max: 20, // уменьшаем для serverless
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  } else {
    // Используем индивидуальные параметры (локальное окружение)
    pool = new Pool({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DATABASE || process.env.POSTGRES_DB,
      ssl: process.env.USE_SSL === 'true' ? { rejectUnauthorized: false } : false,
      max: 20, 
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  // Обработка ошибок подключения
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    pool = null;
  });

  return pool;
}

// Функция для выполнения запросов с повторными попытками
export async function query(text: string, params?: any[], retries = 0): Promise<any> {
  const currentPool = getPool();
  let client: PoolClient | null = null;

  try {
    client = await currentPool.connect();
    const result = await client.query(text, params);
    return result;
  } catch (error: any) {
    // Если ошибка связана с подключением и не превышено количество попыток, повторяем
    if (error.code === 'ECONNREFUSED' && retries < MAX_RETRIES) {
      console.warn(`Подключение не удалось, повторная попытка ${retries + 1}/${MAX_RETRIES}...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_TIMEOUT));
      return query(text, params, retries + 1);
    }
    
    // Проверка на истечение срока действия соединения
    if (error.code === '57P01' && retries < MAX_RETRIES) {
      console.warn(`Соединение было разорвано, повторная попытка ${retries + 1}/${MAX_RETRIES}...`);
      // Сбросить глобальный пул соединений
      pool = null;
      await new Promise(resolve => setTimeout(resolve, RETRY_TIMEOUT));
      return query(text, params, retries + 1);
    }
    
    console.error('Ошибка при выполнении запроса:', error);
    throw error;
  } finally {
    if (client) client.release();
  }
}

// Функция для получения категорий
export async function getCategories() {
  try {
    // Пытаемся получить категории из базы данных
    try {
      const result = await query('SELECT * FROM categories ORDER BY name');
      // Если в базе есть данные, возвращаем их
      if (result.rows && result.rows.length > 0) {
        return result.rows;
      }
    } catch (dbError) {
      console.error('Ошибка при получении категорий из БД:', dbError);
      // Продолжаем выполнение, чтобы вернуть тестовые данные
    }
    
    // Если в базе нет данных или произошла ошибка, возвращаем тестовые категории
    return [
      {
        id: 'cat1',
        name: 'Роллы',
        slug: 'rolls',
        description: 'Классические и фирменные роллы',
        image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop'
      },
      {
        id: 'cat2',
        name: 'Суши',
        slug: 'sushi',
        description: 'Традиционные японские суши',
        image_url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1000&auto=format&fit=crop'
      },
      {
        id: 'cat3',
        name: 'Сеты',
        slug: 'sets',
        description: 'Наборы из нескольких видов роллов и суши',
        image_url: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=1000&auto=format&fit=crop'
      },
      {
        id: 'cat4',
        name: 'Напитки',
        slug: 'drinks',
        description: 'Напитки к вашему заказу',
        image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1000&auto=format&fit=crop'
      }
    ];
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    return [];
  }
}

// Функция для получения продуктов по категории
export async function getProductsByCategory(categorySlug: string) {
  try {
    console.log(`DB: Запрошены продукты для категории ${categorySlug}`);
    
    // Попробуем получить данные из базы данных
    try {
      const result = await query(
        `SELECT p.* 
         FROM products p 
         JOIN categories c ON p.category_id = c.id 
         WHERE c.slug = $1 AND p.is_available = true 
         ORDER BY p.name`,
        [categorySlug]
      );
      
      // Если есть данные в базе, возвращаем их
      if (result.rows && result.rows.length > 0) {
        console.log(`DB: Найдено ${result.rows.length} продуктов в БД`);
        return result.rows;
      }
    } catch (dbError) {
      console.error(`Ошибка при получении данных из БД для категории ${categorySlug}:`, dbError);
      // Продолжаем выполнение и возвращаем тестовые данные
    }
    
    console.log(`DB: Генерируем тестовые данные для категории ${categorySlug}`);
    // Если нет данных в базе или произошла ошибка, возвращаем тестовые данные
    // Генерируем фиктивные данные в зависимости от категории
    let testData: any[] = [];
    
    switch (categorySlug) {
      case 'rolls':
        testData = [
          {
            id: 'r001',
            name: 'Филадельфия классик',
            description: 'Классический ролл с лососем, сливочным сыром, огурцом и авокадо',
            price: 590,
            weight: '280 г',
            is_available: true,
            category_id: 'cat1',
            category_slug: 'rolls'
          },
          {
            id: 'r002',
            name: 'Калифорния',
            description: 'Ролл с крабовым мясом, авокадо, огурцом и икрой тобико',
            price: 490,
            weight: '260 г',
            is_available: true,
            category_id: 'cat1',
            category_slug: 'rolls'
          },
          {
            id: 'r003',
            name: 'Дракон',
            description: 'Ролл с угрем, огурцом, сливочным сыром, авокадо и соусом унаги',
            price: 640,
            weight: '290 г',
            is_available: true,
            category_id: 'cat1',
            category_slug: 'rolls'
          },
          {
            id: 'r004',
            name: 'Спайси лосось',
            description: 'Острый ролл с лососем, огурцом и спайси соусом',
            price: 450,
            weight: '240 г',
            is_available: true,
            category_id: 'cat1',
            category_slug: 'rolls'
          },
          {
            id: 'r005',
            name: 'Радуга',
            description: 'Ролл с разными видами рыбы (лосось, тунец, угорь), авокадо и огурцом',
            price: 670,
            weight: '300 г',
            is_available: true,
            category_id: 'cat1',
            category_slug: 'rolls'
          },
          {
            id: 'r006',
            name: 'Темпура с креветкой',
            description: 'Жареный ролл с креветкой, сливочным сыром, авокадо и соусом унаги',
            price: 580,
            weight: '270 г',
            is_available: true,
            category_id: 'cat1',
            category_slug: 'rolls'
          }
        ];
        break;
        
      case 'sushi':
        testData = [
          {
            id: 's001',
            name: 'Нигири с лососем',
            description: 'Классические суши с рисом и свежим лососем',
            price: 190,
            weight: '35 г',
            is_available: true,
            category_id: 'cat2',
            category_slug: 'sushi'
          },
          {
            id: 's002',
            name: 'Нигири с тунцом',
            description: 'Классические суши с рисом и свежим тунцом',
            price: 210,
            weight: '35 г',
            is_available: true,
            category_id: 'cat2',
            category_slug: 'sushi'
          },
          {
            id: 's003',
            name: 'Нигири с угрем',
            description: 'Классические суши с рисом и копченым угрем под соусом унаги',
            price: 230,
            weight: '40 г',
            is_available: true,
            category_id: 'cat2',
            category_slug: 'sushi'
          },
          {
            id: 's004',
            name: 'Нигири с креветкой',
            description: 'Классические суши с рисом и отварной креветкой',
            price: 200,
            weight: '35 г',
            is_available: true,
            category_id: 'cat2',
            category_slug: 'sushi'
          },
          {
            id: 's005',
            name: 'Гункан с икрой лосося',
            description: 'Суши-корзинка с рисом и красной икрой',
            price: 290,
            weight: '40 г',
            is_available: true,
            category_id: 'cat2',
            category_slug: 'sushi'
          }
        ];
        break;
        
      case 'sets':
        testData = [
          {
            id: 'st001',
            name: 'Сет Филадельфия',
            description: 'Большой сет из 4 видов роллов с лососем: Филадельфия классик, Филадельфия с огурцом, Филадельфия с авокадо, Филадельфия спайси',
            price: 1590,
            weight: '1050 г',
            is_available: true,
            category_id: 'cat3',
            category_slug: 'sets'
          },
          {
            id: 'st002',
            name: 'Сет Калифорния',
            description: 'Набор из классической Калифорнии и её вариаций с разными начинками',
            price: 1490,
            weight: '980 г',
            is_available: true,
            category_id: 'cat3',
            category_slug: 'sets'
          },
          {
            id: 'st003',
            name: 'Сет Ассорти',
            description: 'Большой сет из самых популярных роллов: Филадельфия, Калифорния, Дракон и Радуга',
            price: 1890,
            weight: '1120 г',
            is_available: true,
            category_id: 'cat3',
            category_slug: 'sets'
          },
          {
            id: 'st004',
            name: 'Сет Hot',
            description: 'Набор из горячих жареных роллов с различными начинками',
            price: 1690,
            weight: '1050 г',
            is_available: true,
            category_id: 'cat3',
            category_slug: 'sets'
          }
        ];
        break;
        
      case 'drinks':
        testData = [
          {
            id: 'd001',
            name: 'Чай зеленый',
            description: 'Традиционный японский зеленый чай',
            price: 190,
            weight: '400 мл',
            is_available: true,
            category_id: 'cat4',
            category_slug: 'drinks'
          },
          {
            id: 'd002',
            name: 'Кока-кола',
            description: 'Кока-кола классическая',
            price: 150,
            weight: '500 мл',
            is_available: true,
            category_id: 'cat4',
            category_slug: 'drinks'
          },
          {
            id: 'd003',
            name: 'Спрайт',
            description: 'Газированный напиток Спрайт',
            price: 150,
            weight: '500 мл',
            is_available: true,
            category_id: 'cat4',
            category_slug: 'drinks'
          },
          {
            id: 'd004',
            name: 'Сок апельсиновый',
            description: 'Натуральный апельсиновый сок',
            price: 190,
            weight: '500 мл',
            is_available: true,
            category_id: 'cat4',
            category_slug: 'drinks'
          },
          {
            id: 'd005',
            name: 'Сок яблочный',
            description: 'Натуральный яблочный сок',
            price: 190,
            weight: '500 мл',
            is_available: true,
            category_id: 'cat4',
            category_slug: 'drinks'
          }
        ];
        break;
        
      default:
        testData = [];
    }
    
    console.log(`DB: Возвращаем ${testData.length} тестовых продуктов для категории ${categorySlug}`);
    return testData;
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
    // Пытаемся получить данные из базы данных
    try {
      const result = await query(
        `SELECT p.*, c.name as category_name, c.slug as category_slug 
         FROM products p 
         JOIN categories c ON p.category_id = c.id 
         WHERE p.is_available = true 
         ORDER BY p.popularity DESC, p.price DESC
         LIMIT $1`,
        [limit]
      );
      
      // Если есть данные в базе, возвращаем их
      if (result.rows && result.rows.length > 0) {
        return result.rows;
      }
    } catch (dbError) {
      console.error(`Ошибка при получении популярных продуктов из БД:`, dbError);
      // Продолжаем выполнение и возвращаем тестовые данные
    }
    
    // Если нет данных в базе или произошла ошибка, возвращаем тестовые данные
    return [
      {
        id: 'r001',
        name: 'Филадельфия классик',
        description: 'Классический ролл с лососем, сливочным сыром, огурцом и авокадо',
        price: 590,
        weight: '280 г',
        is_available: true,
        category_id: 'cat1',
        category_name: 'Роллы',
        category_slug: 'rolls',
        popularity: 100
      },
      {
        id: 'r002',
        name: 'Калифорния',
        description: 'Ролл с крабовым мясом, авокадо, огурцом и икрой тобико',
        price: 490,
        weight: '260 г',
        is_available: true,
        category_id: 'cat1',
        category_name: 'Роллы',
        category_slug: 'rolls',
        popularity: 95
      },
      {
        id: 'st001',
        name: 'Сет Филадельфия',
        description: 'Большой сет из 4 видов роллов с лососем',
        price: 1590,
        weight: '1050 г',
        is_available: true,
        category_id: 'cat3',
        category_name: 'Сеты',
        category_slug: 'sets',
        popularity: 90
      },
      {
        id: 's001',
        name: 'Нигири с лососем',
        description: 'Классические суши с рисом и свежим лососем',
        price: 190,
        weight: '35 г',
        is_available: true,
        category_id: 'cat2',
        category_name: 'Суши',
        category_slug: 'sushi',
        popularity: 85
      }
    ];
  } catch (error) {
    console.error('Ошибка при получении популярных продуктов:', error);
    return [];
  }
}

// Функция для получения акций
export async function getPromotions() {
  try {
    // Пытаемся получить данные из базы данных
    try {
      const result = await query(
        `SELECT * FROM promotions 
         WHERE is_active = true 
         AND (end_date IS NULL OR end_date >= CURRENT_DATE)
         AND (start_date IS NULL OR start_date <= CURRENT_DATE)
         ORDER BY created_at DESC`
      );
      
      // Если есть данные в базе, возвращаем их
      if (result.rows && result.rows.length > 0) {
        return result.rows;
      }
    } catch (dbError) {
      console.error('Ошибка при получении акций из БД:', dbError);
      // Продолжаем выполнение для возврата тестовых данных
    }
    
    // Возвращаем тестовые данные об акциях
    return [
      {
        id: 'promo1',
        title: 'Скидка 10% на первый заказ',
        description: 'Воспользуйтесь промокодом SUSHIMI10 и получите скидку 10% на ваш первый заказ.',
        image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop',
        promo_code: 'SUSHIMI10',
        discount_percent: 10,
        is_active: true,
        start_date: new Date('2023-01-01').toISOString(),
        end_date: new Date('2025-12-31').toISOString(),
        created_at: new Date('2023-01-01').toISOString()
      },
      {
        id: 'promo2',
        title: 'Скидка 20% на роллы',
        description: 'Скидка 20% на все роллы при использовании промокода ROLL20. Акция действует на все роллы в нашем меню.',
        image_url: 'https://images.unsplash.com/photo-1563612116625-3012372fccce?q=80&w=1000&auto=format&fit=crop',
        promo_code: 'ROLL20',
        discount_percent: 20,
        is_active: true,
        start_date: new Date('2023-01-01').toISOString(),
        end_date: new Date('2025-12-31').toISOString(),
        created_at: new Date('2023-01-02').toISOString()
      },
      {
        id: 'promo3',
        title: 'Скидка 15% на сеты',
        description: 'Закажите любой сет и получите скидку 15% с промокодом SET15. Отличная возможность попробовать разные виды роллов.',
        image_url: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=1000&auto=format&fit=crop',
        promo_code: 'SET15',
        discount_percent: 15,
        is_active: true,
        start_date: new Date('2023-01-01').toISOString(),
        end_date: new Date('2025-12-31').toISOString(),
        created_at: new Date('2023-01-03').toISOString()
      }
    ];
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
    // Пытаемся получить данные из базы данных
    try {
      const result = await query(
        `SELECT * FROM promotions 
         WHERE promo_code = $1 
         AND is_active = true 
         AND (end_date IS NULL OR end_date >= CURRENT_DATE)
         AND (start_date IS NULL OR start_date <= CURRENT_DATE)`,
        [promoCode]
      );
      
      // Если есть данные в базе, возвращаем их
      if (result.rows && result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (dbError) {
      console.error(`Ошибка при проверке промокода ${promoCode} в БД:`, dbError);
      // Продолжаем выполнение для проверки тестовых промокодов
    }
    
    // Тестовые данные для промокодов
    if (promoCode.toUpperCase() === 'SUSHIMI10') {
      return {
        id: 'promo1',
        title: 'Скидка 10% на первый заказ',
        description: 'Скидка 10% на первый заказ при использовании промокода SUSHIMI10',
        promo_code: 'SUSHIMI10',
        discount_percent: 10,
        is_active: true,
        start_date: new Date('2023-01-01').toISOString(),
        end_date: new Date('2025-12-31').toISOString()
      };
    } else if (promoCode.toUpperCase() === 'ROLL20') {
      return {
        id: 'promo2',
        title: 'Скидка 20% на роллы',
        description: 'Скидка 20% на все роллы при использовании промокода ROLL20',
        promo_code: 'ROLL20',
        discount_percent: 20,
        is_active: true,
        start_date: new Date('2023-01-01').toISOString(),
        end_date: new Date('2025-12-31').toISOString()
      };
    } else if (promoCode.toUpperCase() === 'SET15') {
      return {
        id: 'promo3',
        title: 'Скидка 15% на сеты',
        description: 'Скидка 15% на все сеты при использовании промокода SET15',
        promo_code: 'SET15',
        discount_percent: 15,
        is_active: true,
        start_date: new Date('2023-01-01').toISOString(),
        end_date: new Date('2025-12-31').toISOString()
      };
    }
    
    // Если промокод не найден
    return null;
  } catch (error) {
    console.error(`Ошибка при проверке промокода ${promoCode}:`, error);
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