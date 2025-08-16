// Products data - stored locally in the frontend
export const products = [
  {
    _id: 1,
    name: "Dark Knight Vibes - Trendy Batman T-Shirt",
    price: 399,
    originalPrice: 999,
    category: "Streetwear",
    description: "Embrace the night with our iconic Batman-inspired t-shirt! This trendy design features the legendary Dark Knight in a modern, streetwear aesthetic. Perfect for comic book enthusiasts and fashion-forward individuals who want to make a bold statement. Made from premium cotton for ultimate comfort and durability. Whether you're hitting the streets or just chilling, this Batman tee will have you feeling like a superhero!",
    images: [{
      url: "/products/prodimgs/prod1.jpeg",
      publicId: "prod1_batman_tshirt",
      cloudinaryUrl: "/products/prodimgs/prod1.jpeg"
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
      url: "/products/prodimgs/prod2.jpeg",
      publicId: "prod2_itachi_tshirt",
      cloudinaryUrl: "/products/prodimgs/prod2.jpeg"
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
      url: "/products/prodimgs/prod3.jpeg",
      publicId: "prod3_trendy_printed_tshirt",
      cloudinaryUrl: "/products/prodimgs/prod3.jpeg"
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
      url: "/products/prodimgs/prod4.jpeg",
      publicId: "prod4_asur_iconic_tshirt",
      cloudinaryUrl: "/products/prodimgs/prod4.jpeg"
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
      url: "/products/prodimgs/prod5.jpeg",
      publicId: "prod5_money_tshirt",
      cloudinaryUrl: "/products/prodimgs/prod5.jpeg"
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

// Helper functions
export const getProducts = () => {
  return products;
};

export const getProductById = (id) => {
  return products.find(product => product._id == id);
};

export const getFeaturedProducts = () => {
  return products.filter(product => product.featured);
};

export const getProductsByCategory = (category) => {
  return products.filter(product => product.category === category);
};
