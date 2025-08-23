import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Truck, Shield, RefreshCw } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import AdBanner from '../components/AdBanner'
import { API_ENDPOINTS } from '../config/api'
import toast from 'react-hot-toast'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Load products from backend API
  const loadProducts = async () => {
    try {
      setLoading(true)
      console.log('📦 Loading featured products for home page...')
      
      const response = await fetch(API_ENDPOINTS.PRODUCTS)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📦 Products loaded from API:', data.length)
      
      // Filter featured products
      const featured = data.filter(product => product.featured).slice(0, 4)
      setFeaturedProducts(featured)
      
      // Store in localStorage for caching
      localStorage.setItem('asurwears_products', JSON.stringify(data))
      
    } catch (error) {
      console.error('❌ Error loading products:', error)
      
      // Fallback to local data if API fails
      console.log('🔄 Falling back to local data...')
      const localProducts = [
        {
          _id: 1,
          name: "Dark Knight Vibes - Trendy Batman T-Shirt",
          price: 399,
          originalPrice: 999,
          category: "Streetwear",
          description: "Embrace the night with our iconic Batman-inspired t-shirt!",
          images: [{
            url: "/products/prodimgs/prod1.jpeg",
            publicId: "prod1_batman_tshirt",
            cloudinaryUrl: "/products/prodimgs/prod1.jpeg"
          }],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          inStock: true,
          featured: true,
          rating: 4.5,
          reviews: 23
        },
        {
          _id: 2,
          name: "Sharingan Master - Itachi Uchiha Anime T-Shirt",
          price: 299,
          originalPrice: 799,
          category: "Streetwear",
          description: "Channel the power of the Uchiha clan with our stunning Itachi Uchiha anime t-shirt!",
          images: [{
            url: "/products/prodimgs/prod2.jpeg",
            publicId: "prod2_itachi_tshirt",
            cloudinaryUrl: "/products/prodimgs/prod2.jpeg"
          }],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          inStock: true,
          featured: true,
          rating: 4.8,
          reviews: 45
        },
        {
          _id: 4,
          name: "Legendary Asur - Iconic Special Edition T-Shirt",
          price: 399,
          originalPrice: 1299,
          category: "Streetwear",
          description: "🔥 LIMITED EDITION - The Iconic Asur T-Shirt! 🔥",
          images: [{
            url: "/products/prodimgs/prod4.jpeg",
            publicId: "prod4_asur_iconic_tshirt",
            cloudinaryUrl: "/products/prodimgs/prod4.jpeg"
          }],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          inStock: true,
          featured: true,
          rating: 4.9,
          reviews: 67
        }
      ]
      
      setFeaturedProducts(localProducts)
      localStorage.setItem('asurwears_products', JSON.stringify(localProducts))
      toast.error('Failed to load products from server. Using cached data.')
      
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Welcome to Asur Wear
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Discover unique fashion that speaks your language. From trendy streetwear to classic elegance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/products"
              className="btn btn-lg bg-white text-blue-600 hover:bg-gray-100 font-semibold"
            >
              Shop Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/products"
              className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-blue-600"
            >
              View Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders above ₹999</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">Premium quality materials and craftsmanship</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy for your peace of mind</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and trending t-shirts. Each piece is carefully designed 
              to bring out your unique style and personality.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="loading loading-spinner loading-lg"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="h-full"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/products"
              className="btn btn-primary btn-lg"
            >
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <AdBanner />

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600">
              Explore our diverse collection of t-shirts for every occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-blue-500 h-48 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold">Streetwear</h3>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-2">Streetwear Collection</h4>
                <p className="text-gray-600 mb-4">
                  Bold designs and urban aesthetics for the modern generation
                </p>
                <Link to="/products?category=Streetwear" className="text-blue-600 hover:underline">
                  Shop Streetwear →
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-green-500 h-48 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold">Casual</h3>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-2">Casual Collection</h4>
                <p className="text-gray-600 mb-4">
                  Comfortable and stylish t-shirts for everyday wear
                </p>
                <Link to="/products?category=Casual" className="text-green-600 hover:underline">
                  Shop Casual →
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-purple-500 h-48 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold">Limited Edition</h3>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-2">Special Editions</h4>
                <p className="text-gray-600 mb-4">
                  Exclusive designs and limited availability pieces
                </p>
                <Link to="/products" className="text-purple-600 hover:underline">
                  Shop Limited Edition →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 