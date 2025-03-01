/*
  # Seed data for sushi delivery service

  1. Seed Data
    - Categories for menu items
    - Products (sushi, rolls, sets, etc.)
    - Promotions
*/

-- Seed categories
INSERT INTO categories (name, slug, image_url) VALUES
('Сеты', 'sets', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'),
('Роллы', 'rolls', 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'),
('Суши', 'sushi', 'https://images.unsplash.com/photo-1563612116625-3012372fccce?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'),
('Горячие роллы', 'hot', 'https://images.unsplash.com/photo-1562802378-063ec186a863?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'),
('Напитки', 'drinks', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80');

-- Seed products
-- Sets
INSERT INTO products (name, description, price, weight, image_url, category_id, is_available) VALUES
('Сет "Филадельфия"', '32 шт: Филадельфия классик, Филадельфия лайт, Калифорния, Аляска', 1450, '950 г', 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 
  (SELECT id FROM categories WHERE slug = 'sets'), true),
('Сет "Дракон"', '40 шт: Дракон, Калифорния, Филадельфия, Унаги маки, Сяке маки', 1650, '1100 г', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 
  (SELECT id FROM categories WHERE slug = 'sets'), true),
('Сет "Для компании"', '56 шт: Филадельфия, Калифорния, Дракон, Унаги маки, Сяке маки, Текка маки, Авокадо маки', 2200, '1500 г', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 
  (SELECT id FROM categories WHERE slug = 'sets'), true),
('Сет "Хот"', '24 шт: Запеченный лосось, Запеченная креветка, Запеченный угорь, Хот ролл с курицей', 1350, '850 г', 'https://images.unsplash.com/photo-1562802378-063ec186a863?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 
  (SELECT id FROM categories WHERE slug = 'sets'), true);

-- Rolls
INSERT INTO products (name, description, price, weight, image_url, category_id, is_available) VALUES
('Филадельфия', 'Лосось, сливочный сыр, огурец, авокадо', 450, '250 г', 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 
  (SELECT id FROM categories WHERE slug = 'rolls'), true),
('Калифорния', 'Краб, авокадо, огурец, тобико', 420, '230 г', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 
  (SELECT id FROM categories WHERE slug = 'rolls'), true),
('Дракон', 'Угорь, сливочный сыр, авокадо, огурец, унаги соус', 520, '260 г', 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 
  (SELECT id FROM categories WHERE slug = 'rolls'), true),
('Радуга', 'Лосось, тунец, угорь, сливочный сыр, авокадо', 490, '250 г', 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 
  (SELECT id FROM categories WHERE slug = 'rolls'), true);

-- Sushi
INSERT INTO products (name, description, price, weight, image_url, category_id, is_available) VALUES
('Сяке', 'Суши с лососем', 120, '40 г', 'https://images.unsplash.com/photo-1563612116625-3012372fccce?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 
  (SELECT id FROM categories WHERE slug = 'sushi'), true),
('Унаги', 'Суши с угрем', 140, '40 г', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 
  (SELECT id FROM categories WHERE slug = 'sushi'), true),
('Эби', 'Суши с креветкой', 130, '40 г', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 
  (SELECT id FROM categories WHERE slug = 'sushi'), true),
('Тобико', 'Суши с икрой летучей рыбы', 150, '40 г', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 
  (SELECT id FROM categories WHERE slug = 'sushi'), true);

-- Hot rolls
INSERT INTO products (name, description, price, weight, image_url, category_id, is_available) VALUES
('Запеченный лосось', 'Лосось, сливочный сыр, соус спайси, кунжут', 450, '250 г', 'https://images.unsplash.com/photo-1562802378-063ec186a863?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 
  (SELECT id FROM categories WHERE slug = 'hot'), true),
('Запеченная креветка', 'Креветка, сливочный сыр, соус спайси, кунжут', 470, '250 г', 'https://images.unsplash.com/photo-1562802378-063ec186a863?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 
  (SELECT id FROM categories WHERE slug = 'hot'), true);

-- Drinks
INSERT INTO products (name, description, price, weight, image_url, category_id, is_available) VALUES
('Кока-кола', 'Газированный напиток', 120, '500 мл', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 
  (SELECT id FROM categories WHERE slug = 'drinks'), true),
('Зеленый чай', 'Классический зеленый чай', 150, '400 мл', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 
  (SELECT id FROM categories WHERE slug = 'drinks'), true);

-- Seed promotions
INSERT INTO promotions (title, description, image_url, promo_code, discount_percent, start_date, end_date, is_active) VALUES
('Скидка 20% на все сеты', 'Используйте промокод "СЕТИРК" при заказе любого сета и получите скидку 20%. Акция действует при заказе от 1500 ₽.', 
  'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80', 
  'СЕТИРК', 20, '2025-06-01 00:00:00', '2025-06-30 23:59:59', true),
('Бесплатная доставка', 'При заказе от 2000 ₽ доставка бесплатно по всему Иркутску. Акция действует постоянно.', 
  'https://images.unsplash.com/photo-1526367790999-0150786686a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80', 
  NULL, 0, NULL, NULL, true),
('Скидка 10% на самовывоз', 'Заберите заказ самостоятельно из любого нашего ресторана и получите скидку 10% на весь заказ.', 
  'https://images.unsplash.com/photo-1617196034183-421b4917c92d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80', 
  'САМОВЫВОЗ', 10, NULL, NULL, true),
('Счастливые часы', 'Каждый будний день с 14:00 до 17:00 скидка 15% на все меню. Отличная возможность попробовать наши блюда по выгодной цене.', 
  'https://images.unsplash.com/photo-1562802378-063ec186a863?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80', 
  'СЧАСТЛИВЫЕЧАСЫ', 15, NULL, NULL, true);