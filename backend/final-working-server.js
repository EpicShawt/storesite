const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 FINAL WORKING SERVER - Starting...');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dqu1xuwye',
  api_key: '754696618625517',
  api_secret: '1ymxPv746iaQD3B0komsleIEQB4'
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://asurwears-admin:asurwear%40123@asurwear.7g07qfk.mongodb.net/asurwears?retryWrites=true&w=majority', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  console.log('Database:', mongoose.connection.db.databaseName);
  console.log('Host:', mongoose.connection.host);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.error('❌ Error name:', err.name);
  console.error('❌ Error message:', err.message);
});

// Flexible Product Schema
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
  strict: false // Allow additional fields
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
    message: 'FINAL WORKING SERVER - Asur Wears Backend',
    status: 'SUCCESS',
    timestamp: new Date().toISOString(),
    mongodb: dbStatus,
    database: mongoose.connection.db?.databaseName || 'Unknown',
    host: mongoose.connection.host || 'Unknown',
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
  res.json({ 
    status: 'OK', 
    message: 'Final working server is healthy',
    timestamp: new Date().toISOString()
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
    const products = await Product.find({ inStock: true }).sort({ createdAt: -1 });
    console.log('📦 Fetched products for customers:', products.length);
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get products (for admin)
app.get('/api/admin/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    console.log('📦 Admin fetched products:', products.length);
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching admin products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add product (admin) - ENHANCED ERROR HANDLING
app.post('/api/admin/products', async (req, res) => {
  try {
    console.log('➕ Received product data:', JSON.stringify(req.body, null, 2));
    
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
    
    console.log('✅ Product saved successfully:', savedProduct._id);
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
  res.json({ 
    message: 'Final working server is working!',
    timestamp: new Date().toISOString()
  });
});

// Admin test endpoint
app.get('/api/admin/test', (req, res) => {
  res.json({ 
    message: 'Admin test endpoint working!',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint - test product creation
app.post('/api/debug/add-test-product', async (req, res) => {
  try {
    const testProduct = new Product({
      name: 'Test Product ' + Date.now(),
      price: 999,
      description: 'This is a test product',
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

app.listen(PORT, () => {
  console.log(`🚀 Final Working Server running on port ${PORT}`);
  console.log('✅ Ready to accept requests');
});

module.exports = app; 