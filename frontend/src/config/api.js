// API Configuration
const getApiBaseUrl = () => {
  // If environment variable is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // If running locally, use localhost
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  
  // For production, try different Railway URLs
  const possibleUrls = [
    'https://asurwears-backend-production.up.railway.app',
    'https://asurwears-backend.up.railway.app',
    'https://asurwears.up.railway.app'
  ];
  
  // For now, return the first one and let the error handling deal with it
  return possibleUrls[0];
};

const API_BASE_URL = getApiBaseUrl();

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