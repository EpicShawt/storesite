const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 WORKING MONGO SERVER - Starting...');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dqu1xuwye',
  api_key: '754696618625517',
  api_secret: '1ymxPv746iaQD3B0komsleIEQB4'
});

// MongoDB Connection String
const mongoUri = 'mongodb+srv://asurwears-admin:asurwear@123@asurwear.7g07qfk.mongodb.net/asurwear?retryWrites=true&w=majority';

console.log('🔍 Connecting to MongoDB...');
console.log('🔍 URI:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

// MongoDB Connection with proper error handling
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  bufferMaxEntries: 0
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully!');
  console.log('Database:', mongoose.connection.db.databaseName);
  console.log('Host:', mongoose.connection.host);
  console.log('Port:', mongoose.connection.port);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.error('❌ Error name:', err.name);
  console.error('❌ Error message:', err.message);
  console.error('❌ Error code:', err.code);
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 },
  description: { type: String, required: true },
  category: { type: String, required: true },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    cloudinaryUrl: { type: String, required: true }
  }],
  sizes: { type: [String], default: ['S', 'M', 'L', 'XL', 'XXL'] },
  stock: { type: Map, of: Number, default: new Map() },
  productLink: { type: String, default: '' },
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  sales: { type: Number, default: 0 }
}, {
  timestamps: true,
  strict: false
});

const Product = mongoose.model('Product', productSchema);

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Root endpoint with MongoDB status
app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    message: 'WORKING MONGO SERVER - Asur Wears Backend',
    status: 'SUCCESS',
    timestamp: new Date().toISOString(),
    mongodb: dbStatus,
    database: mongoose.connection.db?.databaseName || 'Unknown',
    host: mongoose.connection.host || 'Unknown',
    readyState: mongoose.connection.readyState,
    working: true
  });
});

// MongoDB status check
app.get('/api/mongo-status', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    mongodb: dbStatus,
    database: mongoose.connection.db?.databaseName || 'Unknown',
    host: mongoose.connection.host || 'Unknown',
    port: mongoose.connection.port || 'Unknown',
    readyState: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    status: 'OK', 
    message: 'Working mongo server is healthy',
    timestamp: new Date().toISOString(),
    mongodb: dbStatus
  });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Login attempt:', { email, password });
  
  if (email === 'akshat@asurwear.com' && password === 'admin@123') {
    const token = jwt.sign({ email, isAdmin: true }, 'secret', { expiresIn: '24h' });
    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      user: { email, isAdmin: true }
    });
  } else if (email === 'manager@asurwear.com' && password === 'manager@123') {
    const token = jwt.sign({ email, isManager: true }, 'secret', { expiresIn: '24h' });
    res.json({
      success: true,
      message: 'Manager login successful',
      token,
      user: { email, isManager: true }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Image upload
app.post('/api/admin/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('📤 Uploading image to Cloudinary...');
    
    const base64Image = req.file.buffer.toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'asurwears',
      resource_type: 'image',
      transformation: [
        { width: 800, height: 800, crop: 'fill' },
        { quality: 'auto:good' }
      ]
    });

    console.log('✅ Image uploaded:', result.public_id);
    
    res.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      cloudinaryUrl: result.secure_url
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get products (for customers)
app.get('/api/products', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('❌ MongoDB not connected, returning empty array');
      return res.json([]);
    }
    
    const products = await Product.find({ inStock: true }).sort({ createdAt: -1 });
    console.log('📦 Fetched products for customers:', products.length);
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

// Get products (for admin)
app.get('/api/admin/products', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('❌ MongoDB not connected, returning empty array');
      return res.json([]);
    }
    
    const products = await Product.find().sort({ createdAt: -1 });
    console.log('📦 Admin fetched products:', products.length);
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching admin products:', error);
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

// Add product (admin) - WITH MONGO DB
app.post('/api/admin/products', async (req, res) => {
  try {
    console.log('➕ Received product data:', JSON.stringify(req.body, null, 2));
    
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.log('❌ MongoDB not connected');
      return res.status(500).json({ 
        error: 'Database not connected', 
        details: 'MongoDB connection is not ready',
        readyState: mongoose.connection.readyState
      });
    }
    
    // Validate required fields
    const { name, price, description, category, images } = req.body;
    
    if (!name || !price || !description || !category) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['name', 'price', 'description', 'category'],
        received: { name, price, description, category }
      });
    }
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ 
        error: 'At least one image is required',
        received: images
      });
    }
    
    // Clean and prepare product data
    const productData = {
      name: String(name).trim(),
      price: Number(price),
      originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : 0,
      description: String(description).trim(),
      category: String(category).trim(),
      images: images.map(img => ({
        url: String(img.url || img.imageUrl || ''),
        publicId: String(img.publicId || ''),
        cloudinaryUrl: String(img.cloudinaryUrl || img.url || img.imageUrl || '')
      })),
      sizes: req.body.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
      productLink: req.body.productLink || '',
      inStock: req.body.inStock !== false,
      featured: req.body.featured === true
    };
    
    console.log('➕ Cleaned product data:', JSON.stringify(productData, null, 2));
    
    const product = new Product(productData);
    const savedProduct = await product.save();
    
    console.log('✅ Product saved successfully to MongoDB:', savedProduct._id);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('❌ Error adding product:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Failed to add product', 
      details: error.message,
      stack: error.stack
    });
  }
});

