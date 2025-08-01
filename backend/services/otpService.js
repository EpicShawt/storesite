const nodemailer = require('nodemailer');
const OTP = require('../models/OTP');

// Email transporter (using Gmail)
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD
    }
  });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'Asur Wears - OTP Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Asur Wears</h1>
            <p style="margin: 10px 0 0 0;">Mythically Vibey</p>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">OTP Verification</h2>
            <p style="color: #666; line-height: 1.6;">
              Your OTP for Asur Wears account verification is:
            </p>
            <div style="background: #fff; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #667eea; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">
              This OTP will expire in 10 minutes. Do not share this OTP with anyone.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              If you didn't request this OTP, please ignore this email.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Save OTP to database
const saveOTP = async (email, otp, type = 'login') => {
  try {
    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });
    
    // Create new OTP
    const otpDoc = new OTP({
      email,
      otp,
      type,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });
    
    await otpDoc.save();
    return true;
  } catch (error) {
    console.error('OTP save error:', error);
    return false;
  }
};

// Verify OTP
const verifyOTP = async (email, otp) => {
  try {
    const otpDoc = await OTP.findOne({
      email,
      otp,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpDoc) {
      return { valid: false, message: 'Invalid or expired OTP' };
    }

    // Mark OTP as used
    otpDoc.isUsed = true;
    await otpDoc.save();

    return { valid: true, message: 'OTP verified successfully' };
  } catch (error) {
    console.error('OTP verification error:', error);
    return { valid: false, message: 'Error verifying OTP' };
  }
};

// Send OTP (main function)
const sendOTP = async (email, type = 'login') => {
  try {
    const otp = generateOTP();
    
    // Save OTP to database
    const saved = await saveOTP(email, otp, type);
    if (!saved) {
      return { success: false, message: 'Failed to save OTP' };
    }

    // Send OTP via email
    const sent = await sendOTPEmail(email, otp);
    if (!sent) {
      return { success: false, message: 'Failed to send OTP' };
    }

    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Send OTP error:', error);
    return { success: false, message: 'Failed to send OTP' };
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  generateOTP
}; 