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
-- Роллы
INSERT INTO products (name, description, price, weight, image_url, category_id, is_available) VALUES
('Филадельфия', 'Лосось, сливочный сыр, огурец, рис, нори', 499, '250г', NULL, (SELECT id FROM categories WHERE slug = 'rolls'), true),
('Калифорния', 'Краб, авокадо, огурец, икра тобико, рис, нори', 450, '230г', NULL, (SELECT id FROM categories WHERE slug = 'rolls'), true),
('Дракон', 'Угорь, огурец, авокадо, соус унаги, кунжут, рис, нори', 550, '260г', NULL, (SELECT id FROM categories WHERE slug = 'rolls'), true),
('Радуга', 'Лосось, тунец, креветка, авокадо, огурец, рис, нори', 580, '270г', NULL, (SELECT id FROM categories WHERE slug = 'rolls'), true),
('Запеченный с лососем', 'Лосось, сыр, соус спайси, рис, нори, запекается в печи', 520, '240г', NULL, (SELECT id FROM categories WHERE slug = 'rolls'), true),
('Темпура', 'Тигровая креветка, авокадо, огурец, рис, нори, темпурная панировка', 490, '230г', NULL, (SELECT id FROM categories WHERE slug = 'rolls'), true),
('Унаги Маки', 'Угорь, авокадо, огурец, соус унаги, кунжут, рис, нори', 520, '240г', NULL, (SELECT id FROM categories WHERE slug = 'rolls'), true),
('Аляска', 'Лосось, авокадо, огурец, рис, нори', 480, '230г', NULL, (SELECT id FROM categories WHERE slug = 'rolls'), true),
('Бонито', 'Лосось, авокадо, сыр, бонито хлопья, соус унаги, рис, нори', 510, '250г', NULL, (SELECT id FROM categories WHERE slug = 'rolls'), true),
('Хосомаки с огурцом', 'Огурец, рис, нори', 250, '120г', NULL, (SELECT id FROM categories WHERE slug = 'rolls'), true),
('Спайси с тунцом', 'Тунец, спайси соус, огурец, рис, нори', 480, '230г', NULL, (SELECT id FROM categories WHERE slug = 'rolls'), true),
('Вегетарианский', 'Авокадо, огурец, болгарский перец, салат, рис, нори', 380, '220г', NULL, (SELECT id FROM categories WHERE slug = 'rolls'), true);

-- Суши
INSERT INTO products (name, description, price, weight, image_url, category_id, is_available) VALUES
('Лосось', 'Суши с лососем', 120, '40г', NULL, (SELECT id FROM categories WHERE slug = 'sushi'), true),
('Тунец', 'Суши с тунцом', 130, '40г', NULL, (SELECT id FROM categories WHERE slug = 'sushi'), true),
('Угорь', 'Суши с копченым угрем и соусом унаги', 150, '40г', NULL, (SELECT id FROM categories WHERE slug = 'sushi'), true),
('Креветка', 'Суши с отварной тигровой креветкой', 140, '40г', NULL, (SELECT id FROM categories WHERE slug = 'sushi'), true),
('Гребешок', 'Суши с морским гребешком', 160, '40г', NULL, (SELECT id FROM categories WHERE slug = 'sushi'), true),
('Окунь', 'Суши с морским окунем', 120, '40г', NULL, (SELECT id FROM categories WHERE slug = 'sushi'), true),
('Икра лосося', 'Суши с икрой лосося', 180, '40г', NULL, (SELECT id FROM categories WHERE slug = 'sushi'), true),
('Тобико', 'Суши с летучей рыбой', 150, '40г', NULL, (SELECT id FROM categories WHERE slug = 'sushi'), true),
('Авокадо', 'Суши с авокадо', 90, '40г', NULL, (SELECT id FROM categories WHERE slug = 'sushi'), true),
('Тамаго', 'Суши с японским омлетом', 100, '40г', NULL, (SELECT id FROM categories WHERE slug = 'sushi'), true);

