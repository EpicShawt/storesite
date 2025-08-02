const brevoService = require('./services/brevoService');

// Test function to create an email campaign
async function testCreateCampaign() {
  console.log('Testing email campaign creation...');
  
  const campaignData = {
    name: "Test Campaign - Asiur Wear",
    subject: "Welcome to Asiur Wear - Discover Your Style!",
    sender: {
      name: "Asiur Wear",
      email: "noreply@asiurwear.com"
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

  try {
    const result = await brevoService.createEmailCampaign(campaignData);
    
    if (result.success) {
      console.log('✅ Campaign created successfully!');
      console.log('Campaign ID:', result.campaignId);
      console.log('Message:', result.message);
      
      // Optionally send the campaign immediately
      console.log('\nSending campaign...');
      const sendResult = await brevoService.sendEmailCampaign(result.campaignId);
      
      if (sendResult.success) {
        console.log('✅ Campaign sent successfully!');
        console.log('Send result:', sendResult.data);
      } else {
        console.log('❌ Failed to send campaign:', sendResult.message);
        console.log('Error:', sendResult.error);
      }
    } else {
      console.log('❌ Failed to create campaign:', result.message);
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Test function to get all campaigns
async function testGetCampaigns() {
  console.log('\nTesting get campaigns...');
  
  try {
    const result = await brevoService.getEmailCampaigns();
    
    if (result.success) {
      console.log('✅ Campaigns retrieved successfully!');
      console.log('Number of campaigns:', result.campaigns?.length || 0);
      
      if (result.campaigns && result.campaigns.length > 0) {
        console.log('\nRecent campaigns:');
        result.campaigns.slice(0, 3).forEach((campaign, index) => {
          console.log(`${index + 1}. ${campaign.name} (ID: ${campaign.id})`);
        });
      }
    } else {
      console.log('❌ Failed to get campaigns:', result.message);
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
async function runTests() {
  console.log('🚀 Starting Brevo Email Campaign Tests...\n');
  
  await testCreateCampaign();
  await testGetCampaigns();
  
  console.log('\n✨ Tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testCreateCampaign, testGetCampaigns }; 