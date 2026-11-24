CREATE DATABASE IF NOT EXISTS tickets_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tickets_db;
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS tickets (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  numero    VARCHAR(50) NOT NULL UNIQUE,
  asunto    VARCHAR(200) NOT NULL,
  prioridad ENUM('baja', 'media', 'alta') NOT NULL,
  estado    ENUM('abierto', 'cerrado') NOT NULL,
  fecha     DATE NOT NULL,
  area_id   INT NOT NULL
);

INSERT INTO tickets (numero, asunto, prioridad, estado, fecha, area_id) VALUES
  ('TCK-001', 'Falla en acceso a la plataforma', 'alta', 'abierto', '2026-11-20', 1),
  ('TCK-002', 'Solicitud de cambio de clave', 'baja', 'cerrado', '2026-11-21', 1),
  ('TCK-003', 'Error al generar reporte mensual', 'media', 'abierto', '2026-11-22', 1);
