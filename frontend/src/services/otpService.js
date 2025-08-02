// OTP service that connects to backend API for email delivery
class OTPService {
  constructor() {

    // Use environment variable or fallback to localhost for development
    this.apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    // For production, if no environment variable is set, try to detect the backend URL
    if (!import.meta.env.VITE_API_URL && window.location.hostname !== 'localhost') {
      // Try to guess the backend URL based on the frontend URL
      const hostname = window.location.hostname;
      if (hostname.includes('vercel.app')) {
        // If frontend is on Vercel, backend is likely on Railway
        this.apiBaseUrl = 'https://asurwears-backend.onrender.com/api';
      }
    }
  }

  // Send OTP via backend API
  async sendOTP(email) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message || 'OTP sent successfully to your email' };
      } else {
        return { success: false, message: data.error || 'Failed to send OTP' };
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  }

  // Verify OTP via backend API
  async verifyOTP(email, otp) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token and user data
        if (data.token) {
              localStorage.setItem('asurwear_token', data.token);
    localStorage.setItem('asurwear_user', JSON.stringify(data.user));
        }
        return { success: true, message: data.message || 'OTP verified successfully' };
      } else {
        return { success: false, message: data.error || 'Failed to verify OTP' };
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  }

  // Get stored OTP (for testing - this will be removed in production)
  async getStoredOTP(email) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/get-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.otp) {
        return data.otp;
      }
      return null;
    } catch (error) {
      console.error('Get stored OTP error:', error);
      return null;
    }
  }

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const userData = localStorage.getItem('asurwear_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('asurwear_token');
  }

  // Clear auth data
  clearAuth() {
    localStorage.removeItem('asurwear_token');
    localStorage.removeItem('asurwear_user');
  }
}

export default new OTPService(); 