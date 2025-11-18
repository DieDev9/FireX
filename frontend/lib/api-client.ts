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

// ============ CORE API UTILITIES ============
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        message: `HTTP error! status: ${response.status}` 
      }));
      throw new Error(error.message || `Error ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error: No se pudo conectar con el servidor');
  }
}

// Generic CRUD operations
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

// ============ RESOURCE APIs ============
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

// ============ CART API ============
export const cart = {
  get: (userId: string) => apiCall<ApiResponse<Cart>>(`/api/cart/${userId}`),
  addItem: (userId: string, productId: string, quantity: number) =>
    apiCall<ApiResponse<Cart>>(`/api/cart/${userId}/items`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),
  updateItem: (userId: string, productId: string, quantity: number) =>
    apiCall<ApiResponse<Cart>>(`/api/cart/${userId}/items/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  removeItem: (userId: string, productId: string) =>
    apiCall<ApiResponse<Cart>>(`/api/cart/${userId}/items/${productId}`, { 
      method: 'DELETE' 
    }),
  clear: (userId: string) => 
    apiCall<ApiResponse<Cart>>(`/api/cart/${userId}`, { method: 'DELETE' }),
};

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
  updateProfile: (id: string, data: Partial<UserResponse>) =>
    apiCall<ApiResponse<UserResponse>>(`/api/users/profile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) => 
    apiCall<ApiResponse<void>>(`/api/users/${id}`, { method: 'DELETE' }),
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

// ============ LEGACY COMPATIBILITY ============
// Mantener para no romper código existente
export const getProducts = products.getAll;
export const getProductById = products.getById;
export const createProduct = products.create;
export const updateProduct = products.update;
export const deleteProduct = products.delete;
export const searchProducts = products.search;
export const getProductsByCategory = products.byCategory;

export const getCategories = categories.getAll;
export const getCategoryById = categories.getById;
export const createCategory = categories.create;
export const updateCategory = categories.update;
export const deleteCategory = categories.delete;

export const getCart = cart.get;
export const addToCart = cart.addItem;
export const updateCartItem = cart.updateItem;
export const removeFromCart = cart.removeItem;
export const clearCart = cart.clear;

export const register = auth.register;
export const login = auth.login;
export const updateProfile = users.updateProfile;
export const getAllUsers = users.getAll;
export const deleteUser = users.delete;

export const createServiceRequest = serviceRequests.create;
export const getAllServiceRequests = serviceRequests.getAll;
export const getServiceRequestById = serviceRequests.getById;
export const getMyServiceRequests = serviceRequests.getMine;
export const updateServiceRequestStatus = serviceRequests.updateStatus;