import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Truck, Shield, RefreshCw } from 'lucide-react'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    // Load featured products from localStorage or use mock data
    const savedProducts = localStorage.getItem('asiurwear_products')
    if (savedProducts) {
      const products = JSON.parse(savedProducts)
      setFeaturedProducts(products.slice(0, 4)) // Show first 4 products
    } else {
      // Mock featured products
      const mockProducts = [
        {
          id: 1,
          name: "Platform 9¾ T-Shirt",
          price: 499,
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
          description: "Hogwarts-inspired design with Platform 9¾ patch",
          category: "Harry Potter",
          rating: 4.8,
          reviews: 124
        },
        {
          id: 2,
          name: "Tropical State of Mind",
          price: 499,
          image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop",
          description: "Vibrant tropical design with palm tree graphics",
          category: "Tropical",
          rating: 4.6,
          reviews: 89
        },
        {
          id: 3,
          name: "Soulêd Sweater",
          price: 799,
          image: "https://images.unsplash.com/photo-1434389677669-e08b4c3f5b5f?w=400&h=400&fit=crop",
          description: "Oversized cable-knit sweater with embroidered logo",
          category: "Sweaters",
          rating: 4.9,
          reviews: 156
        },
        {
          id: 4,
          name: "Hogwarts House Collection",
          price: 499,
          image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
          description: "All four Hogwarts houses in one stunning design",
          category: "Harry Potter",
          rating: 4.7,
          reviews: 203
        }
      ]
      setFeaturedProducts(mockProducts)
    }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Mythically
                <span className="block text-gradient"> Vibey</span>
              </h1>
              <p className="text-xl text-gray-300">
                Discover our collection of premium t-shirts with unique designs that tell your story. 
                From Harry Potter to tropical vibes, we've got something for every mood.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="btn btn-lg bg-white text-black hover:bg-gray-200 font-semibold"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/products"
                  className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-black"
                >
                  View Collection
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop"
                  alt="Featured Product"
                  className="rounded-lg shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-base-200 p-4 rounded-lg shadow-lg border border-gray-600">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold text-white">4.8/5</span>
                  <span className="text-sm text-gray-400">(2.4k reviews)</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="bg-white/10 p-6 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Free Shipping</h3>
              <p className="text-gray-400">Free shipping on orders above ₹999</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-white/10 p-6 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Quality Assured</h3>
              <p className="text-gray-400">Premium quality materials and craftsmanship</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-white/10 p-6 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Easy Returns</h3>
              <p className="text-gray-400">30-day return policy for your peace of mind</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Featured Products</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover our most popular designs that customers love. 
              Each piece is crafted with attention to detail and unique style.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              to="/products"
              className="btn btn-lg bg-white text-black hover:bg-gray-200 font-semibold"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Promotional Section */}
      <section className="py-16 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Special Offers Available
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Discover amazing deals and discounts on our premium collection. 
              Limited time offers for our valued customers.
            </p>
            <Link
              to="/products"
              className="btn btn-lg bg-white text-black hover:bg-gray-200 font-semibold"
            >
              Shop Now & Save
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home 