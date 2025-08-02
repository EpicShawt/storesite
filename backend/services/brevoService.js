const axios = require('axios');
const SibApiV3Sdk = require('sib-api-v3-sdk');

class BrevoService {
  constructor() {
    this.apiKey = process.env.BREVO_API_KEY;
    this.baseURL = 'https://api.brevo.com/v3';
    
    // Initialize Brevo SDK
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = this.apiKey;
  }

  async sendOTP(email, otp) {
    try {
      // Use Brevo SDK for sending emails
      const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      
      sendSmtpEmail.subject = 'Your Asur Wear Login OTP';
      sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0; font-size: 24px;">Asur Wear</h1>
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
      `;
      sendSmtpEmail.sender = { name: 'Asur Wear', email: 'noreply@asurwear.com' };
      sendSmtpEmail.to = [{ email: email, name: email.split('@')[0] }];

      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      
      console.log('OTP sent successfully via Brevo:', email);
      return { success: true, message: 'OTP sent successfully to your email' };
    } catch (error) {
      console.error('Brevo OTP send error:', error.response?.data || error.message);
      return { success: false, message: 'Failed to send OTP' };
    }
  }

  async sendWelcomeEmail(email, name) {
    try {
      // Use Brevo SDK for sending emails
      const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      
      sendSmtpEmail.subject = 'Welcome to Asur Wear!';
      sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0; font-size: 24px;">Welcome to Asur Wear!</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Mythically Vibey</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Hello ${name}!</h2>
              <p style="color: #666; margin: 0 0 15px 0; font-size: 14px;">
                Thank you for joining Asur Wear! We're excited to have you as part of our community.
              </p>
              <p style="color: #666; margin: 0; font-size: 14px;">
                Discover our collection of premium t-shirts with unique designs that tell your story.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://asurwear.com" style="background-color: #007bff; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Start Shopping
              </a>
            </div>
          </div>
        </div>
      `;
      sendSmtpEmail.sender = { name: 'Asur Wear', email: 'noreply@asurwear.com' };
      sendSmtpEmail.to = [{ email: email, name: name }];

      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      
      console.log('Welcome email sent successfully via Brevo:', email);
      return { success: true, message: 'Welcome email sent successfully' };
    } catch (error) {
      console.error('Brevo welcome email error:', error.response?.data || error.message);
      return { success: false, message: 'Failed to send welcome email' };
    }
  }

  async createEmailCampaign(campaignData) {
    try {
      const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
      const emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();

      // Define the campaign settings
      emailCampaigns.name = campaignData.name || "Campaign sent via the API";
      emailCampaigns.subject = campaignData.subject || "My subject";
      emailCampaigns.sender = campaignData.sender || {
        name: "Asur Wear",
        email: "noreply@asurwear.com"
      };
      emailCampaigns.type = campaignData.type || "classic";
      emailCampaigns.htmlContent = campaignData.htmlContent || 
        '<p>Congratulations! You successfully sent this example campaign via the Brevo API.</p>';
      
      // Select the recipients
      if (campaignData.recipients) {
        emailCampaigns.recipients = campaignData.recipients;
      } else {
        // Default to a test list or you can specify your list IDs
        emailCampaigns.recipients = { listIds: [2, 7] }; // Replace with your actual list IDs
      }

      // Schedule the campaign if specified
      if (campaignData.scheduledAt) {
        emailCampaigns.scheduledAt = campaignData.scheduledAt;
      }

      // Make the call to the client
      const data = await apiInstance.createEmailCampaign(emailCampaigns);
      
      console.log('Email campaign created successfully:', data);
      return { 
        success: true, 
        message: 'Email campaign created successfully',
        campaignId: data.id 
      };
    } catch (error) {
      console.error('Brevo campaign creation error:', error.response?.data || error.message);
      return { 
        success: false, 
        message: 'Failed to create email campaign',
        error: error.response?.data || error.message 
      };
    }
  }

  async getEmailCampaigns() {
    try {
      const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
      const data = await apiInstance.getEmailCampaigns();
      
      console.log('Email campaigns retrieved successfully');
      return { 
        success: true, 
        message: 'Email campaigns retrieved successfully',
        campaigns: data.campaigns 
      };
    } catch (error) {
      console.error('Brevo get campaigns error:', error.response?.data || error.message);
      return { 
        success: false, 
        message: 'Failed to retrieve email campaigns',
        error: error.response?.data || error.message 
      };
    }
  }

  async sendEmailCampaign(campaignId) {
    try {
      const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
      const data = await apiInstance.sendEmailCampaign(campaignId);
      
      console.log('Email campaign sent successfully:', data);
      return { 
        success: true, 
        message: 'Email campaign sent successfully',
        data: data 
      };
    } catch (error) {
      console.error('Brevo send campaign error:', error.response?.data || error.message);
      return { 
        success: false, 
        message: 'Failed to send email campaign',
        error: error.response?.data || error.message 
      };
    }
  }
}

module.exports = new BrevoService(); 