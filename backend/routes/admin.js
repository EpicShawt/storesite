const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

// Middleware to verify admin token
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    if (!user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    req.user = user;
    next();
  });
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check for admin credentials
    if (email === 'akshat@asurwears.com' && password === 'admin@123') {
      // Find or create admin user
      let adminUser = await User.findOne({ email });
      
      if (!adminUser) {
        adminUser = new User({
          name: 'Akshat',
          email: 'akshat@asurwears.com',
          password: 'admin@123',
          isAdmin: true
        });
        await adminUser.save();
      }

      const token = jwt.sign(
        { 
          userId: adminUser._id, 
          email: adminUser.email, 
          isAdmin: true 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Admin login successful',
        token,
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          isAdmin: true
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get dashboard stats
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const activeProducts = await Product.countDocuments({ isActive: true });
    
    // Mock sales data (in real app, this would come from orders)
    const totalSales = 24500;
    const totalOrders = 156;
    
    res.json({
      stats: {
        totalProducts,
        totalUsers,
        activeProducts,
        totalSales,
        totalOrders
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get all products for admin
router.get('/products', authenticateAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Update banner
router.post('/banner', authenticateAdmin, async (req, res) => {
  try {
    const { text } = req.body;
    
    // In a real app, you'd save this to a database
    // For now, we'll just return success
    res.json({ message: 'Banner updated successfully' });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

// Get banner
router.get('/banner', async (req, res) => {
  try {
    // In a real app, you'd fetch this from database
    res.json({ text: '🎉 50% OFF ON ALL PRODUCTS! FREE SHIPPING ON ORDERS ABOVE ₹999 🎉' });
  } catch (error) {
    console.error('Get banner error:', error);
    res.status(500).json({ error: 'Failed to fetch banner' });
  }
});

module.exports = router; 