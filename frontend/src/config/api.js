// API Configuration
const getApiBaseUrl = () => {
  // FORCE USE VERCEL URL - NO OLD URLS
  const vercelUrl = 'https://asurwearcom-backend.vercel.app';

  console.log('🔧 FORCING VERCEL URL:', vercelUrl);
  console.log('🔧 Environment check:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    hostname: window.location.hostname,
    isLocalhost: window.location.hostname === 'localhost'
  });

  // Always use Vercel URL, ignore any cached environment variables
  return vercelUrl;
};

const API_BASE_URL = getApiBaseUrl();

console.log('✅ Final API Base URL:', API_BASE_URL);
console.log('🚫 NO OLD URLS - USING VERCEL ONLY');

export const API_ENDPOINTS = {
  // Auth endpoints
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
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