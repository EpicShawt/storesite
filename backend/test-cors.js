const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// SUPER SIMPLE CORS TEST
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

// Test endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'CORS TEST - Backend is running!',
    timestamp: new Date().toISOString(),
    cors: 'ENABLED',
    test: 'SUCCESS'
  });
});

// Test admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  // Test credentials
  if (email === 'akshat@asurwear.com' && password === 'admin123') {
    res.json({
      success: true,
      message: 'Login successful',
      user: { email, isAdmin: true }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 CORS TEST Server running on port ${PORT}`);
  console.log('🌐 CORS: ENABLED FOR ALL ORIGINS');
}); 