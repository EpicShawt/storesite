const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

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

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
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

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Asur Wears Backend is RUNNING!',
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
    cors: 'ENABLED',
    database: 'MongoDB Connected',
    cloudinary: 'Configured'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is healthy',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Connected',
    cloudinary: 'Configured'
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

// Image upload endpoint
app.post('/api/admin/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('Uploading image to Cloudinary...');
    
    // Convert buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'asurwears',
      resource_type: 'image',
      transformation: [
        { width: 800, height: 800, crop: 'fill' },
        { quality: 'auto:good' }
      ]
    });

    console.log('Image uploaded successfully:', result.public_id);
    
    res.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      cloudinaryUrl: result.secure_url
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get all products (for customers)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({ inStock: true }).sort({ createdAt: -1 });
    console.log('Fetched products:', products.length);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get all products (for admin)
app.get('/api/admin/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    console.log('Admin fetched products:', products.length);
    res.json(products);
  } catch (error) {
    console.error('Error fetching admin products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add new product (admin)
app.post('/api/admin/products', async (req, res) => {
  try {
    const productData = req.body;
    console.log('Adding product:', productData);
    
    const product = new Product(productData);
    await product.save();
    
    console.log('Product saved successfully:', product._id);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
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
          console.log('Deleted image from Cloudinary:', image.publicId);
        } catch (cloudinaryError) {
          console.error('Error deleting from Cloudinary:', cloudinaryError);
        }
      }
    }
    
    await Product.findByIdAndDelete(req.params.id);
    console.log('Product deleted:', req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Connected',
    cloudinary: 'Configured'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple Server running on port ${PORT}`);
  console.log('🌐 CORS: ENABLED');
  console.log('📊 Database: MongoDB Connected');
  console.log('☁️ Cloudinary: Configured');
  console.log('✅ Ready to accept requests');
});

module.exports = app; 