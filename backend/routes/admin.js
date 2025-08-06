const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

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
    
    if (!user.isAdmin && !user.isManager) {
      return res.status(403).json({ error: 'Admin/Manager access required' });
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

    // Check for admin credentials (hidden from client)
    const adminCredentials = {
      'akshat@asurwears.com': 'admin@123',
      'manager@asurwear.com': 'manager@123'
    };

    if (adminCredentials[email] && adminCredentials[email] === password) {
      // Find or create admin/manager user
      let adminUser = await User.findOne({ email });
      
      if (!adminUser) {
        const isManager = email === 'manager@asurwear.com';
        adminUser = new User({
          name: isManager ? 'Order Manager' : 'Akshat',
          email: email,
          password: password,
          isAdmin: !isManager,
          isManager: isManager
        });
        await adminUser.save();
      }

      const token = jwt.sign(
        { 
          userId: adminUser._id, 
          email: adminUser.email, 
          isAdmin: adminUser.isAdmin,
          isManager: adminUser.isManager
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          isAdmin: adminUser.isAdmin,
          isManager: adminUser.isManager
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Image upload endpoint
router.post('/upload-image', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Process image with sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Check file size (should be under 120KB)
    if (processedImage.length > 120 * 1024) {
      return res.status(400).json({ error: 'Image size must be under 120KB after compression' });
    }

    // Convert to base64 for storage
    const base64Image = `data:image/jpeg;base64,${processedImage.toString('base64')}`;

    res.json({
      success: true,
      imageUrl: base64Image,
      size: processedImage.length
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

// Get dashboard stats
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ isAdmin: false, isManager: false });
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

// Add new product
router.post('/products', authenticateAdmin, async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, images, sizes, stock, productLink } = req.body;

    const product = new Product({
      name,
      description,
      price,
      originalPrice,
      category,
      images,
      sizes,
      stock,
      productLink: req.user.isAdmin ? productLink : undefined // Only admin can see product links
    });

    await product.save();
    res.json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Update product
router.put('/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Only admin can update product links
    if (!req.user.isAdmin) {
      delete updateData.productLink;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
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