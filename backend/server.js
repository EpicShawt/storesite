const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
require('dotenv').config();

// Import Supabase setup
const { db, supabase } = require('./supabase-setup');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

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

// Root route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Asur Wears Backend is running!',
    timestamp: new Date().toISOString(),
    database: 'Supabase + Google Sheets',
    endpoints: {
      test: '/api/test',
      health: '/api/health',
      products: '/api/products',
      upload: '/api/admin/upload-image'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Asur Wears API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'Supabase + Google Sheets'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Backend is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const products = await db.getProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = await db.addProduct(req.body);
    res.json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await db.deleteProduct(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Admin routes
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check admin credentials
    const adminCredentials = {
      'akshat@asurwear.com': 'admin123',
      'manager@asurwear.com': 'manager@123'
    };

    if (adminCredentials[email] && adminCredentials[email] === password) {
      const isAdmin = email === 'akshat@asurwear.com';
      const isManager = email === 'manager@asurwear.com';
      
      const token = require('jsonwebtoken').sign(
        { email, isAdmin, isManager },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token,
        user: { email, isAdmin, isManager }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Image upload endpoint
app.post('/api/admin/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Process image with Sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(800, 800, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload to Supabase Storage
    const imageUrl = await db.uploadFile({
      ...req.file,
      buffer: processedImage
    });

    res.json({
      success: true,
      imageUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Test upload endpoint (no auth required)
app.post('/api/admin/upload-image-test', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Process image with Sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(800, 800, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload to Supabase Storage
    const imageUrl = await db.uploadFile({
      ...req.file,
      buffer: processedImage
    });

    res.json({
      success: true,
      imageUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Admin products management
app.get('/api/admin/products', async (req, res) => {
  try {
    const products = await db.getProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching admin products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/admin/products', async (req, res) => {
  try {
    const product = await db.addProduct(req.body);
    res.json(product);
  } catch (error) {
    console.error('Error adding admin product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.delete('/api/admin/products/:id', async (req, res) => {
  try {
    await db.deleteProduct(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting admin product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Database: Supabase + Google Sheets');
}); 