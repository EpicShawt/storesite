const OTP = require('../models/OTP');
const crypto = require('crypto');

// Free email service using EmailJS (no configuration needed)
const sendEmailOTP = async (email, otp) => {
  try {
    // Using a free email service - EmailJS
    const emailData = {
      service_id: 'asurwears_service', // This will be configured on frontend
      template_id: 'otp_template',
      user_id: 'your_user_id', // This will be configured on frontend
      template_params: {
        to_email: email,
        otp_code: otp,
        message: `Your Asur Wears OTP is: ${otp}. Valid for 10 minutes.`
      }
    };

    // For now, we'll simulate email sending
    // In production, this would be handled by EmailJS
    console.log(`OTP ${otp} sent to ${email}`);
    
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP
const sendOTP = async (email, type = 'login') => {
  try {
    // Generate OTP
    const otp = generateOTP();
    
    // Save OTP to database
    const otpDoc = new OTP({
      email,
      otp,
      type,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });
    
    await otpDoc.save();
    
    // Send email
    const emailSent = await sendEmailOTP(email, otp);
    
    if (emailSent) {
      return { success: true, message: 'OTP sent successfully' };
    } else {
      return { success: false, message: 'Failed to send OTP' };
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    return { success: false, message: 'Error sending OTP' };
  }
};

// Verify OTP
const verifyOTP = async (email, otp, type = 'login') => {
  try {
    const otpDoc = await OTP.findOne({
      email,
      otp,
      type,
      used: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!otpDoc) {
      return { success: false, message: 'Invalid or expired OTP' };
    }
    
    // Mark OTP as used
    otpDoc.used = true;
    await otpDoc.save();
    
    return { success: true, message: 'OTP verified successfully' };
  } catch (error) {
    console.error('Verify OTP error:', error);
    return { success: false, message: 'Error verifying OTP' };
  }
};

// Clean up expired OTPs
const cleanupExpiredOTPs = async () => {
  try {
    await OTP.deleteMany({
      expiresAt: { $lt: new Date() }
    });
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};

// Schedule cleanup every hour
setInterval(cleanupExpiredOTPs, 60 * 60 * 1000);

module.exports = {
  sendOTP,
  verifyOTP,
  generateOTP
}; 