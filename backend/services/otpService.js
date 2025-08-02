const OTP = require('../models/OTP');
const brevoService = require('./brevoService');

class OTPService {
  constructor() {
    this.storageKey = 'asiurwear_otps';
  }

  // Generate OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP via Brevo
  async sendOTP(email) {
    try {
      const otp = this.generateOTP();
      
      // Store OTP in database
      const otpData = {
        email,
        otp,
        timestamp: Date.now(),
        expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutes
      };
      
      // Save to MongoDB
      await OTP.findOneAndUpdate(
        { email },
        otpData,
        { upsert: true, new: true }
      );
      
      // Send email via Brevo
      const emailResult = await brevoService.sendOTP(email, otp);
      
      if (emailResult.success) {
        console.log(`OTP sent to ${email} via Brevo: ${otp}`);
        return { success: true, message: 'OTP sent successfully to your email' };
      } else {
        console.error('Failed to send OTP via Brevo:', emailResult.message);
        return { success: false, message: 'Failed to send OTP. Please try again.' };
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      return { success: false, message: 'Failed to send OTP' };
    }
  }

  // Verify OTP
  async verifyOTP(email, otp) {
    try {
      // Find OTP in database
      const otpData = await OTP.findOne({ email });
      
      if (!otpData) {
        return { success: false, message: 'No OTP found for this email' };
      }
      
      // Check if OTP is expired
      if (Date.now() > otpData.expiresAt) {
        await OTP.deleteOne({ email });
        return { success: false, message: 'OTP has expired. Please request a new one.' };
      }
      
      // Check if OTP matches
      if (otpData.otp !== otp) {
        return { success: false, message: 'Invalid OTP. Please check and try again.' };
      }
      
      // Clear OTP after successful verification
      await OTP.deleteOne({ email });
      
      return { success: true, message: 'OTP verified successfully' };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { success: false, message: 'Error verifying OTP' };
    }
  }

  // Get stored OTP (for testing)
  async getStoredOTP(email) {
    try {
      const otpData = await OTP.findOne({ email });
      if (otpData && Date.now() <= otpData.expiresAt) {
        return otpData.otp;
      }
      return null;
    } catch (error) {
      console.error('Get stored OTP error:', error);
      return null;
    }
  }

  // Send welcome email
  async sendWelcomeEmail(email, name) {
    try {
      const result = await brevoService.sendWelcomeEmail(email, name);
      return result;
    } catch (error) {
      console.error('Send welcome email error:', error);
      return { success: false, message: 'Failed to send welcome email' };
    }
  }
}

module.exports = new OTPService(); 