// Delete product (admin)
app.delete('/api/admin/products/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const product = await Product.findById(req.params.id);
    if (product) {
      // Delete images from Cloudinary
      for (const image of product.images) {
        try {
          await cloudinary.uploader.destroy(image.publicId);
          console.log('🗑️ Deleted image:', image.publicId);
        } catch (cloudinaryError) {
          console.error('❌ Error deleting from Cloudinary:', cloudinaryError);
        }
      }
    }
    
    await Product.findByIdAndDelete(req.params.id);
    console.log('🗑️ Product deleted:', req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    message: 'Working mongo server is working!',
    timestamp: new Date().toISOString(),
    mongodb: dbStatus,
    readyState: mongoose.connection.readyState
  });
});

// Admin test endpoint
app.get('/api/admin/test', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    message: 'Admin test endpoint working!',
    timestamp: new Date().toISOString(),
    mongodb: dbStatus,
    readyState: mongoose.connection.readyState
  });
});

// Test MongoDB write
app.post('/api/test-mongo-write', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ error: 'MongoDB not connected' });
    }
    
    console.log('🔍 Testing MongoDB write...');
    
    const testProduct = new Product({
      name: 'Test Product ' + Date.now(),
      price: 999,
      description: 'Test product for MongoDB connection',
      category: 'Test',
      images: [{
        url: 'https://via.placeholder.com/400x400?text=Test+Product',
        publicId: 'test-' + Date.now(),
        cloudinaryUrl: 'https://via.placeholder.com/400x400?text=Test+Product'
      }],
      sizes: ['S', 'M', 'L', 'XL'],
      inStock: true
    });

    const savedProduct = await testProduct.save();
    console.log('✅ Test product saved to MongoDB:', savedProduct._id);

    res.json({
      success: true,
      message: 'MongoDB write test successful',
      productId: savedProduct._id,
      product: savedProduct
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
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ error: 'MongoDB not connected' });
    }
    
    console.log('🔍 Testing MongoDB read...');
    
    const products = await Product.find().limit(5);
    console.log('✅ Found products in MongoDB:', products.length);
    
    res.json({
      success: true,
      message: 'MongoDB read test successful',
      count: products.length,
      products: products
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

app.listen(PORT, () => {
  console.log(`🚀 Working Mongo Server running on port ${PORT}`);
  console.log('✅ Ready to accept requests');
  console.log('📊 MongoDB connection status:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
});

module.exports = app; 