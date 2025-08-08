const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

// Import services
const cloudinaryService = require('./services/cloudinaryService');
const analyticsService = require('./services/analyticsService');

// Import models
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/asurwears', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(mongoSanitize());
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

// Analytics middleware
app.use(async (req, res, next) => {
  const start = Date.now();
  
  // Track page views
  if (req.path === '/') {
    await analyticsService.trackPageView('home');
  } else if (req.path === '/products') {
    await analyticsService.trackPageView('products');
  } else if (req.path.startsWith('/product/')) {
    await analyticsService.trackPageView('productDetail');
  } else if (req.path === '/cart') {
    await analyticsService.trackPageView('cart');
  } else if (req.path.startsWith('/admin')) {
    await analyticsService.trackPageView('admin');
  }

  // Track performance
  res.on('finish', async () => {
    const loadTime = Date.now() - start;
    await analyticsService.trackPerformance({
      loadTime,
      totalRequests: 1,
      errorRate: res.statusCode >= 400 ? 1 : 0
    });
  });

  next();
});

// Root route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Asur Wears Backend is running!',
    timestamp: new Date().toISOString(),
    database: 'MongoDB + Cloudinary',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    endpoints: {
      test: '/api/test',
      health: '/api/health',
      products: '/api/products',
      upload: '/api/admin/upload-image',
      analytics: '/api/admin/analytics',
      signup: '/api/auth/signup',
      login: '/api/auth/login'
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
    database: 'MongoDB + Cloudinary',
    uptime: process.uptime()
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

// User Authentication Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      isAdmin: false,
      isManager: false
    });

    await user.save();
    await analyticsService.trackUserAction('signups');

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        isManager: user.isManager
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        isAdmin: user.isAdmin, 
        isManager: user.isManager 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    await analyticsService.trackUserAction('logins');

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        isManager: user.isManager
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({ inStock: true }).sort({ createdAt: -1 });
    await analyticsService.trackUserAction('productViews');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    await analyticsService.trackUserAction('imageUploads');
    res.json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      // Delete images from Cloudinary
      for (const image of product.images) {
        await cloudinaryService.deleteImage(image.publicId);
      }
    }
    await Product.findByIdAndDelete(req.params.id);
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
      
      const token = jwt.sign(
        { email, isAdmin, isManager },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );

      await analyticsService.trackUserAction('adminLogins');

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

    // Upload to Cloudinary
    const result = await cloudinaryService.uploadImage(req.file);
    
    await analyticsService.trackUserAction('imageUploads');

    res.json({
      success: true,
      imageUrl: result.url,
      publicId: result.publicId,
      cloudinaryUrl: result.cloudinaryUrl
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

    // Upload to Cloudinary
    const result = await cloudinaryService.uploadImage(req.file);
    
    await analyticsService.trackUserAction('imageUploads');

    res.json({
      success: true,
      imageUrl: result.url,
      publicId: result.publicId,
      cloudinaryUrl: result.cloudinaryUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Admin products management
app.get('/api/admin/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching admin products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/admin/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    await analyticsService.trackUserAction('imageUploads');
    res.json(product);
  } catch (error) {
    console.error('Error adding admin product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.delete('/api/admin/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      // Delete images from Cloudinary
      for (const image of product.images) {
        await cloudinaryService.deleteImage(image.publicId);
      }
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting admin product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Analytics endpoint
app.get('/api/admin/analytics', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const analytics = await analyticsService.getDashboardAnalytics(days);
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('📊 Database: MongoDB + Cloudinary');
  console.log('📈 Analytics: Enabled');
  console.log('🌐 Environment:', process.env.NODE_ENV || 'development');
}); 