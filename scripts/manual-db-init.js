/**
 * Скрипт для ручной инициализации базы данных после развертывания
 * Запуск: node scripts/manual-db-init.js
 */

const { Pool } = require('pg');

// Функция для создания соединения с базой данных
function createPool() {
  // Данные для подключения к Neon
  const connectionString = 'postgres://neondb_owner:npg_GCXDOK3Mxg1Z@ep-yellow-boat-a29fvi3m-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require';
  
  console.log(`Подключение к базе данных Neon PostgreSQL: ${connectionString.split('@')[1]}`);
  
  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
}

// Основная функция инициализации базы данных
async function initDatabase() {
  let pool;
  let client;

  try {
    console.log('Подключение к базе данных...');
    pool = createPool();
    client = await pool.connect();
    console.log('Успешное подключение к базе данных Neon');

    // Создание таблиц
    console.log('Создание схемы базы данных...');
    
    // Создание таблицы категорий
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Создание таблицы продуктов
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        weight VARCHAR(50),
        is_available BOOLEAN DEFAULT TRUE,
        category_id VARCHAR(50) REFERENCES categories(id),
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Создание таблицы промоакций
    await client.query(`
      CREATE TABLE IF NOT EXISTS promotions (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        promo_code VARCHAR(50),
        discount_percent INTEGER,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Создание таблицы пользователей
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(100) UNIQUE,
        phone VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Создание таблицы заказов
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(id),
        status VARCHAR(20) NOT NULL,
        total INTEGER NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(20) NOT NULL,
        payment_method VARCHAR(20) NOT NULL,
        delivery_time VARCHAR(50),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Создание таблицы элементов заказа
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id VARCHAR(50) PRIMARY KEY,
        order_id VARCHAR(50) REFERENCES orders(id),
        product_id VARCHAR(50) REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Добавление тестовых данных (только если таблицы пустые)
    const { rows: categoriesCount } = await client.query('SELECT COUNT(*) FROM categories');
    
    if (parseInt(categoriesCount[0].count) === 0) {
      console.log('Добавление тестовых данных...');
      
      // Добавление категорий
      await client.query(`
        INSERT INTO categories (id, name, slug, description) VALUES
        ('cat001', 'Роллы', 'rolls', 'Классические и фирменные роллы'),
        ('cat002', 'Суши', 'sushi', 'Традиционные японские суши'),
        ('cat003', 'Сеты', 'sets', 'Наборы роллов и суши'),
        ('cat004', 'Напитки', 'drinks', 'Напитки к вашему заказу');
      `);
      
      // Добавление продуктов
      await client.query(`
        INSERT INTO products (id, name, description, price, weight, category_id, is_available) VALUES
        ('r001', 'Калифорния', 'Классический ролл с крабом, авокадо и огурцом', 450, '210г', 'cat001', true),
        ('r002', 'Филадельфия', 'Ролл с лососем и сливочным сыром', 520, '250г', 'cat001', true),
        ('r003', 'Дракон', 'Острый ролл с угрем, авокадо и соусом унаги', 580, '240г', 'cat001', true),
        
        ('s001', 'Нигири с лососем', 'Традиционные суши с лососем', 180, '40г', 'cat002', true),
        ('s002', 'Гункан с икрой', 'Суши-корзинка с икрой летучей рыбы', 220, '40г', 'cat002', true),
        ('s003', 'Нигири с угрем', 'Суши с копченым угрем под соусом унаги', 240, '40г', 'cat002', true),
        ('s004', 'Нигири с креветкой', 'Суши с тигровой креветкой', 190, '40г', 'cat002', true),
        
        ('st001', 'Сет Филадельфия', 'Филадельфия, Калифорния и Дракон - 24 кусочка', 1200, '670г', 'cat003', true),
        ('st002', 'Сет Калифорния', 'Разные вариации ролла Калифорния - 32 кусочка', 1350, '720г', 'cat003', true),
        ('st003', 'Сет Ассорти', 'Ассорти из 5 видов роллов - 40 кусочков', 1700, '950г', 'cat003', true),
        ('st004', 'Сет Hot', 'Набор из острых запеченных роллов - 24 кусочка', 1450, '680г', 'cat003', true),
        
        ('d001', 'Зеленый чай', 'Классический зеленый чай', 180, '350мл', 'cat004', true),
        ('d002', 'Кола', 'Coca-Cola', 150, '500мл', 'cat004', true),
        ('d003', 'Спрайт', 'Sprite', 150, '500мл', 'cat004', true);
      `);
      
      // Добавление промоакций
      await client.query(`
        INSERT INTO promotions (id, title, description, promo_code, discount_percent, is_active) VALUES
        ('promo001', 'Скидка 10% на первый заказ', 'Скидка для новых клиентов', 'FIRST10', 10, true),
        ('promo002', 'Скидка 15% на сеты', 'Скидка на все сеты до конца недели', 'SETS15', 15, true);
      `);
    }
    
    console.log('База данных успешно инициализирована');
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    if (pool) {
      await pool.end();
    }
  }
}

// Запуск скрипта
initDatabase().catch(console.error); 