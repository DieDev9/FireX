# FireX Hub

**Plataforma de comercio y gestión de servicios para venta y recarga de extintores.**  
Permite a clientes explorar el catálogo, solicitar recargas, agendar recolección/entrega, seguir el estado de pedidos/servicios y descargar comprobantes. Incluye panel administrativo y funcionalidades para técnicos de campo.

---

## Características principales
- Registro y autenticación de usuarios.  
- Catálogo de productos (extintores, repuestos) y servicios (recarga).  
- Búsqueda y filtros por categoría, precio y disponibilidad.  
- Carrito de compras y checkout con selección de tipo de servicio (venta / recarga).  
- Agendamiento de recolección/entrega con franjas horarias.  
- Gestión de solicitudes de recarga: asignación a técnicos, registro de evidencias (fotos/firmas).  
- Panel administrativo: CRUD de productos, control de stock y gestión de pedidos/solicitudes.  
- Generación de facturas/comprobantes (PDF).  
- Notificaciones (email / internas) y logs de auditoría.  
- Exportes y reportes (CSV / PDF), dashboard de indicadores.

---

# Arquitectura y stack
- **Backend:** Spring Boot (aplicación Java gestionada por Maven). El proyecto incluye el Maven Wrapper (`mvnw`, `mvnw.cmd`) y el archivo `pom.xml`.  
- **Frontend:** React (aplicación React cuyo código/build se encuentra en la carpeta `frontend`).  
- **Base de datos:** MariaDB/MySQL.  
- **Almacenamiento de archivos y evidencias:** gestión mediante configuraciones del backend.  
- **Contenerización:** Docker/docker-compose.

---


### Notas sobre directorios clave
- `backend`: contiene la lógica del servidor (endpoints REST, servicios, repositorios, entidades JPA).  
- `frontend`: aplicación React; el build produce archivos estáticos que el backend puede servir o desplegarse por separado.
---

# Autores 
- Alejandro Santamaría.
- Diego Fonseca.
- Giovanny Ojeda.



# 🔥 FireX Hub

## 📘 Descripción General

**Plataforma de comercio y gestión de servicios para venta y recarga de extintores.**  
Permite a clientes explorar el catálogo, solicitar recargas, agendar recolección/entrega, seguir el estado de pedidos/servicios y descargar comprobantes. Incluye panel administrativo y funcionalidades para técnicos de campo. 

El proyecto está compuesto por:
- **Backend:** API REST desarrollada en **Spring Boot (Java 21)**.
- **Frontend:** Interfaz web implementada con **React + Vite**.
- **Base de datos:** MySQL.

---

## 🧑‍💻 Integrantes del equipo

| Nombre | Rol | Funcionalidad CRUD desarrollada |
|---------|-----|--------------------------------|
| [Nombre 1] | Backend Developer | CRUD de Productos |
| [Nombre 2] | Backend Developer | CRUD de Categorías |
| [Nombre 3] | Fullstack | CRUD de Usuarios y Login |
| [Nombre 4] | Frontend Developer | Interfaz React y consumo de API |

*(Reemplazar con los nombres de los integrantes del grupo.)*

---

## ⚙️ Tecnologías Implementadas

### 🔙 Backend
- Java 21  
- Spring Boot 3.5.5  
- Spring Data JPA  
- MySQL 8  
- Lombok  
- Swagger / OpenAPI  
- Maven  

### 🎨 Frontend
- React + Vite  
- JavaScript (ES6)  
- Axios (consumo de API)  
- React Router DOM  
- CSS3  

---

## 🗃️ Arquitectura General

FireX/
├── backend/ # API REST - Spring Boot
│ ├── controllers/
│ ├── models/
│ ├── repositories/
│ ├── service/
│ └── FirexApplication.java
│
└── frontend/ # Aplicación React - Vite
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ └── App.jsx
└── vite.config.js



---

## 🗄️ Diseño de Base de Datos

El modelo de datos está orientado a una estructura relacional en MySQL.

### 📋 Entidades Principales

| Entidad | Campos | Relaciones |
|----------|---------|-------------|
| **users** | id, name, email, password, phone, address, role | — |
| **categories** | id, name | 1–N con productos |
| **products** | id, name, description, price, stock, category_id | N–1 con categorías |

### 🔶 Diagrama Entidad–Relación (ERD)



---

## 🧩 Funcionalidades Principales

