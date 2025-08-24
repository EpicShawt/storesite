const mongoose = require('mongoose');

// Test different connection string formats
const connectionStrings = [
  // Original (broken) - @ in password causes issues
  'mongodb+srv://asurwears-admin:asurwear%40123@asurwear.7g07qfk.mongodb.net/asurwears?retryWrites=true&w=majority',

// URL encoded password
'mongodb+srv://asurwears-admin:asurwear%40123@asurwear.7g07qfk.mongodb.net/asurwears?retryWrites=true&w=majority',
  
  // Using environment variable
  process.env.MONGODB_URI
];

async function testConnection(uri, label) {
  console.log(`\n🔍 Testing: ${label}`);
  console.log(`URI: ${uri ? uri.replace(/\/\/.*@/, '//***:***@') : 'undefined'}`);
  
  if (!uri) {
    console.log('❌ No URI provided');
    return;
  }
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected successfully!');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Host:', mongoose.connection.host);
    await mongoose.disconnect();
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('Error code:', error.code);
  }
}

async function runTests() {
  console.log('🚀 Testing MongoDB connections...\n');
  
  for (let i = 0; i < connectionStrings.length; i++) {
    await testConnection(connectionStrings[i], `Connection ${i + 1}`);
  }
  
  console.log('\n🏁 Tests completed');
}

runTests().catch(console.error);

