// lib/api-client.ts
import type {
  ApiResponse,
  Product,
  Category,
  Cart,
  LoginResponse,
  UserResponse,
  RegisterRequest,
  ServiceRequest,
  ServiceRequestCreate,
} from '@/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8066';

async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    console.log(`[API] ${options?.method || 'GET'} ${endpoint}`);

    // Recuperar token de localStorage si estamos en el cliente
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('firex_token');
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      console.log('[API] Request con autenticación');
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    console.log(`[API] Response ${response.status} para ${endpoint}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`
      }));
      console.error(`[API] Error en ${endpoint}:`, error);
      throw new Error(error.message || `Error ${response.status}`);
    }

    const data = await response.json();
    console.log(`[API] Data recibida de ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`[API] Exception en ${endpoint}:`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error: No se pudo conectar con el servidor');
  }
}

// ============ CART API ============
export const cart = {
  get: (userId: string) =>
    apiCall<ApiResponse<Cart>>(`/api/cart/${userId}`),

  // Usar addOrUpdateItem para AGREGAR y ACTUALIZAR
  addItem: (userId: string, productId: string, quantity: number) =>
    apiCall<ApiResponse<Cart>>(`/api/cart/${userId}/items`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),

  // Actualizar también usa el mismo endpoint POST
  updateItem: (userId: string, productId: string, quantity: number) =>
    apiCall<ApiResponse<Cart>>(`/api/cart/${userId}/items`, {
      method: 'POST', // ← Cambiado de PUT a POST
      body: JSON.stringify({ productId, quantity }),
    }),

  removeItem: (userId: string, productId: string) =>
    apiCall<ApiResponse<Cart>>(`/api/cart/${userId}/items/${productId}`, {
      method: 'DELETE'
    }),

  clear: (userId: string) =>
    apiCall<ApiResponse<Cart>>(`/api/cart/${userId}`, {
      method: 'DELETE'
    }),
};

// ============ PRODUCTOS ============
const createCRUD = <T>(basePath: string) => ({
  getAll: () => apiCall<ApiResponse<T[]>>(basePath),
  getById: (id: string) => apiCall<ApiResponse<T>>(`${basePath}/${id}`),
  create: (data: Partial<T>) =>
    apiCall<ApiResponse<T>>(basePath, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  update: (id: string, data: Partial<T>) =>
    apiCall<ApiResponse<T>>(`${basePath}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  delete: (id: string) =>
    apiCall<ApiResponse<void>>(`${basePath}/${id}`, { method: 'DELETE' }),
});

export const products = {
  ...createCRUD<Product>('/api/products'),
  search: (keyword: string) =>
    apiCall<ApiResponse<Product[]>>(`/api/products/search?keyword=${encodeURIComponent(keyword)}`),
  byCategory: (categoryId: string) =>
    apiCall<ApiResponse<Product[]>>(`/api/products/category/${categoryId}`),
  available: () => apiCall<ApiResponse<Product[]>>('/api/products/available'),
  lowStock: (threshold = 10) =>
    apiCall<ApiResponse<Product[]>>(`/api/products/low-stock?threshold=${threshold}`),
};

export const categories = createCRUD<Category>('/api/categories');

// ============ AUTH API ============
export const auth = {
  register: (data: RegisterRequest) =>
    apiCall<ApiResponse<UserResponse>>('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  login: (email: string, password: string) =>
    apiCall<LoginResponse>('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// ============ USERS API ============
export const users = {
  getAll: () => apiCall<ApiResponse<UserResponse[]>>('/api/users/all'),

  // updateProfile acepta campos parciales
  updateProfile: (id: string, data: { name: string; phone?: string; address?: string; password?: string }) =>
    apiCall<ApiResponse<UserResponse>>(`/api/users/profile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<ApiResponse<void>>(`/api/users/delete/${id}`, { method: 'DELETE' }),
};

// ============ SERVICE REQUESTS API ============
export const serviceRequests = {
  create: (userId: string, userEmail: string, data: ServiceRequestCreate) =>
    apiCall<ApiResponse<ServiceRequest>>('/api/service-requests', {
      method: 'POST',
      headers: {
        'User-Id': userId,
        'User-Email': userEmail
      },
      body: JSON.stringify(data),
    }),
  getAll: () =>
    apiCall<ApiResponse<ServiceRequest[]>>('/api/service-requests'),
  getById: (id: string) =>
    apiCall<ApiResponse<ServiceRequest>>(`/api/service-requests/${id}`),
  getByRequestId: (requestId: string) =>
    apiCall<ApiResponse<ServiceRequest>>(`/api/service-requests/request/${requestId}`),
  getMine: (email: string) =>
    apiCall<ApiResponse<ServiceRequest[]>>(
      `/api/service-requests/my-requests?email=${encodeURIComponent(email)}`
    ),
  getByStatus: (status: string) =>
    apiCall<ApiResponse<ServiceRequest[]>>(`/api/service-requests/status/${status}`),
  updateStatus: (id: string, status: string, updatedBy = 'admin') =>
    apiCall<ApiResponse<ServiceRequest>>(`/api/service-requests/${id}/status`, {
      method: 'PUT',
      headers: { 'Updated-By': updatedBy },
      body: JSON.stringify({ status }),
    }),
  delete: (id: string) =>
    apiCall<ApiResponse<void>>(`/api/service-requests/${id}`, {
      method: 'DELETE'
    }),
};

// ============ CHATBOT API ============
export const chatbot = {
  sendMessage: (message: string, history?: Array<{ role: string; content: string }>) =>
    apiCall<{ message: string; success: boolean; error?: string }>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    }),
};
