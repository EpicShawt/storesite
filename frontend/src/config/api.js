// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  VERIFY_OTP: `${API_BASE_URL}/api/auth/verify-otp`,
  
  // Product endpoints
  PRODUCTS: `${API_BASE_URL}/api/products`,
  PRODUCT_BY_ID: (id) => `${API_BASE_URL}/api/products/${id}`,
  
  // Admin endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  ADMIN_PRODUCTS: `${API_BASE_URL}/api/admin/products`,
  ADMIN_UPLOAD: `${API_BASE_URL}/api/admin/upload-image`,
  ADMIN_DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
  ADMIN_BANNER: `${API_BASE_URL}/api/admin/banner`,
  
  // Order endpoints
  ORDERS: `${API_BASE_URL}/api/orders`,
};

export default API_BASE_URL; 