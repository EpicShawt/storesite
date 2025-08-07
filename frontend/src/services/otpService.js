// OTP service that connects to backend API for email delivery
import { API_ENDPOINTS } from '../config/api';

class OTPService {
  constructor() {
    // Use the same API configuration as the rest of the app
    this.apiBaseUrl = API_ENDPOINTS.LOGIN.replace('/api/auth/login', '');
    console.log('🔧 OTP Service API URL:', this.apiBaseUrl);
  }

  // Send OTP via backend API
  async sendOTP(email) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/auth/send-otp`, {
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
      const response = await fetch(`${this.apiBaseUrl}/api/auth/verify-otp`, {
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
      const response = await fetch(`${this.apiBaseUrl}/api/auth/get-otp`, {
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