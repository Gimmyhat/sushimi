/*
  # Initial schema for sushi delivery service

  1. New Tables
    - `users` - Store user information
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `phone` (text)
      - `name` (text)
      - `address` (text)
      - `created_at` (timestamp)
    - `categories` - Product categories
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `image_url` (text)
      - `created_at` (timestamp)
    - `products` - Sushi and other menu items
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (integer)
      - `weight` (text)
      - `image_url` (text)
      - `category_id` (uuid, foreign key)
      - `is_available` (boolean)
      - `created_at` (timestamp)
    - `orders` - Customer orders
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `status` (text)
      - `total` (integer)
      - `address` (text)
      - `phone` (text)
      - `payment_method` (text)
      - `delivery_time` (text)
      - `comment` (text)
      - `created_at` (timestamp)
    - `order_items` - Items in each order
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `price` (integer)
      - `created_at` (timestamp)
    - `promotions` - Promotional offers
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `promo_code` (text)
      - `discount_percent` (integer)
      - `start_date` (timestamp)
      - `end_date` (timestamp)
      - `is_active` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policies for public access to categories and products
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  phone text,
  name text,
  address text,
  created_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price integer NOT NULL,
  weight text,
  image_url text,
  category_id uuid REFERENCES categories(id),
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  status text NOT NULL DEFAULT 'pending',
  total integer NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  payment_method text NOT NULL,
  delivery_time text,
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  price integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  promo_code text UNIQUE,
  discount_percent integer NOT NULL,
  start_date timestamptz,
  end_date timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Create policies for users
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for categories (public read access)
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for products (public read access)
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for orders
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create policies for order_items
CREATE POLICY "Users can view their own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- Create policies for promotions (public read access)
CREATE POLICY "Promotions are viewable by everyone"
  ON promotions
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);