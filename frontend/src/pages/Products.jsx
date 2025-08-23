import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Filter, Grid, List, Search, Star } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { API_ENDPOINTS } from '../config/api'
import toast from 'react-hot-toast'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    rating: '',
    size: ''
  })

  const searchQuery = searchParams.get('search') || ''

  // Load products from backend API
  const loadProducts = async () => {
    try {
      setLoading(true)
      console.log('📦 Loading products from backend API...')
      
      const response = await fetch(API_ENDPOINTS.PRODUCTS)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📦 Products loaded from API:', data.length)
      
      setProducts(data)
      
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
          _id: 3,
          name: "Urban Canvas - Trendy Printed T-Shirt",
          price: 349,
          originalPrice: 699,
          category: "Casual",
          description: "Express yourself with our versatile trendy printed t-shirt!",
          images: [{
            url: "/products/prodimgs/prod3.jpeg",
            publicId: "prod3_trendy_printed_tshirt",
            cloudinaryUrl: "/products/prodimgs/prod3.jpeg"
          }],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          inStock: true,
          featured: false,
          rating: 4.3,
          reviews: 18
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
        },
        {
          _id: 5,
          name: "Money Moves - New Gen Money T-Shirt",
          price: 299,
          originalPrice: 899,
          category: "Streetwear",
          description: "💰 Make your money moves with our New Gen Money T-Shirt! 💰",
          images: [{
            url: "/products/prodimgs/prod5.jpeg",
            publicId: "prod5_money_tshirt",
            cloudinaryUrl: "/products/prodimgs/prod5.jpeg"
          }],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          inStock: true,
          featured: false,
          rating: 4.6,
          reviews: 34
        }
      ]
      
      setProducts(localProducts)
      localStorage.setItem('asurwears_products', JSON.stringify(localProducts))
      toast.error('Failed to load products from server. Using cached data.')
      
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    // Filter products based on search and filters
    let filtered = products

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number)
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max
        } else {
          return product.price >= min
        }
      })
    }

    // Rating filter
    if (filters.rating) {
      const rating = parseInt(filters.rating)
      filtered = filtered.filter(product => product.rating >= rating)
    }

    // Size filter
    if (filters.size) {
      filtered = filtered.filter(product => 
        product.sizes && product.sizes.includes(filters.size)
      )
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, filters])

  // Get unique categories
  const categories = [...new Set(products.map(product => product.category))]

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      rating: '',
      size: ''
    })
  }

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value
    if (value) {
      setSearchParams({ search: value })
    } else {
      setSearchParams({})
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
              <p className="text-gray-600 mt-1">
                Discover our collection of trendy and comfortable t-shirts
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  Clear all
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Prices</option>
                  <option value="0-299">Under ₹299</option>
                  <option value="300-399">₹300 - ₹399</option>
                  <option value="400-499">₹400 - ₹499</option>
                  <option value="500-999">₹500+</option>
                </select>
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Size</h4>
                <select
                  value={filters.size}
                  onChange={(e) => handleFilterChange('size', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Sizes</option>
                  <option value="S">Small (S)</option>
                  <option value="M">Medium (M)</option>
                  <option value="L">Large (L)</option>
                  <option value="XL">Extra Large (XL)</option>
                  <option value="XXL">2XL</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {filteredProducts.length} products found
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${
                    viewMode === 'grid' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${
                    viewMode === 'list' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <motion.div
                className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                    : 'grid-cols-1'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full"
                  >
                    <ProductCard 
                      product={product} 
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products 