-- Create database
CREATE DATABASE IF NOT EXISTS neplink;
USE neplink;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('user', 'owner', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create marketplace table
CREATE TABLE IF NOT EXISTS marketplace (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    condition VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    images JSON,
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    description TEXT NOT NULL,
    requirements JSON,
    contact_email VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20),
    posted_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id)
);

-- Create rentals table
CREATE TABLE IF NOT EXISTS rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    rent DECIMAL(10, 2) NOT NULL,
    bedrooms INT NOT NULL,
    bathrooms INT NOT NULL,
    area INT NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip VARCHAR(20),
    amenities JSON,
    images JSON,
    contact_person VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20),
    owner_id INT,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Insert sample data
INSERT IGNORE INTO users (name, email, password, user_type) VALUES
('Admin User', 'admin@neplink.com', '$2b$10$8K1p/a0dURXAm7QiTRqNa.E3YPWsKGHJrTJE29YZB8qJwE1uF3c9S', 'admin'),
('John Doe', 'john@example.com', '$2b$10$8K1p/a0dURXAm7QiTRqNa.E3YPWsKGHJrTJE29YZB8qJwE1uF3c9S', 'user'),
('Business Owner', 'owner@neplink.com', '$2b$10$8K1p/a0dURXAm7QiTRqNa.E3YPWsKGHJrTJE29YZB8qJwE1uF3c9S', 'owner');