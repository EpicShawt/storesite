const axios = require('axios');

class BrevoService {
  constructor() {
    this.apiKey = process.env.BREVO_API_KEY;
    this.baseURL = 'https://api.brevo.com/v3';
  }

  async sendOTP(email, otp) {
    try {
      const response = await axios.post(
        `${this.baseURL}/smtp/email`,
        {
          sender: {
            name: 'Asiur Wear',
            email: 'noreply@asiurwear.com'
          },
          to: [
            {
              email: email,
              name: email.split('@')[0]
            }
          ],
          subject: 'Your Asiur Wear Login OTP',
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
              <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #333; margin: 0; font-size: 24px;">Asiur Wear</h1>
                  <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Mythically Vibey</p>
                </div>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Your Login OTP</h2>
                  <p style="color: #666; margin: 0 0 15px 0; font-size: 14px;">
                    Use the following OTP to complete your login:
                  </p>
                  <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border: 2px dashed #007bff; text-align: center;">
                    <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px;">${otp}</span>
                  </div>
                  <p style="color: #666; margin: 15px 0 0 0; font-size: 12px;">
                    This OTP is valid for 10 minutes. Do not share this code with anyone.
                  </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                  <p style="color: #999; margin: 0; font-size: 12px;">
                    If you didn't request this OTP, please ignore this email.
                  </p>
                </div>
              </div>
            </div>
          `
        },
        {
          headers: {
            'api-key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('OTP sent successfully via Brevo:', email);
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Brevo OTP send error:', error.response?.data || error.message);
      return { success: false, message: 'Failed to send OTP' };
    }
  }

  async sendWelcomeEmail(email, name) {
    try {
      const response = await axios.post(
        `${this.baseURL}/smtp/email`,
        {
          sender: {
            name: 'Asiur Wear',
            email: 'noreply@asiurwear.com'
          },
          to: [
            {
              email: email,
              name: name
            }
          ],
          subject: 'Welcome to Asiur Wear!',
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
              <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #333; margin: 0; font-size: 24px;">Welcome to Asiur Wear!</h1>
                  <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Mythically Vibey</p>
                </div>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Hello ${name}!</h2>
                  <p style="color: #666; margin: 0 0 15px 0; font-size: 14px;">
                    Thank you for joining Asiur Wear! We're excited to have you as part of our community.
                  </p>
                  <p style="color: #666; margin: 0; font-size: 14px;">
                    Discover our collection of premium t-shirts with unique designs that tell your story.
                  </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="https://asiurwear.com" style="background-color: #007bff; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    Start Shopping
                  </a>
                </div>
              </div>
            </div>
          `
        },
        {
          headers: {
            'api-key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Welcome email sent successfully via Brevo:', email);
      return { success: true, message: 'Welcome email sent successfully' };
    } catch (error) {
      console.error('Brevo welcome email error:', error.response?.data || error.message);
      return { success: false, message: 'Failed to send welcome email' };
    }
  }
}

module.exports = new BrevoService(); 