const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 SIMPLE WORKING SERVER - Starting...');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dqu1xuwye',
  api_key: '754696618625517',
  api_secret: '1ymxPv746iaQD3B0komsleIEQB4'
});

// In-memory storage for products (temporary)
let products = [];
let productId = 1;

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// CORS headers - FIXED
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

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'SIMPLE WORKING SERVER - Asur Wears Backend',
    status: 'SUCCESS',
    timestamp: new Date().toISOString(),
    products: products.length,
    working: true
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Simple working server is healthy',
    timestamp: new Date().toISOString(),
    products: products.length
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
app.get('/api/products', (req, res) => {
  try {
    const activeProducts = products.filter(p => p.inStock !== false);
    console.log('📦 Fetched products for customers:', activeProducts.length);
    res.json(activeProducts);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get products (for admin)
app.get('/api/admin/products', (req, res) => {
  try {
    console.log('📦 Admin fetched products:', products.length);
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching admin products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add product (admin) - SIMPLE VERSION
app.post('/api/admin/products', (req, res) => {
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
    
    // Create product object
    const product = {
      _id: productId++,
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
      featured: req.body.featured === true,
      views: 0,
      sales: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('➕ Cleaned product data:', JSON.stringify(product, null, 2));
    
    // Add to products array
    products.push(product);
    
    console.log('✅ Product saved successfully:', product._id);
    console.log('✅ Total products:', products.length);
    
    res.status(201).json(product);
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
app.delete('/api/admin/products/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p._id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = products[productIndex];
    
    // Delete images from Cloudinary
    for (const image of product.images) {
      try {
        cloudinary.uploader.destroy(image.publicId);
        console.log('🗑️ Deleted image:', image.publicId);
      } catch (cloudinaryError) {
        console.error('❌ Error deleting from Cloudinary:', cloudinaryError);
      }
    }
    
    // Remove from products array
    products.splice(productIndex, 1);
    
    console.log('🗑️ Product deleted:', productId);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Simple working server is working!',
    timestamp: new Date().toISOString(),
    products: products.length
  });
});

// Admin test endpoint
app.get('/api/admin/test', (req, res) => {
  res.json({ 
    message: 'Admin test endpoint working!',
    timestamp: new Date().toISOString(),
    products: products.length
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple Working Server running on port ${PORT}`);
  console.log('✅ Ready to accept requests');
  console.log('📦 Products stored in memory');
});

module.exports = app; 