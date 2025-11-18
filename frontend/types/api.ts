// Generic API Response wrapper
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
};

// Product types
export type Product = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  stock: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Category types
export type Category = {
  id: string;
  name: string;
  description?: string;
};

// Cart types
export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
};

// User types
export type UserRole = "ADMIN" | "USER";

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: UserRole;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  user: UserResponse;
  token?: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
};

// Service Request types
export type ServiceRequestStatus =
  | "PENDIENTE"
  | "RECOGIDO"
  | "EN_RECARGA"
  | "LISTO"
  | "ENTREGADO"
  | "FINALIZADO";

export type ExtinguisherType = "ABC" | "CO2" | "H2O" | "K";
export type ExtinguisherState = "OPERATIVO" | "DESCARGADO" | "VENCIDO";
export type TimeSlot = "MANANA" | "TARDE";

export type ServiceRequest = {
  id: string;
  requestId: string;
  userId: string;
  userEmail: string;      // importante: el backend lo envía así
  tipo: string;           // ABC | CO2 | H2O | K
  estadoExtintor: string; // OPERATIVO | DESCARGADO | VENCIDO
  fecha: string;          // YYYY-MM-DD
  franja: string;         // MAÑANA | TARDE
  direccion: string;
  telefono: string;
  observaciones?: string;
  status: ServiceRequestStatus;
  timeline: TimelineItem[];
  createdAt: string;
  updatedAt: string;
};

export type TimelineItem = {
  status: ServiceRequestStatus;
  timestamp: string;
  by: string;
};

export type ServiceRequestCreate = {
  tipo: "ABC" | "CO2" | "H2O" | "K";
  estadoExtintor: "Operativo" | "Descargado" | "Vencido";
  fecha: string; // YYYY-MM-DD
  franja: "Mañana" | "Tarde";
  direccion: string;
  telefono: string;
  observaciones?: string;
};

// Healthcheck
export type HealthCheck = {
  service: string;
  status: "UP" | "DOWN";
  timestamp: string;
};
