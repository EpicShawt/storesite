const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🔍 DEBUG SERVER - Checking MongoDB Connection...');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dqu1xuwye',
  api_key: process.env.CLOUDINARY_API_KEY || '754696618625517',
  api_secret: process.env.CLOUDINARY_API_SECRET || '1ymxPv746iaQD3B0komsleIEQB4'
});

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
  originalPrice: { type: Number },
  description: { type: String, required: true },
  category: { type: String, required: true },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    cloudinaryUrl: { type: String, required: true }
  }],
  sizes: [{ type: String }],
  stock: { type: Map, of: Number },
  productLink: { type: String, default: '' },
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  sales: { type: Number, default: 0 }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
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

// Root endpoint - Debug info
app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    message: 'DEBUG SERVER - Asur Wears Backend',
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
    cors: 'ENABLED',
    database: dbStatus,
    cloudinary: 'Configured',
    collections: ['products'],
    debug: true
  });
});

// Debug endpoint - Check all products
app.get('/api/debug/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    console.log('🔍 DEBUG: Found products:', products.length);
    
    res.json({
      success: true,
      count: products.length,
      products: products,
      debug: true
    });
  } catch (error) {
    console.error('❌ DEBUG: Error fetching products:', error);
    res.status(500).json({ error: error.message, debug: true });
  }
});

// Debug endpoint - Add test product
app.post('/api/debug/add-test-product', async (req, res) => {
  try {
    const testProduct = new Product({
      name: 'DEBUG Test Product ' + Date.now(),
      price: 999,
      description: 'This is a debug test product',
      category: 'Debug',
      images: [{
        url: 'https://via.placeholder.com/400x400?text=DEBUG+Product',
        publicId: 'debug-test-' + Date.now(),
        cloudinaryUrl: 'https://via.placeholder.com/400x400?text=DEBUG+Product'
      }],
      sizes: ['S', 'M', 'L', 'XL'],
      inStock: true
    });
    
    const savedProduct = await testProduct.save();
    console.log('✅ DEBUG: Test product saved:', savedProduct._id);
    
    res.json({
      success: true,
      message: 'Debug test product added successfully',
      product: savedProduct,
      debug: true
    });
  } catch (error) {
    console.error('❌ DEBUG: Error adding test product:', error);
    res.status(500).json({ error: error.message, debug: true });
  }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔍 DEBUG: Login attempt:', { email, password });
  
  if (email === 'akshat@asurwear.com' && password === 'admin@123') {
    const token = jwt.sign({ email, isAdmin: true }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      user: { email, isAdmin: true }
    });
  } else if (email === 'manager@asurwear.com' && password === 'manager@123') {
    const token = jwt.sign({ email, isManager: true }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
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

    console.log('📤 DEBUG: Uploading image to Cloudinary...');
    
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

    console.log('✅ DEBUG: Image uploaded:', result.public_id);
    
    res.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      cloudinaryUrl: result.secure_url
    });
  } catch (error) {
    console.error('❌ DEBUG: Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get products (for customers)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({ inStock: true }).sort({ createdAt: -1 });
    console.log('📦 DEBUG: Fetched products for customers:', products.length);
    res.json(products);
  } catch (error) {
    console.error('❌ DEBUG: Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get products (for admin)
app.get('/api/admin/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    console.log('📦 DEBUG: Admin fetched products:', products.length);
    res.json(products);
  } catch (error) {
    console.error('❌ DEBUG: Error fetching admin products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add product (admin)
app.post('/api/admin/products', async (req, res) => {
  try {
    const productData = req.body;
    console.log('➕ DEBUG: Adding product:', productData.name);
    console.log('➕ DEBUG: Product data:', JSON.stringify(productData, null, 2));
    
    const product = new Product(productData);
    const savedProduct = await product.save();
    
    console.log('✅ DEBUG: Product saved successfully:', savedProduct._id);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('❌ DEBUG: Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product', details: error.message });
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
          console.log('🗑️ DEBUG: Deleted image:', image.publicId);
        } catch (cloudinaryError) {
          console.error('❌ DEBUG: Error deleting from Cloudinary:', cloudinaryError);
        }
      }
    }
    
    await Product.findByIdAndDelete(req.params.id);
    console.log('🗑️ DEBUG: Product deleted:', req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ DEBUG: Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 DEBUG Server running on port ${PORT}`);
  console.log('🌐 CORS: ENABLED');
  console.log('📊 Database: MongoDB Connected');
  console.log('☁️ Cloudinary: Configured');
  console.log('🔍 DEBUG: Enabled');
  console.log('✅ Ready to accept requests');
});

module.exports = app; 