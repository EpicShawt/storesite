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

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching products for home page from:', API_ENDPOINTS.PRODUCTS)
      
      // Add cache-busting parameter
      const url = `${API_ENDPOINTS.PRODUCTS}?t=${Date.now()}`
      console.log('🔍 Cache-busting URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      const data = await response.json()
      
      console.log('📦 Products fetched for home:', data.length)
      console.log('📦 Products data:', data)
      
      if (response.ok) {
        // Show first 4 products as featured
        setFeaturedProducts(data.slice(0, 4))
        // Store in localStorage for caching
        localStorage.setItem('asurwear_products', JSON.stringify(data))
        // Clear any old cached data
        localStorage.removeItem('asurwears_products')
      } else {
        console.error('❌ Failed to fetch products:', data)
        toast.error('Failed to load products')
        // Fallback to cached products if available
        const cachedProducts = localStorage.getItem('asurwear_products')
        if (cachedProducts) {
          const products = JSON.parse(cachedProducts)
          setFeaturedProducts(products.slice(0, 4))
        }
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      toast.error('Failed to load products')
      // Fallback to cached products if available
      const cachedProducts = localStorage.getItem('asurwear_products')
      if (cachedProducts) {
        const products = JSON.parse(cachedProducts)
        setFeaturedProducts(products.slice(0, 4))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
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
              transition={{ duration: 0.6, delay: 0.1 }}
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
              transition={{ duration: 0.6, delay: 0.3 }}
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

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold"
            >
              Featured Products
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                to="/products"
                className="btn btn-outline btn-primary"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loading loading-spinner loading-lg"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id || product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <RefreshCw className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No products available</h3>
              <p className="text-gray-600 mb-4">
                Products will appear here once they are added from the admin panel
              </p>
              <button
                onClick={fetchProducts}
                className="btn btn-primary"
              >
                Refresh Products
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Ad Banner */}
      <AdBanner />
    </div>
  )
}

export default Home 