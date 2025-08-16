// API Configuration
const getApiBaseUrl = () => {
  // Check if we're in development or production
  const isDevelopment = import.meta.env.DEV;
  
  // Use environment variable if available, otherwise use appropriate fallback
  let backendUrl = import.meta.env.VITE_API_URL;
  
  if (!backendUrl) {
    // Fallback URLs based on environment
    if (isDevelopment) {
      backendUrl = 'http://localhost:5000';
    } else {
      backendUrl = 'https://asurwearcom-backend.vercel.app';
    }
  }

  console.log('🔧 Environment:', isDevelopment ? 'Development' : 'Production');
  console.log('🔧 API URL:', backendUrl);
  console.log('🔧 VITE_API_URL from env:', import.meta.env.VITE_API_URL);

  return backendUrl;
};

const API_BASE_URL = getApiBaseUrl();

console.log('✅ Final API Base URL:', API_BASE_URL);

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