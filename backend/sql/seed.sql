CREATE DATABASE IF NOT EXISTS fastbite;
USE fastbite;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  city VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  city VARCHAR(100),
  address TEXT,
  cuisine VARCHAR(100),
  avg_rating DECIMAL(2,1),
  cover_image VARCHAR(512)
);

CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT,
  name VARCHAR(255),
  price DECIMAL(10,2),
  veg BOOLEAN DEFAULT TRUE,
  description TEXT,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS carts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  restaurant_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT,
  menu_item_id INT,
  quantity INT DEFAULT 1,
  notes TEXT,
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  restaurant_id INT,
  total DECIMAL(10,2),
  status VARCHAR(30) DEFAULT 'placed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment_method VARCHAR(30),
  payment_id VARCHAR(255),
  address TEXT
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  menu_item_id INT,
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

INSERT IGNORE INTO restaurants (id,name,city,address,cuisine,avg_rating,cover_image) VALUES
(1,'Tasty Bites','Guntur','MG Road','South Indian',4.2,''),(2,'Spice Hub','Guntur','Reddy Colony','North Indian',4.0,'');

INSERT IGNORE INTO menu_items (restaurant_id,name,price,veg,description) VALUES
(1,'Idly Sambar',50.00,1,'Soft idly with sambar'),
(1,'Dosa',70.00,1,'Crispy dosa'),
(2,'Paneer Butter Masala',180.00,1,'Creamy paneer'),
(2,'Butter Naan',40.00,1,'Soft naan');
