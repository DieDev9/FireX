# FireX - Plataforma E-commerce Industrial

Sistema completo de e-commerce especializado en productos industriales con gestión de recargas de extintores. Incluye backend REST API con Spring Boot y frontend web con Next.js.

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Integrantes del Equipo](#integrantes-del-equipo)
- [Tecnologías](#tecnologías)
- [Características](#características)
- [Capturas de Pantalla](#capturas-de-pantalla)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Arquitectura](#arquitectura)
- [API Endpoints](#api-endpoints)
- [Modelos de Datos](#modelos-de-datos)
- [Frontend](#frontend)
- [Seguridad](#seguridad)

## Descripción General

FireX es una plataforma completa que permite:
- Venta de productos industriales
- Gestión de inventario
- Solicitudes de recarga de extintores
- Sistema de notificaciones en tiempo real
- Panel administrativo
- Chatbot con inteligencia artificial

## Integrantes del Equipo

| Nombre | Rol | Funcionalidad CRUD desarrollada |
|--------|-----|--------------------------------|
| Giovanny Ojeda | Backend Developer | CRUD de Productos |
| Alejandro Santamaría | Backend Developer | CRUD de Categorías |
| Diego Fonseca | Fullstack Developer | CRUD de Usuarios y Login |
| Todos los integrantes | Frontend | Maquetación y consumo de API |

## Tecnologías

### Backend
- **Java 21** - Lenguaje de programación
- **Spring Boot 3.3.5** - Framework principal
- **MongoDB** - Base de datos NoSQL
- **Spring Security** - Autenticación y autorización
- **JWT (JSON Web Tokens)** - Gestión de sesiones
- **Spring Mail** - Envío de correos electrónicos
- **OpenAPI/Swagger** - Documentación de API
- **Maven** - Gestión de dependencias

### Frontend
- **Next.js 16.0.3** - Framework React con SSR
- **React 19.2.0** - Biblioteca de UI
- **TypeScript 5** - Tipado estático
- **TailwindCSS 4.1.9** - Framework de estilos
- **Radix UI** - Componentes accesibles
- **TanStack Query 5.90.10** - Gestión de estado del servidor
- **React Hook Form 7.60.0** - Gestión de formularios
- **Zod 3.25.76** - Validación de esquemas
- **React Email** - Templates de email

## Características

### Gestión de Productos
- CRUD completo de productos industriales
- Búsqueda y filtrado por categorías
- Control de inventario y stock bajo
- Productos disponibles/no disponibles

### Sistema de Usuarios
- Registro y autenticación con JWT
- Roles de usuario (ADMIN, USER)
- Actualización de perfil
- Gestión de usuarios (ADMIN)

### Carrito de Compras
- Agregar/actualizar/eliminar productos
- Cálculo automático de totales
- Carrito persistente por usuario

### Solicitudes de Servicio (Recargas)
- Creación de solicitudes de recarga de extintores
- Estados: PENDIENTE, RECOGIDO, EN_RECARGA, LISTO, FINALIZADO
- Timeline de estados con timestamps
- Notificaciones por email con HTML personalizado
- Consulta por usuario y por estado

### Categorías
- Gestión de categorías de productos
- Relación con productos

### Notificaciones
- Notificaciones de cambios de estado
- Alertas de stock bajo
- Sistema de notificaciones persistentes

### Chatbot con IA
- Integración con OpenRouter AI
- Asistente virtual para consultas
- Historial de conversación

### Panel Administrativo
- Dashboard con estadísticas
- Gráficos de productos más vendidos
- Alertas de stock bajo
- Gestión completa de productos, categorías y usuarios

## Capturas de Pantalla

### Página de Inicio
![Página de Inicio](./images/home.png)

### Catálogo de Productos
![Catálogo de Productos](./images/productos.png)

### Carrito de Compras
![Carrito de Compras](./images/carrito.png)

### Solicitud de Servicio
![Solicitud de Servicio](./images/servicios.png)

### Panel Administrativo
![Dashboard Admin](./images/admin-dashboard.png)

### Gestión de Productos (Admin)
![Gestión de Productos](./images/admin-productos.png)

### Chatbot con IA
![Chatbot](./images/chatbot.png)

> **Nota:** Para agregar las capturas de pantalla, crea una carpeta `screenshots` en la raíz del proyecto y coloca las imágenes con los nombres indicados arriba.

## Requisitos Previos

### Backend
- **JDK 21** o superior
- **Maven 3.8+**
- **MongoDB** (local o MongoDB Atlas)
- Cuenta de Gmail con contraseña de aplicación (para envío de emails)
- API Key de OpenRouter (para chatbot)

### Frontend
- **Node.js 18+** o superior
- **npm** o **pnpm**

## Instalación

### Backend

1. **Navegar al directorio backend**
```bash
cd FireX/backend
```

2. **Instalar dependencias**
```bash
./mvnw clean install
```

### Frontend

1. **Navegar al directorio frontend**
```bash
cd FireX/frontend
```

2. **Instalar dependencias**
```bash
npm install
# o
pnpm install
```

## Configuración

### Backend

1. **Copiar archivo de variables de entorno**
```bash
cd backend
cp .env.example .env
```

2. **Configurar variables de entorno en `.env`**

```properties
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=firexhub
MONGODB_DATABASE=firexhub

# Email Configuration (Gmail SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password

# JWT Configuration
JWT_SECRET=your-secret-key-here-min-256-bits
JWT_EXPIRATION=86400000

# Server Configuration
SERVER_PORT=8066

# OpenRouter AI Configuration
OPENROUTER_API_KEY=your-openrouter-api-key-here
```

#### Configuración de Gmail

Para el envío de emails:
1. Habilitar verificación en 2 pasos en tu cuenta de Gmail
2. Generar una contraseña de aplicación en: https://myaccount.google.com/apppasswords
3. Usar esa contraseña en `MAIL_PASSWORD`

#### Configuración de MongoDB

**Opción 1: MongoDB Atlas (Cloud)**
- Crear cluster en https://www.mongodb.com/cloud/atlas
- Obtener URI de conexión
- Configurar IP whitelist

**Opción 2: MongoDB Local**
```properties
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=firexhub
```

### Frontend

1. **Copiar archivo de variables de entorno**
```bash
cd frontend
cp .env.example .env
```

2. **Configurar variables de entorno**

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8066

# App Configuration
NEXT_PUBLIC_APP_NAME=FireX Hub
NEXT_PUBLIC_ENV=development

# Features
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Ejecución

### Backend

**Desarrollo:**
```bash
cd backend
./mvnw spring-boot:run
```

**Producción:**
```bash
cd backend
./mvnw clean package
java -jar target/firex-0.0.1-SNAPSHOT.jar
```

El servidor estará disponible en: `http://localhost:8066`

**Documentación API (Swagger):**
- Swagger UI: `http://localhost:8066/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8066/v3/api-docs`

### Frontend

**Desarrollo:**
```bash
cd frontend
npm run dev
# o
pnpm dev
```

La aplicación estará disponible en: `http://localhost:3000`

**Producción:**
```bash
cd frontend
npm run build
npm start
```

## Arquitectura

### Backend - Estructura del Proyecto

```
backend/src/main/java/com/diedev/firex/
├── config/              # Configuraciones (CORS, Security, etc.)
├── controllers/         # Controladores REST
├── dto/                 # Data Transfer Objects
│   ├── request/        # DTOs de entrada
│   └── response/       # DTOs de salida
├── enums/              # Enumeraciones (Roles, Estados, etc.)
├── exception/          # Manejo de excepciones
├── models/             # Entidades de MongoDB
├── repositories/       # Repositorios de datos
├── security/           # JWT y configuración de seguridad
├── service/            # Lógica de negocio
│   ├── interfaces/    # Interfaces de servicios
│   └── impl/          # Implementaciones
└── util/               # Utilidades
```

### Frontend - Estructura del Proyecto

```
frontend/
├── app/                          # App Router de Next.js
│   ├── admin/                   # Rutas de administración
│   │   ├── categorias/         # Gestión de categorías
│   │   ├── productos/          # Gestión de productos
│   │   ├── solicitudes/        # Gestión de solicitudes
│   │   └── usuarios/           # Gestión de usuarios
│   ├── carrito/                # Carrito de compras
│   ├── login/                  # Autenticación
│   ├── mis-solicitudes/        # Solicitudes del usuario
│   ├── perfil/                 # Perfil de usuario
│   ├── productos/              # Catálogo de productos
│   ├── servicios/              # Solicitud de servicios
│   ├── settings/               # Configuración
│   ├── layout.tsx              # Layout principal
│   └── page.tsx                # Página de inicio
├── components/                  # Componentes reutilizables
│   ├── ui/                     # Componentes base (Shadcn)
│   ├── Chatbot.tsx            # Chatbot con IA
│   ├── Header.tsx             # Navegación principal
│   ├── NotificationBell.tsx   # Campana de notificaciones
│   └── ProductCard.tsx        # Tarjeta de producto
├── context/                     # Contextos de React
├── emails/                      # Templates de email
├── hooks/                       # Custom hooks
├── lib/                         # Utilidades
│   ├── api-client.ts          # Cliente HTTP para API
│   └── queryClient.ts         # Configuración de React Query
├── types/                       # Definiciones de TypeScript
└── package.json
```

### Patrón de Diseño

El proyecto sigue una arquitectura en capas:

1. **Controllers** - Endpoints REST, validación de entrada
2. **Services** - Lógica de negocio
3. **Repositories** - Acceso a datos (MongoDB)
4. **DTOs** - Transferencia de datos entre capas
5. **Models** - Entidades de dominio

## API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/users/register` | Registrar nuevo usuario | No |
| POST | `/api/users/login` | Iniciar sesión | No |

### Usuarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/{id}` | Obtener usuario por ID | Sí |
| PUT | `/api/users/profile/{id}` | Actualizar perfil | Sí |
| GET | `/api/users/all` | Listar todos los usuarios | Admin |
| DELETE | `/api/users/delete/{id}` | Eliminar usuario | Admin |

### Productos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Listar todos los productos | No |
| GET | `/api/products/{id}` | Obtener producto por ID | No |
| GET | `/api/products/search?keyword={keyword}` | Buscar productos | No |
| GET | `/api/products/category/{categoryId}` | Productos por categoría | No |
| GET | `/api/products/available` | Productos disponibles | No |
| GET | `/api/products/low-stock?threshold={n}` | Productos con stock bajo | Admin |
| POST | `/api/products` | Crear producto | Admin |
| PUT | `/api/products/{id}` | Actualizar producto | Admin |
| DELETE | `/api/products/{id}` | Eliminar producto | Admin |

### Categorías

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/categories` | Listar categorías | No |
| GET | `/api/categories/{id}` | Obtener categoría | No |
| POST | `/api/categories` | Crear categoría | Admin |
| PUT | `/api/categories/{id}` | Actualizar categoría | Admin |
| DELETE | `/api/categories/{id}` | Eliminar categoría | Admin |

### Carrito

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/cart/{userId}` | Obtener carrito | Sí |
| POST | `/api/cart/{userId}/items` | Agregar/actualizar item | Sí |
| DELETE | `/api/cart/{userId}/items/{productId}` | Eliminar item | Sí |
| DELETE | `/api/cart/{userId}` | Vaciar carrito | Sí |

### Solicitudes de Servicio

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/service-requests` | Crear solicitud | Sí |
| GET | `/api/service-requests` | Listar todas | Admin |
| GET | `/api/service-requests/{id}` | Obtener por ID | Sí |
| GET | `/api/service-requests/request/{requestId}` | Obtener por Request ID | Sí |
| GET | `/api/service-requests/my-requests?email={email}` | Mis solicitudes | Sí |
| GET | `/api/service-requests/status/{status}` | Por estado | Admin |
| PUT | `/api/service-requests/{id}/status` | Actualizar estado | Admin |
| DELETE | `/api/service-requests/{id}` | Eliminar solicitud | Admin |
| GET | `/api/service-requests/stats` | Estadísticas | Admin |

### Notificaciones

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/notifications/{userId}` | Listar notificaciones | Sí |
| PUT | `/api/notifications/{id}/read` | Marcar como leída | Sí |
| DELETE | `/api/notifications/{id}` | Eliminar notificación | Sí |

### Chatbot

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/chat` | Enviar mensaje al chatbot | No |

### Health Check

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Estado del servidor | No |

## Modelos de Datos

### AppUser
```java
{
  "id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "phone": "string",
  "address": "string",
  "role": "USER | ADMIN",
  "createdAt": "LocalDateTime"
}
```

### Producto
```java
{
  "id": "ObjectId",
  "name": "string",
  "description": "string",
  "price": "double",
  "stock": "int",
  "categoryId": "ObjectId",
  "imageUrl": "string",
  "available": "boolean",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### ServiceRequest
```java
{
  "id": "ObjectId",
  "requestId": "string (SR-timestamp)",
  "userId": "ObjectId",
  "userEmail": "string",
  "extinguisherType": "string",
  "quantity": "int",
  "address": "string",
  "phone": "string",
  "notes": "string",
  "status": "PENDIENTE | RECOGIDO | EN_RECARGA | LISTO | FINALIZADO",
  "timeline": [
    {
      "status": "string",
      "timestamp": "LocalDateTime",
      "updatedBy": "string"
    }
  ],
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### Cart
```java
{
  "id": "ObjectId",
  "userId": "ObjectId",
  "items": [
    {
      "productId": "ObjectId",
      "quantity": "int",
      "price": "double"
    }
  ],
  "totalAmount": "double",
  "updatedAt": "LocalDateTime"
}
```

### Notification
```java
{
  "id": "ObjectId",
  "userId": "ObjectId",
  "type": "SERVICE_REQUEST_STATUS | LOW_STOCK",
  "title": "string",
  "message": "string",
  "read": "boolean",
  "createdAt": "LocalDateTime"
}
```

## Frontend

### Rutas

**Públicas:**
- `/` - Página de inicio
- `/login` - Autenticación
- `/productos` - Catálogo de productos
- `/productos/[id]` - Detalle de producto

**Autenticadas (Usuario):**
- `/perfil` - Perfil de usuario
- `/carrito` - Carrito de compras
- `/servicios` - Solicitar recarga
- `/mis-solicitudes` - Mis solicitudes
- `/settings/notifications` - Preferencias de notificaciones

**Autenticadas (Admin):**
- `/admin` - Dashboard administrativo
- `/admin/productos` - Gestión de productos
- `/admin/categorias` - Gestión de categorías
- `/admin/solicitudes` - Gestión de solicitudes
- `/admin/usuarios` - Gestión de usuarios

### Estado y Contextos

**AuthContext:**
Gestión de autenticación con usuario, login, logout y verificación de roles.

**NotificationContext:**
Gestión de notificaciones con lista de notificaciones, contador de no leídas, y funciones para marcar como leída o eliminar.

**React Query:**
Gestión de estado del servidor con caché automático, revalidación en segundo plano y optimistic updates.

### API Client

Cliente HTTP centralizado en `lib/api-client.ts` con módulos para:
- `auth` - Autenticación
- `products` - Productos
- `categories` - Categorías
- `cart` - Carrito
- `serviceRequests` - Solicitudes de servicio
- `users` - Usuarios
- `chatbot` - Chatbot

Incluye automáticamente el token JWT en las peticiones.

### Componentes Principales

- **Header** - Navegación principal con carrito y notificaciones
- **ProductCard** - Tarjeta de producto
- **NotificationBell** - Campana de notificaciones
- **Chatbot** - Chatbot flotante con IA
- **Formularios** - Validados con React Hook Form + Zod

### React Email

Templates de email profesionales para confirmación de solicitudes con diseño responsive.

## Seguridad

### Autenticación JWT

1. **Login**: El usuario envía credenciales a `/api/users/login`
2. **Token**: El servidor responde con un JWT
3. **Autorización**: El cliente incluye el token en el header:
   ```
   Authorization: Bearer <token>
   ```

### Roles y Permisos

- **USER**: Acceso a productos, carrito, solicitudes propias
- **ADMIN**: Acceso completo, gestión de productos, categorías, usuarios

### CORS

Configurado para permitir peticiones desde:
- `http://localhost:3000` (desarrollo frontend)
- Otros orígenes configurables en `CorsConfig.java`

### Validación

- DTOs con anotaciones de validación (`@Valid`, `@NotBlank`, etc.)
- Manejo centralizado de excepciones
- Respuestas estandarizadas con `ApiResponse`

### Protección de Rutas (Frontend)

- Verificación de autenticación en rutas protegidas
- Verificación adicional de rol para rutas de admin
- Token JWT almacenado en `localStorage`

## Sistema de Emails

El sistema envía emails HTML personalizados para:
- Confirmación de solicitudes de servicio
- Actualizaciones de estado
- Notificaciones importantes

Los templates HTML se generan en el frontend con React Email y se envían al backend.

## Chatbot

Integración con OpenRouter AI para asistencia virtual:
- Modelo: `meta-llama/llama-3.1-8b-instruct:free`
- Contexto sobre productos y servicios de FireX
- Historial de conversación

## Manejo de Errores

Respuestas estandarizadas:

**Éxito:**
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Descripción del error",
  "data": null
}
```

## Testing

**Backend:**
```bash
cd backend
./mvnw test
```

**Frontend:**
```bash
cd frontend
npm run lint
```

## Licencia

Este proyecto es privado y pertenece a DieDev.

## Autores

- **DieDev Team** - Desarrollo inicial

## Enlaces Útiles

### Backend
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)
- [OpenRouter AI](https://openrouter.ai/)

### Frontend
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Shadcn/ui](https://ui.shadcn.com/)
