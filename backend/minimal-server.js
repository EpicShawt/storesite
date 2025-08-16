const express = require('express');
const app = express();

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

app.use(express.json());

// The 5 products with all details
const products = [
  {
    _id: 1,
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
    _id: 2,
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
    _id: 3,
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
    _id: 4,
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
    _id: 5,
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

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'MINIMAL SERVER - Asur Wears Backend',
    status: 'SUCCESS',
    products: products.length,
    timestamp: new Date().toISOString()
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    products: products.length
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Minimal server is working!',
    timestamp: new Date().toISOString(),
    products: products.length
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Minimal Server running on port ${PORT}`);
  console.log(`📦 Loaded ${products.length} products`);
  console.log(`🌐 Test URL: http://localhost:${PORT}/api/products`);
});

module.exports = app;
