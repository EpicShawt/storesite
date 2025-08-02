const express = require('express');
const router = express.Router();
const brevoService = require('../services/brevoService');

// Create a new email campaign
router.post('/create', async (req, res) => {
  try {
    const {
      name,
      subject,
      sender,
      type,
      htmlContent,
      recipients,
      scheduledAt
    } = req.body;

    const campaignData = {
      name,
      subject,
      sender,
      type,
      htmlContent,
      recipients,
      scheduledAt
    };

    const result = await brevoService.createEmailCampaign(campaignData);

    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message,
        campaignId: result.campaignId
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Campaign creation route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get all email campaigns
router.get('/list', async (req, res) => {
  try {
    const result = await brevoService.getEmailCampaigns();

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        campaigns: result.campaigns
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Get campaigns route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Send an email campaign
router.post('/send/:campaignId', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const result = await brevoService.sendEmailCampaign(campaignId);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Send campaign route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Example campaign creation endpoint with predefined template
router.post('/create-example', async (req, res) => {
  try {
    const campaignData = {
      name: "Welcome Campaign - Asur Wear",
      subject: "Welcome to Asur Wear - Discover Your Style!",
      sender: {
        name: "Asur Wear",
        email: "noreply@asurwear.com"
      },
      type: "classic",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0; font-size: 24px;">Welcome to Asiur Wear!</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Mythically Vibey</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Discover Your Style</h2>
              <p style="color: #666; margin: 0 0 15px 0; font-size: 14px;">
                Welcome to Asiur Wear! We're excited to have you as part of our community.
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
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; margin: 0; font-size: 12px;">
                Thank you for choosing Asiur Wear!
              </p>
            </div>
          </div>
        </div>
      `,
      recipients: { listIds: [2, 7] } // Replace with your actual list IDs
    };

    const result = await brevoService.createEmailCampaign(campaignData);

    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message,
        campaignId: result.campaignId
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Example campaign creation route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router; 