// Simple OTP service that works without email configuration
class OTPService {
  constructor() {
    // For development/testing, we'll store OTPs in localStorage
    this.storageKey = 'asiurwear_otps';
  }

  // Generate OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP (simulated for now)
  async sendOTP(email) {
    try {
      const otp = this.generateOTP();
      
      // Store OTP in localStorage for testing
      const otpData = {
        email,
        otp,
        timestamp: Date.now(),
        expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutes
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(otpData));
      
      // For now, we'll just log the OTP (in production, this would send email)
      console.log(`OTP for ${email}: ${otp}`);
      console.log('Check browser console (F12) to see the OTP');
      
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Send OTP error:', error);
      return { success: false, message: 'Failed to send OTP' };
    }
  }

  // Verify OTP
  async verifyOTP(email, otp) {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (!storedData) {
        return { success: false, message: 'No OTP found' };
      }

      const otpData = JSON.parse(storedData);
      
      // Check if OTP is for the correct email
      if (otpData.email !== email) {
        return { success: false, message: 'Invalid email' };
      }
      
      // Check if OTP is expired
      if (Date.now() > otpData.expiresAt) {
        localStorage.removeItem(this.storageKey);
        return { success: false, message: 'OTP expired' };
      }
      
      // Check if OTP matches
      if (otpData.otp !== otp) {
        return { success: false, message: 'Invalid OTP' };
      }
      
      // Clear OTP after successful verification
      localStorage.removeItem(this.storageKey);
      
      return { success: true, message: 'OTP verified successfully' };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { success: false, message: 'Error verifying OTP' };
    }
  }

  // Get stored OTP (for testing)
  getStoredOTP() {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        const otpData = JSON.parse(storedData);
        if (Date.now() <= otpData.expiresAt) {
          return otpData.otp;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

export default new OTPService(); 