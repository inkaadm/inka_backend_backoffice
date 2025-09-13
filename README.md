# Inka Backend Backoffice

## 📋 Descripción

Backend API para el sistema de gestión de productos y pedidos con soporte completo para subida y manejo de imágenes.

## 🚀 Funcionalidades Principales

### ✅ Gestión de Productos con Imágenes

- **Subida de múltiples imágenes** (hasta 5 por producto)
- **Almacenamiento local** en el servidor
- **Eliminación automática** de imágenes al actualizar/eliminar productos
- **Validación de formatos** (JPG, JPEG, PNG, GIF, WEBP)
- **Límite de tamaño** (5MB por archivo)
- **URLs públicas** para acceso a las imágenes

### 📁 Estructura de Endpoints

#### Productos

- `GET /products` - Obtener todos los productos
- `GET /products/:id` - Obtener producto por ID
- `POST /products` - Crear producto con imágenes (multipart/form-data)
- `PATCH /products/:id` - Actualizar producto con nuevas imágenes
- `DELETE /products/:id` - Eliminar producto (incluye eliminación de imágenes)

#### Categorías

- `GET /categories` - Obtener todas las categorías
- `POST /categories` - Crear nueva categoría
- `PATCH /categories/:id` - Actualizar categoría
- `DELETE /categories/:id` - Eliminar categoría

#### Órdenes

- `GET /orders` - Obtener todas las órdenes
- `POST /orders` - Crear nueva órden
- `PATCH /orders/:id` - Actualizar órden
- `DELETE /orders/:id` - Eliminar órden

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- PostgreSQL
- pnpm (recomendado) o npm

### Instalación

\`\`\`bash

# Clonar el repositorio

git clone <tu-repositorio>
cd inka_backend_backoffice

# Instalar dependencias

pnpm install

# Configurar variables de entorno

cp .env.example .env

# Editar .env con tus configuraciones

# Ejecutar migraciones (si las hay)

pnpm run migration:run

# Iniciar en modo desarrollo

pnpm start:dev
\`\`\`

### Variables de Entorno

\`\`\`
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_DATABASE=inka_backoffice
DB_SYNCHRONIZE=true
DB_LOGGING=true
PORT=3000
CORS_ORIGIN=http://localhost:3000
\`\`\`

## 📸 Gestión de Imágenes

### Subida de Imágenes

Las imágenes se suben usando `multipart/form-data`. Ejemplo:

\`\`\`bash
curl -X POST http://localhost:3000/products \\
-F "name=iPhone 15 Pro" \\
-F "description=Smartphone Apple" \\
-F "categoryId=1" \\
-F "price=999" \\
-F 'features=["128GB", "5G"]' \\
-F "stock=50" \\
-F "images=@imagen1.jpg" \\
-F "images=@imagen2.jpg"
\`\`\`

### Acceso a las Imágenes

Las imágenes están disponibles públicamente en:
\`http://localhost:3000/uploads/products/nombre-archivo.ext\`

### Almacenamiento

- **Directorio**: `uploads/products/`
- **Nombres**: UUID únicos + extensión original
- **Límites**: 5MB por archivo, máximo 5 archivos por producto

## 📖 Documentación API

La documentación completa está disponible en Swagger:
\`http://localhost:3000/api\`

## 🧪 Pruebas

### Colección de Postman

Importa la colección: `productos-con-imagenes.postman_collection.json`

### Script de Prueba

Ejecuta el script de prueba:
\`\`\`bash
bash test-images.sh
\`\`\`

## 📦 Tecnologías Utilizadas

- **Framework**: NestJS
- **Base de Datos**: PostgreSQL + TypeORM
- **Subida de Archivos**: Multer
- **Validación**: class-validator, class-transformer
- **Documentación**: Swagger/OpenAPI
- **Archivo Estático**: @nestjs/serve-static

## 🏗️ Arquitectura

\`\`\`
src/
├── common/ # Servicios comunes
│ ├── file-upload.service.ts # Gestión de archivos
│ └── common.module.ts # Módulo común
├── entities/ # Entidades de base de datos
│ ├── product.entity.ts
│ ├── category.entity.ts
│ └── order.entity.ts
├── products/ # Módulo de productos
│ ├── products.controller.ts # Controlador con subida de archivos
│ ├── products.service.ts # Lógica de negocio
│ ├── products.module.ts # Configuración del módulo
│ └── dto/
│ └── product.dto.ts # DTOs de validación
├── categories/ # Módulo de categorías
├── orders/ # Módulo de órdenes
├── app.module.ts # Módulo principal
└── main.ts # Punto de entrada
\`\`\`

## 📄 Documentación Adicional

- [Gestión de Imágenes - Guía Detallada](./IMAGENES_README.md)
- [Colección de Postman](./productos-con-imagenes.postman_collection.json)

## 🔧 Scripts Disponibles

\`\`\`bash
pnpm start:dev # Desarrollo con hot reload
pnpm build # Compilar para producción
pnpm start:prod # Ejecutar en producción
pnpm lint # Verificar código
pnpm test # Ejecutar pruebas
\`\`\`

## 📞 Soporte

Para más información o soporte, consulta la documentación en Swagger o revisa los archivos de ejemplo incluidos en el proyecto.
