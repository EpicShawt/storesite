const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Asur Wears Backend is RUNNING!',
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
    cors: 'ENABLED'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is healthy',
    timestamp: new Date().toISOString()
  });
});

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email, password });
  
  // Admin credentials - FIXED TO MATCH FRONTEND
  if (email === 'akshat@asurwear.com' && password === 'admin@123') {
    res.json({
      success: true,
      message: 'Admin login successful',
      user: { email, isAdmin: true }
    });
  } else if (email === 'manager@asurwear.com' && password === 'manager@123') {
    res.json({
      success: true,
      message: 'Manager login successful',
      user: { email, isManager: true }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// Products endpoint
app.get('/api/products', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Test Product',
      price: 999,
      description: 'This is a test product'
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`🚀 Simple Server running on port ${PORT}`);
  console.log('🌐 CORS: ENABLED');
  console.log('✅ Ready to accept requests');
});

module.exports = app; 