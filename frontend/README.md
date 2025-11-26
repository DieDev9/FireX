# FireX Frontend - E-commerce Platform

Aplicación web moderna para FireX, plataforma de e-commerce especializada en productos industriales con sistema de gestión de recargas de extintores.

## 📋 Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Componentes Principales](#componentes-principales)
- [Rutas](#rutas)
- [Estado y Contextos](#estado-y-contextos)
- [API Client](#api-client)
- [Estilos](#estilos)

## 🚀 Tecnologías

### Core
- **Next.js 16.0.3** - Framework React con SSR
- **React 19.2.0** - Biblioteca de UI
- **TypeScript 5** - Tipado estático
- **TailwindCSS 4.1.9** - Framework de estilos

### UI Components
- **Radix UI** - Componentes accesibles y sin estilos
- **Lucide React** - Iconos
- **Shadcn/ui** - Sistema de componentes
- **Recharts** - Gráficos y visualizaciones

### Gestión de Estado
- **TanStack Query (React Query) 5.90.10** - Server state management
- **React Context** - Estado global (Auth, Notifications)

### Formularios y Validación
- **React Hook Form 7.60.0** - Gestión de formularios
- **Zod 3.25.76** - Validación de esquemas

### Otros
- **React Email** - Templates de email
- **date-fns** - Manipulación de fechas
- **Sonner** - Notificaciones toast
- **Next Themes** - Tema claro/oscuro

## ✨ Características

### Para Usuarios

#### 🛒 E-commerce
- Catálogo de productos industriales
- Búsqueda y filtrado por categorías
- Carrito de compras persistente
- Visualización detallada de productos

#### 🔥 Gestión de Recargas
- Solicitud de recarga de extintores
- Seguimiento de estado en tiempo real
- Timeline de estados (PENDIENTE → RECOGIDO → EN_RECARGA → LISTO → FINALIZADO)
- Notificaciones por email con diseño profesional

#### 👤 Perfil de Usuario
- Actualización de datos personales
- Historial de solicitudes
- Gestión de preferencias de notificaciones

#### 🔔 Notificaciones en Tiempo Real
- Server-Sent Events (SSE)
- Notificaciones de cambios de estado
- Alertas visuales y sonoras

#### 💬 Chatbot con IA
- Asistente virtual integrado
- Respuestas sobre productos y servicios
- Historial de conversación

### Para Administradores

#### 📊 Dashboard
- Estadísticas de solicitudes
- Gráficos de productos más vendidos
- Alertas de stock bajo
- Métricas en tiempo real

#### 📦 Gestión de Productos
- CRUD completo con formularios validados
- Control de inventario
- Gestión de categorías
- Carga de imágenes

#### 👥 Gestión de Usuarios
- Listado de usuarios registrados
- Eliminación de usuarios
- Visualización de roles

#### 🔧 Gestión de Solicitudes
- Actualización de estados
- Filtrado por estado
- Estadísticas por estado

## 📦 Requisitos Previos

- **Node.js 18+** o superior
- **npm** o **pnpm**
- Backend de FireX ejecutándose (ver `/backend/README.md`)

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd FireX/frontend
```

2. **Instalar dependencias**
```bash
npm install
# o
pnpm install
```

## ⚙️ Configuración

1. **Copiar archivo de variables de entorno**
```bash
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

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_API_URL` | URL del backend API | `http://localhost:8066` |
| `NEXT_PUBLIC_APP_NAME` | Nombre de la aplicación | `FireX Hub` |
| `NEXT_PUBLIC_ENV` | Entorno de ejecución | `development` |
| `NEXT_PUBLIC_ENABLE_NOTIFICATIONS` | Habilitar notificaciones SSE | `true` |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Habilitar analytics | `false` |

## 🏃 Ejecución

### Desarrollo
```bash
npm run dev
# o
pnpm dev
```

La aplicación estará disponible en: `http://localhost:3000`

### Producción

**Build:**
```bash
npm run build
```

**Start:**
```bash
npm start
```

### Linting
```bash
npm run lint
```

### Email Preview (React Email)
```bash
npm run email
```

Acceder a: `http://localhost:3001`

## 📁 Estructura del Proyecto

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
│   ├── AnimatedBackground.tsx  # Fondo animado
│   ├── Chatbot.tsx            # Chatbot con IA
│   ├── Header.tsx             # Navegación principal
│   ├── NotificationBell.tsx   # Campana de notificaciones
│   ├── ProductCard.tsx        # Tarjeta de producto
│   └── ...
├── context/                     # Contextos de React
│   └── NotificationContext.tsx # Contexto de notificaciones SSE
├── contexts/                    # Contextos adicionales
│   └── AuthContext.tsx        # Contexto de autenticación
├── emails/                      # Templates de email (React Email)
│   └── ServiceRequestEmail.tsx
├── hooks/                       # Custom hooks
│   ├── use-mobile.tsx         # Detección de móvil
│   ├── use-toast.ts           # Hook de toast
│   └── useNotifications.ts    # Hook de notificaciones
├── lib/                         # Utilidades
│   ├── api-client.ts          # Cliente HTTP para API
│   ├── queryClient.ts         # Configuración de React Query
│   └── utils.ts               # Utilidades generales
├── public/                      # Archivos estáticos
├── styles/                      # Estilos globales
│   └── globals.css
├── types/                       # Definiciones de TypeScript
│   ├── api.ts                 # Tipos de API
│   ├── auth.ts                # Tipos de autenticación
│   └── notification.ts        # Tipos de notificaciones
└── package.json
```

## 🧩 Componentes Principales

### Layout y Navegación

#### `Header.tsx`
Barra de navegación principal con:
- Logo y navegación
- Carrito de compras con contador
- Notificaciones en tiempo real
- Menú de usuario
- Modo claro/oscuro

#### `AnimatedBackground.tsx`
Fondo animado con gradientes para mejorar la estética.

### Productos

#### `ProductCard.tsx`
Tarjeta de producto con:
- Imagen
- Nombre y descripción
- Precio
- Stock disponible
- Botón de agregar al carrito

### Notificaciones

#### `NotificationBell.tsx`
Campana de notificaciones con:
- Contador de no leídas
- Dropdown con lista de notificaciones
- Marcar como leída
- Eliminar notificación

#### `NotificationToast.tsx`
Toast de notificaciones en tiempo real usando Sonner.

### Chatbot

#### `Chatbot.tsx`
Chatbot flotante con:
- Interfaz de chat
- Integración con OpenRouter AI
- Historial de conversación
- Minimizable

### Formularios

Formularios validados con React Hook Form + Zod:
- Formulario de login/registro
- Formulario de productos (admin)
- Formulario de categorías (admin)
- Formulario de perfil
- Formulario de solicitud de servicio

### UI Components (Shadcn)

Componentes base reutilizables:
- `Button`, `Input`, `Label`
- `Card`, `Dialog`, `Sheet`
- `Table`, `Tabs`, `Select`
- `Toast`, `Skeleton`, `Badge`
- Y más...

## 🛣️ Rutas

### Públicas
- `/` - Página de inicio
- `/login` - Autenticación
- `/productos` - Catálogo de productos
- `/productos/[id]` - Detalle de producto

### Autenticadas (Usuario)
- `/perfil` - Perfil de usuario
- `/carrito` - Carrito de compras
- `/servicios` - Solicitar recarga
- `/mis-solicitudes` - Mis solicitudes
- `/settings/notifications` - Preferencias de notificaciones

### Autenticadas (Admin)
- `/admin` - Dashboard administrativo
- `/admin/productos` - Gestión de productos
- `/admin/categorias` - Gestión de categorías
- `/admin/solicitudes` - Gestión de solicitudes
- `/admin/usuarios` - Gestión de usuarios

## 🔄 Estado y Contextos

### AuthContext

Gestión de autenticación:
```typescript
{
  user: UserResponse | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
```

Uso:
```tsx
const { user, login, logout, isAdmin } = useAuth();
```

### NotificationContext

Gestión de notificaciones SSE:
```typescript
{
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}
```

Uso:
```tsx
const { notifications, unreadCount, markAsRead } = useNotifications();
```

### React Query

Gestión de estado del servidor:
- Caché automático
- Revalidación en segundo plano
- Optimistic updates
- Paginación y scroll infinito

Ejemplo:
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['products'],
  queryFn: () => products.getAll()
});
```

## 🌐 API Client

Cliente HTTP centralizado en `lib/api-client.ts`:

### Módulos

#### `auth`
- `register(data)` - Registrar usuario
- `login(email, password)` - Iniciar sesión

#### `products`
- `getAll()` - Listar productos
- `getById(id)` - Obtener producto
- `create(data)` - Crear producto
- `update(id, data)` - Actualizar producto
- `delete(id)` - Eliminar producto
- `search(keyword)` - Buscar productos
- `byCategory(categoryId)` - Por categoría
- `available()` - Productos disponibles
- `lowStock(threshold)` - Stock bajo

#### `categories`
- `getAll()` - Listar categorías
- `getById(id)` - Obtener categoría
- `create(data)` - Crear categoría
- `update(id, data)` - Actualizar categoría
- `delete(id)` - Eliminar categoría

#### `cart`
- `get(userId)` - Obtener carrito
- `addItem(userId, productId, quantity)` - Agregar item
- `updateItem(userId, productId, quantity)` - Actualizar item
- `removeItem(userId, productId)` - Eliminar item
- `clear(userId)` - Vaciar carrito

#### `serviceRequests`
- `create(userId, userEmail, data)` - Crear solicitud
- `getAll()` - Listar todas
- `getById(id)` - Obtener por ID
- `getMine(email)` - Mis solicitudes
- `getByStatus(status)` - Por estado
- `updateStatus(id, status, updatedBy)` - Actualizar estado
- `delete(id)` - Eliminar

#### `users`
- `getAll()` - Listar usuarios
- `updateProfile(id, data)` - Actualizar perfil
- `delete(id)` - Eliminar usuario

#### `chatbot`
- `sendMessage(message, history)` - Enviar mensaje

### Autenticación Automática

El cliente incluye automáticamente el token JWT en las peticiones:
```typescript
Authorization: Bearer <token>
```

El token se almacena en `localStorage` con la key `firex_token`.

## 🎨 Estilos

### TailwindCSS

Configuración personalizada con:
- Paleta de colores personalizada
- Modo oscuro con `next-themes`
- Animaciones personalizadas
- Variables CSS para temas

### Componentes Estilizados

Uso de `class-variance-authority` (CVA) para variantes de componentes:
```tsx
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "...",
        destructive: "...",
        outline: "..."
      }
    }
  }
);
```

### Tema Claro/Oscuro

Implementado con `next-themes`:
```tsx
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();
```

## 📧 React Email

Templates de email profesionales en `emails/`:

### ServiceRequestEmail

Template para confirmación de solicitudes:
- Diseño responsive
- Información de la solicitud
- Datos de contacto
- Branding de FireX

**Preview:**
```bash
npm run email
```

## 🔔 Sistema de Notificaciones

### Server-Sent Events (SSE)

Conexión en tiempo real con el backend:

1. **Conexión**: Se establece al autenticarse
2. **Eventos**: El servidor envía notificaciones
3. **Manejo**: `NotificationContext` gestiona el estado
4. **UI**: `NotificationBell` y `NotificationToast` muestran las notificaciones

### Tipos de Notificaciones

- `SERVICE_REQUEST_STATUS` - Cambio de estado en solicitud
- `LOW_STOCK` - Alerta de stock bajo (admin)

## 🔒 Seguridad

### Protección de Rutas

Rutas protegidas con verificación de autenticación:
```tsx
useEffect(() => {
  if (!isAuthenticated) {
    router.push('/login');
  }
}, [isAuthenticated]);
```

### Rutas de Admin

Verificación adicional de rol:
```tsx
if (!isAdmin) {
  router.push('/');
}
```

### Almacenamiento Seguro

- Token JWT en `localStorage`
- Datos de usuario en contexto
- Limpieza al cerrar sesión

## 🧪 Testing

```bash
npm run lint
```

## 🚀 Optimizaciones

### Next.js
- Server-Side Rendering (SSR)
- Static Site Generation (SSG) donde aplica
- Image Optimization con `next/image`
- Code Splitting automático

### React Query
- Caché inteligente
- Deduplicación de peticiones
- Revalidación en background
- Optimistic updates

### Performance
- Lazy loading de componentes
- Memoización con `useMemo` y `useCallback`
- Skeleton loaders para mejor UX

## 📱 Responsive Design

Diseño totalmente responsive:
- Mobile-first approach
- Breakpoints de TailwindCSS
- Componentes adaptables
- Menú móvil con Sheet

## 🐛 Manejo de Errores

- Try-catch en peticiones API
- Mensajes de error con toast
- Fallbacks en componentes
- Validación de formularios

## 📄 Licencia

Este proyecto es privado y pertenece a DieDev.

## 👥 Autores

- **DieDev Team** - Desarrollo inicial

## 🔗 Enlaces Útiles

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Shadcn/ui](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
