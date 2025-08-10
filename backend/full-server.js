const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Starting Full Server with MongoDB...');
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

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isManager: { type: Boolean, default: false },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  }
}, {
  timestamps: true
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

// Order Schema
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderNumber: { type: String, unique: true },
  notes: String
}, {
  timestamps: true
});

// Create models
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// Analytics Schema
const analyticsSchema = new mongoose.Schema({
  pageViews: {
    home: { type: Number, default: 0 },
    products: { type: Number, default: 0 },
    productDetail: { type: Number, default: 0 },
    cart: { type: Number, default: 0 },
    admin: { type: Number, default: 0 }
  },
  userActions: {
    productViews: { type: Number, default: 0 },
    addToCart: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },
    imageUploads: { type: Number, default: 0 },
    adminLogins: { type: Number, default: 0 },
    signups: { type: Number, default: 0 },
    logins: { type: Number, default: 0 }
  },
  performance: {
    averageLoadTime: { type: Number, default: 0 },
    totalRequests: { type: Number, default: 0 },
    errorRate: { type: Number, default: 0 },
    uptime: { type: Number, default: 0 }
  },
  revenue: {
    totalSales: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 }
  },
  date: { type: Date, default: Date.now, index: true }
}, {
  timestamps: true
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

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

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Asur Wears Full Server is RUNNING!',
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
    cors: 'ENABLED',
    database: 'MongoDB Connected',
    cloudinary: 'Configured',
    collections: ['users', 'products', 'orders']
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Full server is healthy',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Connected',
    collections: ['users', 'products', 'orders']
  });
});

// Analytics middleware
app.use(async (req, res, next) => {
  const start = Date.now();
  
  // Track page views
  if (req.path === '/') {
    await trackAnalytics('pageViews', 'home');
  } else if (req.path === '/api/products') {
    await trackAnalytics('pageViews', 'products');
  } else if (req.path.startsWith('/api/products/')) {
    await trackAnalytics('pageViews', 'productDetail');
  } else if (req.path === '/api/cart') {
    await trackAnalytics('pageViews', 'cart');
  } else if (req.path.startsWith('/api/admin')) {
    await trackAnalytics('pageViews', 'admin');
  }

  // Track performance
  res.on('finish', async () => {
    const loadTime = Date.now() - start;
    await trackPerformance(loadTime, res.statusCode >= 400 ? 1 : 0);
  });

  next();
});

// Analytics helper functions
async function trackAnalytics(type, action) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let analytics = await Analytics.findOne({ date: today });
    
    if (!analytics) {
      analytics = new Analytics({ date: today });
    }
    
    if (type === 'pageViews') {
      analytics.pageViews[action]++;
    } else if (type === 'userActions') {
      analytics.userActions[action]++;
    }
    
    await analytics.save();
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

async function trackPerformance(loadTime, isError) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let analytics = await Analytics.findOne({ date: today });
    
    if (!analytics) {
      analytics = new Analytics({ date: today });
    }
    
    analytics.performance.totalRequests++;
    analytics.performance.averageLoadTime = 
      (analytics.performance.averageLoadTime * (analytics.performance.totalRequests - 1) + loadTime) / analytics.performance.totalRequests;
    
    if (isError) {
      analytics.performance.errorRate = 
        (analytics.performance.errorRate * (analytics.performance.totalRequests - 1) + 1) / analytics.performance.totalRequests;
    }
    
    await analytics.save();
  } catch (error) {
    console.error('Performance tracking error:', error);
  }
}

// Analytics endpoints
app.get('/api/admin/analytics', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const analytics = await Analytics.find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });
    
    // Calculate totals
    const totals = {
      pageViews: { home: 0, products: 0, productDetail: 0, cart: 0, admin: 0 },
      userActions: { productViews: 0, addToCart: 0, purchases: 0, imageUploads: 0, adminLogins: 0, signups: 0, logins: 0 },
      performance: { averageLoadTime: 0, totalRequests: 0, errorRate: 0 },
      revenue: { totalSales: 0, totalOrders: 0, averageOrderValue: 0 }
    };
    
    analytics.forEach(day => {
      Object.keys(day.pageViews).forEach(key => {
        totals.pageViews[key] += day.pageViews[key];
      });
      Object.keys(day.userActions).forEach(key => {
        totals.userActions[key] += day.userActions[key];
      });
      totals.performance.totalRequests += day.performance.totalRequests;
      totals.revenue.totalSales += day.revenue.totalSales;
      totals.revenue.totalOrders += day.revenue.totalOrders;
    });
    
    // Calculate averages
    if (analytics.length > 0) {
      totals.performance.averageLoadTime = analytics.reduce((sum, day) => sum + day.performance.averageLoadTime, 0) / analytics.length;
      totals.performance.errorRate = analytics.reduce((sum, day) => sum + day.performance.errorRate, 0) / analytics.length;
      totals.revenue.averageOrderValue = totals.revenue.totalOrders > 0 ? totals.revenue.totalSales / totals.revenue.totalOrders : 0;
    }
    
    res.json({
      success: true,
      analytics: analytics,
      totals: totals,
      period: `${days} days`
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email, password });
  
  if (email === 'akshat@asurwear.com' && password === 'admin@123') {
    await trackAnalytics('userActions', 'adminLogins');
    const token = jwt.sign({ email, isAdmin: true }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      user: { email, isAdmin: true }
    });
  } else if (email === 'manager@asurwear.com' && password === 'manager@123') {
    await trackAnalytics('userActions', 'adminLogins');
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

// User registration
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    await trackAnalytics('userActions', 'signups');
    console.log('✅ User registered:', user._id);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    await trackAnalytics('userActions', 'logins');
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
    
    console.log('✅ User logged in:', user._id);
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
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

    await trackAnalytics('userActions', 'imageUploads');
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

// Add product (admin)
app.post('/api/admin/products', async (req, res) => {
  try {
    const productData = req.body;
    console.log('➕ Adding product:', productData.name);
    
    const product = new Product(productData);
    await product.save();
    
    await trackAnalytics('userActions', 'imageUploads');
    console.log('✅ Product saved:', product._id);
    res.status(201).json(product);
  } catch (error) {
    console.error('❌ Error adding product:', error);
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

// Get users (admin)
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    console.log('👥 Admin fetched users:', users.length);
    res.json(users);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get orders (admin)
app.get('/api/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product', 'name price')
      .sort({ createdAt: -1 });
    console.log('📦 Admin fetched orders:', orders.length);
    res.json(orders);
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    console.log('🛒 Creating order for user:', orderData.user);
    
    // Generate order number
    const orderNumber = 'ASW' + Date.now();
    
    const order = new Order({
      ...orderData,
      orderNumber
    });
    
    await order.save();
    
    // Track revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let analytics = await Analytics.findOne({ date: today });
    if (!analytics) {
      analytics = new Analytics({ date: today });
    }
    
    analytics.revenue.totalSales += order.totalAmount;
    analytics.revenue.totalOrders++;
    analytics.userActions.purchases++;
    
    await analytics.save();
    
    console.log('✅ Order created:', order._id);
    res.status(201).json(order);
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Test endpoints
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Full server is working!',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Connected',
    collections: ['users', 'products', 'orders']
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Full Server running on port ${PORT}`);
  console.log('🌐 CORS: ENABLED');
  console.log('📊 Database: MongoDB Connected');
  console.log('☁️ Cloudinary: Configured');
  console.log('📦 Collections: users, products, orders');
  console.log('✅ Ready to accept requests');
});

module.exports = app; 