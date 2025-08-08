const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🔍 Testing MongoDB Connection...');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/asurwears', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  console.log('Database:', mongoose.connection.db.databaseName);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  inStock: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

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

// Test MongoDB connection
app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    message: 'MongoDB Test Server',
    timestamp: new Date().toISOString(),
    mongodb: dbStatus,
    database: mongoose.connection.db?.databaseName || 'Unknown'
  });
});

// Test adding a product
app.post('/api/test-add-product', async (req, res) => {
  try {
    const testProduct = new Product({
      name: 'Test Product ' + Date.now(),
      price: 999,
      description: 'This is a test product',
      category: 'Test',
      images: ['https://via.placeholder.com/300']
    });
    
    const savedProduct = await testProduct.save();
    console.log('✅ Test product saved:', savedProduct._id);
    
    res.json({
      success: true,
      message: 'Test product added successfully',
      product: savedProduct
    });
  } catch (error) {
    console.error('❌ Error adding test product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test getting products
app.get('/api/test-products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    console.log('📦 Found products:', products.length);
    
    res.json({
      success: true,
      count: products.length,
      products: products
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin login test
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'akshat@asurwear.com' && password === 'admin@123') {
    res.json({
      success: true,
      message: 'Admin login successful',
      user: { email, isAdmin: true }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 MongoDB Test Server running on port ${PORT}`);
  console.log('🔍 Testing MongoDB connection...');
});

module.exports = app; 