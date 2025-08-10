const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🔍 MONGO TEST SERVER - Starting...');

// Test MongoDB Connection String
const mongoUri = 'mongodb+srv://asurwears-admin:asurwear@123@asurwear.7g07qfk.mongodb.net/asurwear?retryWrites=true&w=majority';

console.log('🔍 Testing MongoDB connection...');
console.log('🔍 URI:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

// MongoDB Connection
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  console.log('Database:', mongoose.connection.db.databaseName);
  console.log('Host:', mongoose.connection.host);
  console.log('Port:', mongoose.connection.port);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.error('❌ Error name:', err.name);
  console.error('❌ Error message:', err.message);
});

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    message: 'MONGO TEST SERVER - Asur Wears Backend',
    status: 'SUCCESS',
    timestamp: new Date().toISOString(),
    mongodb: dbStatus,
    database: mongoose.connection.db?.databaseName || 'Unknown',
    host: mongoose.connection.host || 'Unknown',
    port: mongoose.connection.port || 'Unknown'
  });
});

// Test MongoDB write
app.post('/api/test-mongo-write', async (req, res) => {
  try {
    console.log('🔍 Testing MongoDB write...');
    
    // Create a test collection
    const testCollection = mongoose.connection.db.collection('test_products');
    
    // Insert a test document
    const testDoc = {
      name: 'Test Product ' + Date.now(),
      price: 999,
      description: 'Test product for MongoDB connection',
      category: 'Test',
      createdAt: new Date()
    };
    
    const result = await testCollection.insertOne(testDoc);
    console.log('✅ Test document inserted:', result.insertedId);
    
    res.json({
      success: true,
      message: 'MongoDB write test successful',
      insertedId: result.insertedId,
      document: testDoc
    });
  } catch (error) {
    console.error('❌ MongoDB write test failed:', error);
    res.status(500).json({
      error: 'MongoDB write test failed',
      details: error.message,
      name: error.name
    });
  }
});

// Test MongoDB read
app.get('/api/test-mongo-read', async (req, res) => {
  try {
    console.log('🔍 Testing MongoDB read...');
    
    const testCollection = mongoose.connection.db.collection('test_products');
    const documents = await testCollection.find({}).limit(5).toArray();
    
    console.log('✅ Found documents:', documents.length);
    
    res.json({
      success: true,
      message: 'MongoDB read test successful',
      count: documents.length,
      documents: documents
    });
  } catch (error) {
    console.error('❌ MongoDB read test failed:', error);
    res.status(500).json({
      error: 'MongoDB read test failed',
      details: error.message,
      name: error.name
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    status: 'OK', 
    message: 'Mongo test server is healthy',
    timestamp: new Date().toISOString(),
    mongodb: dbStatus,
    database: mongoose.connection.db?.databaseName || 'Unknown'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Mongo Test Server running on port ${PORT}`);
  console.log('✅ Ready to test MongoDB connection');
});

module.exports = app; 