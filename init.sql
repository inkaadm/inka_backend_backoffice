-- Script de inicialización para la base de datos Inka Backoffice
-- Este script se ejecuta automáticamente cuando se crea el contenedor de PostgreSQL

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear esquemas si es necesario
-- CREATE SCHEMA IF NOT EXISTS public;

-- Configuraciones adicionales
SET timezone = 'America/Lima';

-- Mensaje de confirmación
SELECT 'Base de datos Inka Backoffice inicializada correctamente' AS mensaje;
