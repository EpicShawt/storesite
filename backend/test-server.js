const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Test Backend is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Test Backend is working',
    timestamp: new Date().toISOString()
  });
});

// Test MongoDB connection
app.get('/api/test-mongo', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    
    // Test connection
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
    
    res.json({ 
      status: 'success', 
      message: 'MongoDB connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'MongoDB connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log('🌐 Environment:', process.env.NODE_ENV || 'development');
}); 