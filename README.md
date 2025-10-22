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