-- Сеты
INSERT INTO products (name, description, price, weight, image_url, category_id, is_available) VALUES
('Сет "Филадельфия"', 'Филадельфия, Калифорния, Аляска - 24 шт', 1299, '950г', NULL, (SELECT id FROM categories WHERE slug = 'sets'), true),
('Сет "Для двоих"', 'Филадельфия, Калифорния, Дракон, Радуга - 32 шт', 1699, '1200г', NULL, (SELECT id FROM categories WHERE slug = 'sets'), true),
('Сет "Хит"', 'Филадельфия, Калифорния, Бонито, Унаги Маки, Темпура - 40 шт', 2199, '1500г', NULL, (SELECT id FROM categories WHERE slug = 'sets'), true),
('Сет "Запеченный"', 'Три вида запеченных роллов - 24 шт', 1399, '1000г', NULL, (SELECT id FROM categories WHERE slug = 'sets'), true),
('Сет "Вегетарианский"', 'Овощные роллы и суши - 22 шт', 1099, '900г', NULL, (SELECT id FROM categories WHERE slug = 'sets'), true),
('Сет "Премиум"', 'Роллы и суши премиум-класса с лососем, тунцом и угрем - 30 шт', 2499, '1300г', NULL, (SELECT id FROM categories WHERE slug = 'sets'), true),
('Сет "Сяке"', 'Роллы и суши с лососем - 28 шт', 1799, '1100г', NULL, (SELECT id FROM categories WHERE slug = 'sets'), true),
('Сет "Классик"', 'Классические роллы - 32 шт', 1599, '1200г', NULL, (SELECT id FROM categories WHERE slug = 'sets'), true);

-- Напитки
INSERT INTO products (name, description, price, weight, image_url, category_id, is_available) VALUES
('Кола', 'Coca-Cola 0.5л', 99, '0.5л', NULL, (SELECT id FROM categories WHERE slug = 'drinks'), true),
('Sprite', 'Sprite 0.5л', 99, '0.5л', NULL, (SELECT id FROM categories WHERE slug = 'drinks'), true),
('Fanta', 'Fanta 0.5л', 99, '0.5л', NULL, (SELECT id FROM categories WHERE slug = 'drinks'), true),
('Вода негазированная', 'Природная вода 0.5л', 69, '0.5л', NULL, (SELECT id FROM categories WHERE slug = 'drinks'), true),
('Вода газированная', 'Газированная вода 0.5л', 69, '0.5л', NULL, (SELECT id FROM categories WHERE slug = 'drinks'), true),
('Зеленый чай', 'Японский зеленый чай', 150, '350мл', NULL, (SELECT id FROM categories WHERE slug = 'drinks'), true),
('Черный чай', 'Японский черный чай', 150, '350мл', NULL, (SELECT id FROM categories WHERE slug = 'drinks'), true),
('Cок апельсиновый', 'Натуральный сок 0.25л', 119, '0.25л', NULL, (SELECT id FROM categories WHERE slug = 'drinks'), true),
('Сок яблочный', 'Натуральный сок 0.25л', 119, '0.25л', NULL, (SELECT id FROM categories WHERE slug = 'drinks'), true),
('Сок вишневый', 'Натуральный сок 0.25л', 119, '0.25л', NULL, (SELECT id FROM categories WHERE slug = 'drinks'), true),
('Лимонад', 'Домашний лимонад', 189, '0.4л', NULL, (SELECT id FROM categories WHERE slug = 'drinks'), true);

-- Добавление тестовых данных для акций
INSERT INTO promotions (title, description, image_url, promo_code, discount_percent, is_active) VALUES
('Скидка 10% на первый заказ', 'Скидка 10% для новых клиентов', '/images/promotions/first-order.jpg', 'FIRST10', 10, true),
('Скидка 15% на сеты', 'Скидка на все сеты до конца недели', '/images/promotions/sets-promo.jpg', 'SETS15', 15, true); 