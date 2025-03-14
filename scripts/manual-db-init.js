/**
 * Скрипт для ручной инициализации базы данных
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Функция для создания соединения с базой данных с явно указанными параметрами
function createPool() {
  // Используем явно указанные параметры
  const user = 'postgres';
  const password = 'postgres';
  const host = 'localhost';
  const port = 5433;
  const database = 'sushi_db';
  
  console.log(`Подключение к базе данных: ${host}:${port}`);
  
  // Использование индивидуальных параметров
  return new Pool({
    user,
    password,
    host,
    port,
    database,
    ssl: false,
    // Добавляем таймаут для подключения
    connectionTimeoutMillis: 5000
  });
}

// Функция для чтения SQL файла
function readSQL(filename) {
  return fs.readFileSync(path.join(__dirname, '..', 'sql', filename), 'utf8');
}

// Функция для попытки подключения с повторами
async function connectWithRetry(maxRetries = 5, retryInterval = 3000) {
  let lastError;
  let pool;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Попытка подключения к базе данных (${attempt}/${maxRetries})...`);
      pool = createPool();
      
      // Проверка соединения
      await pool.query('SELECT NOW()');
      console.log('Соединение с базой данных установлено успешно.');
      return pool;
    } catch (error) {
      lastError = error;
      console.error(`Ошибка подключения: ${error.message}`);
      
      if (pool) {
        try {
          await pool.end();
        } catch (endError) {
          // Игнорируем ошибки при закрытии пула
        }
      }
      
      if (attempt < maxRetries) {
        console.log(`Повторная попытка через ${retryInterval/1000} секунд...`);
        await new Promise(resolve => setTimeout(resolve, retryInterval));
      }
    }
  }
  
  throw new Error(`Не удалось подключиться к базе данных после ${maxRetries} попыток: ${lastError.message}`);
}

// Основная функция инициализации базы данных
async function initDatabase() {
  console.log('Подключение к базе данных...');
  let pool;
  
  try {
    // Подключаемся с повторными попытками
    pool = await connectWithRetry();
    
    // Удаляем существующие таблицы, если они есть
    console.log('Удаление существующих таблиц...');
    await pool.query(`
      DROP TABLE IF EXISTS order_items CASCADE;
      DROP TABLE IF EXISTS orders CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS promotions CASCADE;
    `);
    console.log('Существующие таблицы удалены.');
    
    // Создание таблиц
    console.log('Создание таблиц...');
    
    // Таблица категорий
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Таблица categories создана.');
    
    // Таблица продуктов
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        weight VARCHAR(50),
        image_url TEXT,
        category_id INTEGER REFERENCES categories(id),
        is_available BOOLEAN DEFAULT TRUE,
        popularity INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Таблица products создана.');
    
    // Таблица пользователей
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        phone VARCHAR(20) UNIQUE,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Таблица users создана.');
    
    // Таблица заказов
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        address TEXT NOT NULL,
        phone VARCHAR(20) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        delivery_time VARCHAR(100) NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Таблица orders создана.');
    
    // Таблица элементов заказа
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Таблица order_items создана.');
    
    // Таблица акций
    await pool.query(`
      CREATE TABLE IF NOT EXISTS promotions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        image_url TEXT,
        promo_code VARCHAR(50) UNIQUE,
        discount_percent INTEGER,
        is_active BOOLEAN DEFAULT TRUE,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Таблица promotions создана.');
    
    // Заполнение тестовыми данными
    console.log('Заполнение таблиц тестовыми данными...');
    
    // Добавление категорий
    await pool.query(`
      INSERT INTO categories (name, slug, description, image_url)
      VALUES 
        ('Роллы', 'rolls', 'Классические и фирменные роллы', '/images/categories/category-rolls.jpg'),
        ('Суши', 'sushi', 'Традиционные японские суши', '/images/categories/category-sushi.jpg'),
        ('Сеты', 'sets', 'Наборы из нескольких видов роллов и суши', '/images/categories/category-sets.jpg'),
        ('Напитки', 'drinks', 'Напитки к вашему заказу', '/images/categories/category-drinks.jpg')
      ON CONFLICT (slug) DO NOTHING
    `);
    console.log('Категории добавлены.');
    
    // Добавление продуктов
    await pool.query(`
      INSERT INTO products (name, description, price, weight, category_id, image_url, popularity)
      VALUES 
        ('Филадельфия классик', 'Классический ролл с лососем, сливочным сыром, огурцом и авокадо', 590, '280 г', 1, '/images/products/rolls/philadelphia.jpg', 10),
        ('Калифорния', 'Ролл с крабовым мясом, авокадо, огурцом и икрой тобико', 490, '260 г', 1, '/images/products/rolls/california.jpg', 9),
        ('Дракон', 'Ролл с угрем, огурцом, сливочным сыром, авокадо и соусом унаги', 640, '290 г', 1, '/images/products/rolls/dragon.jpg', 8),
        ('Спайси лосось', 'Острый ролл с лососем, огурцом и спайси соусом', 450, '240 г', 1, '/images/products/rolls/spicy-salmon.jpg', 7),
        ('Нигири с лососем', 'Классические суши с рисом и свежим лососем', 190, '35 г', 2, '/images/products/sushi/nigiri-salmon.jpg', 6),
        ('Нигири с тунцом', 'Классические суши с рисом и свежим тунцом', 210, '35 г', 2, '/images/products/sushi/nigiri-tuna.jpg', 5),
        ('Нигири с креветкой', 'Классические суши с рисом и отварной креветкой', 200, '35 г', 2, '/images/products/sushi/nigiri-shrimp.jpg', 4),
        ('Сет Филадельфия', 'Большой сет из 4 видов роллов с лососем', 1590, '1050 г', 3, '/images/products/sets/philadelphia-set.jpg', 10),
        ('Сет Калифорния', 'Набор из классической Калифорнии и её вариаций с разными начинками', 1490, '980 г', 3, '/images/products/sets/california-set.jpg', 9),
        ('Сет Ассорти', 'Большой сет из самых популярных роллов', 1890, '1120 г', 3, '/images/products/sets/assorted-set.jpg', 8),
        ('Чай зеленый', 'Традиционный японский зеленый чай', 190, '400 мл', 4, '/images/products/drinks/green-tea.jpg', 3),
        ('Кока-кола', 'Кока-кола классическая', 150, '500 мл', 4, '/images/products/drinks/cola.jpg', 7),
        ('Спрайт', 'Газированный напиток Спрайт', 150, '500 мл', 4, '/images/products/drinks/sprite.jpg', 6)
    `);
    console.log('Продукты добавлены.');
    
    // Добавление акций
    await pool.query(`
      INSERT INTO promotions (title, description, image_url, promo_code, discount_percent, is_active)
      VALUES 
        ('Скидка 15% на первый заказ', 'Скидка 15% на первый заказ через наш сайт', '/images/promotions/promo-first-order.jpg', 'FIRST15', 15, TRUE),
        ('Бесплатная доставка', 'Бесплатная доставка при заказе от 2000 рублей', '/images/promotions/promo-free-delivery.jpg', 'FREE', 0, TRUE),
        ('Скидка 10% в день рождения', 'Скидка 10% в день рождения при предъявлении документа', '/images/promotions/promo-birthday.jpg', 'BIRTHDAY10', 10, TRUE)
      ON CONFLICT (promo_code) DO NOTHING
    `);
    console.log('Акции добавлены.');
    
    console.log('База данных успешно инициализирована!');
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
    throw error;
  } finally {
    // Закрытие соединения
    await pool.end();
    console.log('Соединение с базой данных закрыто.');
  }
}

// Запуск инициализации
initDatabase().catch(err => {
  console.error('Ошибка при инициализации базы данных:', err);
  process.exit(1);
}); 