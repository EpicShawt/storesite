// API Configuration
const getApiBaseUrl = () => {
  // Force use the correct Render URL - your actual URL
  const renderUrl = 'https://asurwears-backend.onrender.com';
  console.log('🔧 Using Render API:', renderUrl);
  console.log('🔧 Environment check:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    hostname: window.location.hostname,
    isLocalhost: window.location.hostname === 'localhost'
  });
  return renderUrl;
};

const API_BASE_URL = getApiBaseUrl();

console.log('✅ Final API Base URL:', API_BASE_URL);

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