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

// In-memory storage for products and orders
let products = [];
let orders = [];
let productId = 1;
let orderId = 1;

// Add the 5 new products with proper descriptions
const newProducts = [
  {
    _id: productId++,
    name: "Dark Knight Vibes - Trendy Batman T-Shirt",
    price: 399,
    originalPrice: 999,
    category: "Streetwear",
    description: "Embrace the night with our iconic Batman-inspired t-shirt! This trendy design features the legendary Dark Knight in a modern, streetwear aesthetic. Perfect for comic book enthusiasts and fashion-forward individuals who want to make a bold statement. Made from premium cotton for ultimate comfort and durability. Whether you're hitting the streets or just chilling, this Batman tee will have you feeling like a superhero!",
    images: [{
      url: "https://res.cloudinary.com/dqu1xuwye/image/upload/v1703123456/prod1_batman_tshirt.jpg",
      publicId: "prod1_batman_tshirt",
      cloudinaryUrl: "https://res.cloudinary.com/dqu1xuwye/image/upload/v1703123456/prod1_batman_tshirt.jpg"
    }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    featured: true,
    views: 0,
    sales: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: productId++,
    name: "Sharingan Master - Itachi Uchiha Anime T-Shirt",
    price: 299,
    originalPrice: 799,
    category: "Streetwear",
    description: "Channel the power of the Uchiha clan with our stunning Itachi Uchiha anime t-shirt! This masterpiece showcases the legendary ninja with his iconic Sharingan eyes and mysterious aura. Perfect for anime lovers and Naruto fans who appreciate the depth and complexity of this beloved character. The high-quality print captures every detail, from his flowing hair to the intricate patterns. Wear your anime pride with style and comfort!",
    images: [{
      url: "https://res.cloudinary.com/dqu1xuwye/image/upload/v1703123456/prod2_itachi_tshirt.jpg",
      publicId: "prod2_itachi_tshirt",
      cloudinaryUrl: "https://res.cloudinary.com/dqu1xuwye/image/upload/v1703123456/prod2_itachi_tshirt.jpg"
    }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    featured: true,
    views: 0,
    sales: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: productId++,
    name: "Urban Canvas - Trendy Printed T-Shirt",
    price: 349,
    originalPrice: 699,
    category: "Casual",
    description: "Express yourself with our versatile trendy printed t-shirt! This urban canvas features a unique, eye-catching design that's perfect for everyday wear. The comfortable fit and breathable fabric make it ideal for any occasion - from casual hangouts to street photography sessions. The artistic print adds a touch of personality to your wardrobe while maintaining that effortless cool factor. Stand out from the crowd with this must-have piece!",
    images: [{
      url: "https://res.cloudinary.com/dqu1xuwye/image/upload/v1703123456/prod3_trendy_printed_tshirt.jpg",
      publicId: "prod3_trendy_printed_tshirt",
      cloudinaryUrl: "https://res.cloudinary.com/dqu1xuwye/image/upload/v1703123456/prod3_trendy_printed_tshirt.jpg"
    }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    featured: false,
    views: 0,
    sales: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: productId++,
    name: "Legendary Asur - Iconic Special Edition T-Shirt",
    price: 399,
    originalPrice: 1299,
    category: "Streetwear",
    description: "🔥 LIMITED EDITION - The Iconic Asur T-Shirt! 🔥 This special edition piece celebrates the legendary Asur with a design that's as bold and powerful as the character itself. Premium quality fabric with intricate detailing that captures the essence of this iconic figure. Perfect for collectors and fans who want to own a piece of legend. The exclusive design and superior craftsmanship make this a must-have for any true Asur enthusiast. Don't miss out on this legendary piece!",
    images: [{
      url: "https://res.cloudinary.com/dqu1xuwye/image/upload/v1703123456/prod4_asur_iconic_tshirt.jpg",
      publicId: "prod4_asur_iconic_tshirt",
      cloudinaryUrl: "https://res.cloudinary.com/dqu1xuwye/image/upload/v1703123456/prod4_asur_iconic_tshirt.jpg"
    }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    featured: true,
    views: 0,
    sales: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: productId++,
    name: "Money Moves - New Gen Money T-Shirt",
    price: 299,
    originalPrice: 899,
    category: "Streetwear",
    description: "💰 Make your money moves with our New Gen Money T-Shirt! 💰 This trendy design is perfect for the ambitious, money-minded generation who aren't afraid to show their hustle. The bold graphics and premium quality make a statement about success and ambition. Whether you're building your empire or just love the aesthetic, this t-shirt screams confidence and style. Perfect for entrepreneurs, hustlers, and anyone who believes in the power of financial freedom!",
    images: [{
      url: "https://res.cloudinary.com/dqu1xuwye/image/upload/v1703123456/prod5_money_tshirt.jpg",
      publicId: "prod5_money_tshirt",
      cloudinaryUrl: "https://res.cloudinary.com/dqu1xuwye/image/upload/v1703123456/prod5_money_tshirt.jpg"
    }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    featured: false,
    views: 0,
    sales: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Initialize with new products
products = [...newProducts];

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
    products: products.length,
    orders: orders.length
  });
});

// Products API
app.get('/api/products', (req, res) => {
  try {
    console.log('📦 Products requested, returning', products.length, 'products');
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = products.find(p => p._id == req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Orders API
app.post('/api/orders/create', (req, res) => {
  try {
    const {
      customer,
      items,
      totalAmount,
      paymentMethod = 'cod',
      notes
    } = req.body;

    // Validate customer details
    if (!customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({
        success: false,
        message: 'Customer details are required (name, phone, address)'
      });
    }

    // Validate address details
    const { address } = customer;
    if (!address.street || !address.area || !address.city || !address.state || !address.pinCode) {
      return res.status(400).json({
        success: false,
        message: 'Complete address details are required (street, area, city, state, pinCode)'
      });
    }

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one item is required'
      });
    }

    // Generate order number
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const orderCount = orders.length + 1;
    const orderNumber = `ASUR${year}${month}${day}${orderCount.toString().padStart(3, '0')}`;

    // Create order
    const order = {
      _id: orderId++,
      customer,
      items,
      totalAmount,
      paymentMethod,
      notes,
      orderNumber,
      status: 'pending',
      paymentStatus: 'pending',
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.push(order);

    console.log('📦 Order created:', orderNumber);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        estimatedDelivery: order.estimatedDelivery,
        status: order.status
      }
    });

  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

app.get('/api/orders', (req, res) => {
  try {
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const order = orders.find(o => o._id == req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

app.get('/api/orders/number/:orderNumber', (req, res) => {
  try {
    const order = orders.find(o => o.orderNumber === req.params.orderNumber);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

app.get('/api/orders/customer/:phone', (req, res) => {
  try {
    const customerOrders = orders.filter(o => o.customer.phone === req.params.phone);
    res.json({
      success: true,
      data: customerOrders
    });
  } catch (error) {
    console.error('❌ Error fetching customer orders:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Admin routes
app.post('/api/admin/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Simple admin authentication
    if (email === 'admin@asurwears.com' && password === 'admin123') {
      const token = jwt.sign({ email, isAdmin: true }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
      res.json({ success: true, token, message: 'Admin login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    products: products.length,
    orders: orders.length
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Loaded ${products.length} products`);
  console.log(`📋 Orders system ready`);
}); 