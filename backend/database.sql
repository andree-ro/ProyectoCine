-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS cinema_db;
USE cinema_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'cliente') NOT NULL DEFAULT 'cliente',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Tabla de salas de cine
CREATE TABLE IF NOT EXISTS cinema_rooms (
  id INT AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  movie_title VARCHAR(200) NOT NULL,
  movie_poster VARCHAR(255) NOT NULL,
  rows INT NOT NULL,
  columns INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Tabla de reservaciones
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  seat_row INT NOT NULL,
  seat_column INT NOT NULL,
  reservation_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES cinema_rooms(id),
  UNIQUE KEY unique_seat (room_id, seat_row, seat_column, reservation_date)
);

-- Insertar un usuario administrador por defecto
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@cinema.com', '$2b$10$1JXgKlLrKcvcQZQO4qm/4OgxKqeju7kBl9M5XtAEyHLBmUZ60Absy', 'admin');
-- La contraseña es 'admin123' (ya hasheada con bcrypt)