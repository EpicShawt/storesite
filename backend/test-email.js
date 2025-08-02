require('dotenv').config();
const brevoService = require('./services/brevoService');

async function testEmailOTP() {
  console.log('🧪 Testing Email OTP Functionality...\n');
  
  // Debug: Check if API key is loaded
  console.log('API Key loaded:', process.env.BREVO_API_KEY ? 'Yes' : 'No');
  console.log('API Key length:', process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.length : 0);
  console.log('API Key preview:', process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.substring(0, 10) + '...' : 'Not found');
  
  const testEmail = 'test@example.com';
  
  try {
    console.log('\n1. Testing OTP email sending...');
    const result = await brevoService.sendOTP(testEmail, '123456');
    
    if (result.success) {
      console.log('✅ OTP email sent successfully!');
      console.log('Message:', result.message);
    } else {
      console.log('❌ Failed to send OTP email');
      console.log('Error:', result.message);
    }
    
    console.log('\n2. Testing welcome email...');
    const welcomeResult = await brevoService.sendWelcomeEmail(testEmail, 'Test User');
    
    if (welcomeResult.success) {
      console.log('✅ Welcome email sent successfully!');
      console.log('Message:', welcomeResult.message);
    } else {
      console.log('❌ Failed to send welcome email');
      console.log('Error:', welcomeResult.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  console.log('\n✨ Email testing completed!');
}

// Run the test
testEmailOTP().catch(console.error); 