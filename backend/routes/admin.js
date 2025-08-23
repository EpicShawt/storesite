const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order'); // Added Order model
const { uploadToCloudinary } = require('../services/cloudinaryService');
const bcrypt = require('bcryptjs'); // Added bcrypt for password hashing

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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

// Test admin endpoint
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Admin API is accessible',
    timestamp: new Date().toISOString(),
    endpoints: {
      login: 'POST /api/admin/login',
      upload: 'POST /api/admin/upload-image',
      products: 'GET /api/admin/products',
      dashboard: 'GET /api/admin/dashboard'
    }
  });
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Secure admin credentials (hidden from client)
    const adminCredentials = {
      'akshat': 'akshat'
    };

    if (adminCredentials[username] && adminCredentials[username] === password) {
      // Find or create admin user
      let adminUser = await User.findOne({ email: 'akshat@asurwears.com' });
      
      if (!adminUser) {
        adminUser = new User({
          name: 'Akshat',
          email: 'akshat@asurwears.com',
          password: await bcrypt.hash(password, 12),
          isAdmin: true,
          isManager: false
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

// Simple image upload endpoint (for testing)
router.post('/upload-image-test', upload.single('image'), async (req, res) => {
  try {
    console.log('Test image upload request received');
    console.log('Files:', req.file);
    console.log('Headers:', req.headers);

    if (!req.file) {
      console.log('No file provided');
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Process image with sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    console.log('Image processed, size:', processedImage.length);

    // Convert to base64 for storage
    const base64Image = `data:image/jpeg;base64,${processedImage.toString('base64')}`;

    console.log('Image converted to base64, length:', base64Image.length);

    res.json({
      success: true,
      imageUrl: base64Image,
      size: processedImage.length,
      message: 'Test upload successful'
    });
  } catch (error) {
    console.error('Test image upload error:', error);
    res.status(500).json({ 
      error: 'Failed to process image',
      details: error.message 
    });
  }
});

// Image upload endpoint with Cloudinary storage
router.post('/upload-image', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    console.log('Image upload request received');
    console.log('Files:', req.file);
    console.log('Headers:', req.headers);

    if (!req.file) {
      console.log('No file provided');
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Process image with sharp (square aspect ratio like Meesho)
    const processedImage = await sharp(req.file.buffer)
      .resize(800, 800, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 80 })
      .toBuffer();

    console.log('Image processed, size:', processedImage.length);

    // Check file size (should be under 120KB)
    if (processedImage.length > 120 * 1024) {
      return res.status(400).json({ 
        error: `Image size (${Math.round(processedImage.length / 1024)}KB) exceeds the maximum allowed size (120KB). Please crop or compress the image.` 
      });
    }

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(processedImage);
    
    if (!cloudinaryResult.success) {
      return res.status(500).json({ 
        error: 'Failed to upload to cloud storage',
        details: cloudinaryResult.error 
      });
    }

    console.log('Image uploaded to Cloudinary:', cloudinaryResult.url);

    // Also save locally as backup
    const timestamp = Date.now();
    const filename = `product_${timestamp}.jpg`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, processedImage);

    // Convert to base64 for database storage
    const base64Image = `data:image/jpeg;base64,${processedImage.toString('base64')}`;

    console.log('Image saved locally:', filepath);

    res.json({
      success: true,
      imageUrl: base64Image,
      cloudinaryUrl: cloudinaryResult.url,
      publicId: cloudinaryResult.publicId,
      localUrl: `/uploads/${filename}`,
      size: processedImage.length,
      message: 'Image uploaded successfully to cloud storage',
      storage: {
        cloudinary: cloudinaryResult.url,
        local: filepath,
        database: 'base64'
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ 
      error: 'Failed to process image',
      details: error.message 
    });
  }
});

// Get dashboard stats with real data
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    // Basic stats
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ isAdmin: false, isManager: false });
    const activeProducts = await Product.countDocuments({ inStock: true });
    
    // Order statistics
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    
    // Sales analytics
    const totalSales = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const monthlySales = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);
    
    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('items.product', 'name images');
    
    // Top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);
    
    // Customer insights
    const totalCustomers = await Order.distinct('customer.phone').length;
    const repeatCustomers = await Order.aggregate([
      {
        $group: {
          _id: '$customer.phone',
          orderCount: { $sum: 1 }
        }
      },
      { $match: { orderCount: { $gt: 1 } } },
      { $count: 'count' }
    ]);
    
    res.json({
      stats: {
        totalProducts,
        totalUsers,
        activeProducts,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalSales: totalSales[0]?.total || 0,
        totalCustomers,
        repeatCustomers: repeatCustomers[0]?.count || 0
      },
      analytics: {
        monthlySales,
        topProducts,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get all orders for admin
router.get('/orders', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { orderNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    const orders = await Order.find(query)
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalOrders: total
      }
    });
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
router.put('/orders/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      id, 
      { 
        status,
        notes: notes || undefined,
        estimatedDelivery: status === 'shipped' ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) : undefined
      },
      { new: true }
    ).populate('items.product', 'name images price');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get order details
router.get('/orders/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id)
      .populate('items.product', 'name images price description');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
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