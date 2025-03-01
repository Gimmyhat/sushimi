-- Создание таблицы users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  phone TEXT,
  name TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Создание таблицы categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Создание таблицы products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  weight TEXT,
  image_url TEXT,
  category_id UUID REFERENCES categories(id),
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Создание таблицы orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  total INTEGER NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  delivery_time TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Создание таблицы order_items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Создание таблицы promotions
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  promo_code TEXT UNIQUE,
  discount_percent INTEGER NOT NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Добавление тестовых данных для категорий
INSERT INTO categories (name, slug, image_url) VALUES
('Роллы', 'rolls', '/images/categories/rolls.jpg'),
('Суши', 'sushi', '/images/categories/sushi.jpg'),
('Сеты', 'sets', '/images/categories/sets.jpg'),
('Напитки', 'drinks', '/images/categories/drinks.jpg');

-- Добавление тестовых данных для продуктов
INSERT INTO products (name, description, price, weight, image_url, category_id, is_available) VALUES
('Филадельфия', 'Лосось, сливочный сыр, огурец, рис, нори', 499, '250г', '/images/products/philadelphia.jpg', (SELECT id FROM categories WHERE slug = 'rolls'), true),
('Калифорния', 'Краб, авокадо, огурец, икра тобико, рис, нори', 450, '230г', '/images/products/california.jpg', (SELECT id FROM categories WHERE slug = 'rolls'), true),
('Лосось', 'Суши с лососем', 120, '40г', '/images/products/salmon.jpg', (SELECT id FROM categories WHERE slug = 'sushi'), true),
('Сет "Филадельфия"', 'Филадельфия, Калифорния, Аляска - 24 шт', 1299, '950г', '/images/products/philadelphia-set.jpg', (SELECT id FROM categories WHERE slug = 'sets'), true),
('Кола', 'Coca-Cola 0.5л', 99, '0.5л', '/images/products/cola.jpg', (SELECT id FROM categories WHERE slug = 'drinks'), true);

-- Добавление тестовых данных для акций
INSERT INTO promotions (title, description, image_url, promo_code, discount_percent, is_active) VALUES
('Скидка 10% на первый заказ', 'Скидка 10% для новых клиентов', '/images/promotions/first-order.jpg', 'FIRST10', 10, true),
('Скидка 15% на сеты', 'Скидка на все сеты до конца недели', '/images/promotions/sets-promo.jpg', 'SETS15', 15, true); 