### 🔐 Autenticación
- Inicio de sesión de usuarios mediante email y contraseña.
- Validación de credenciales y retorno de información del usuario logueado.

### ⚙️ CRUDs Implementados
| Módulo | Descripción |
|--------|--------------|
| **Usuarios** | Crear, listar, editar y eliminar usuarios. |
| **Productos** | Gestión completa de productos industriales. |
| **Categorías** | Administración de categorías y vinculación con productos. |

---

## 🧱 Backend — Detalle Técnico

### 🧰 Dependencias principales (`pom.xml`)
```xml
<dependencies>
    <dependency>spring-boot-starter-data-jpa</dependency>
    <dependency>spring-boot-starter-web</dependency>
    <dependency>com.mysql:mysql-connector-j</dependency>
    <dependency>org.projectlombok:lombok</dependency>
    <dependency>springdoc-openapi-starter-webmvc-ui</dependency>
</dependencies>
🧩 Controladores REST

UserController.java → CRUD de usuarios + login.

ProductoController.java → CRUD de productos.

CategoriaController.java → CRUD de categorías.

🌍 Endpoints principales
👤 Usuarios /api/users
Método	Endpoint	Descripción
POST	/add	Crear usuario
GET	/all	Listar usuarios
GET	/{id}	Obtener usuario por ID
PUT	/update/{id}	Actualizar usuario
DELETE	/delete/{id}	Eliminar usuario
POST	/login	Iniciar sesión
🏷️ Categorías /categorias
Método	Endpoint	Descripción
GET	/list	Listar categorías
GET	/list/{id}	Buscar por ID
POST	/	Crear categoría
PUT	/	Editar categoría
DELETE	/{id}	Eliminar categoría
📦 Productos /productos
Método	Endpoint	Descripción
GET	/list	Listar productos
GET	/list/{id}	Buscar producto por ID
POST	/	Crear producto
PUT	/	Editar producto
DELETE	/{id}	Eliminar producto
🔧 Configuración de CORS

El archivo CorsConfig.java permite acceso desde cualquier origen (útil para desarrollo del frontend con Vite).

💾 Configuración de la Base de Datos

Editar el archivo application.properties en backend/src/main/resources/:

spring.datasource.url=jdbc:mysql://localhost:3306/tienda_db?useSSL=false
spring.datasource.username=root
spring.datasource.password=TU_CONTRASEÑA
spring.jpa.hibernate.ddl-auto=update
server.port=8066


Crear la base de datos:

CREATE DATABASE tienda_db;

🚀 Ejecución del Proyecto
1️⃣ Clonar el repositorio
git clone https://github.com/<usuario>/firex.git
cd firex

2️⃣ Iniciar el backend
cd backend
mvn clean install
mvn spring-boot:run


Servidor en: http://localhost:8066

3️⃣ Iniciar el frontend
cd frontend
npm install
npm run dev


Interfaz en: http://localhost:5173

🖥️ Frontend — Detalle Técnico
📁 Estructura principal
frontend/
├── src/
│   ├── components/     # Componentes reutilizables (Navbar, Footer, etc.)
│   ├── pages/          # Páginas (Login, Productos, Categorías)
│   ├── services/       # Axios y consumo de API REST
│   ├── App.jsx         # Rutas principales
│   └── main.jsx

🔗 Conexión con el Backend

El frontend utiliza Axios para consumir los endpoints de la API REST:

axios.get("http://localhost:8066/productos/list")

🧭 Navegación

Implementada con React Router DOM.
Ejemplo:

<Route path="/productos" element={<Productos />} />

🧑‍💼 Login

El formulario de inicio de sesión valida credenciales contra el endpoint:

POST http://localhost:8066/api/users/login


y almacena el usuario autenticado en el estado global del frontend.

🧪 Pruebas

Ejecutar pruebas del backend:

mvn test


Ejecutar el proyecto en modo desarrollo del frontend:

npm run dev

📘 Documentación de API

El backend incluye integración con Swagger UI, disponible en:

http://localhost:8066/swagger-ui/index.html

📸 Evidencias de Funcionamiento

1. Login de usuario
2. CRUD de productos y categorías
3. Base de datos MySQL con tablas pobladas
(Incluir capturas de pantalla o enlaces si el docente lo requiere.)

🧠 Posibles Mejoras

Implementar autenticación JWT.

Validaciones con @Valid.

Paginación y búsqueda avanzada.

Subida de imágenes de productos.
