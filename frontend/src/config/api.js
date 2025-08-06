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
  
  // For production, use Render backend
  return 'https://asurwears-backend.onrender.com';
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL);

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
  ADMIN_UPLOAD_TEST: `${API_BASE_URL}/api/admin/upload-image-test`,
  ADMIN_DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
  ADMIN_BANNER: `${API_BASE_URL}/api/admin/banner`,
  
  // Order endpoints
  ORDERS: `${API_BASE_URL}/api/orders`,
};

export default API_BASE_URL; 