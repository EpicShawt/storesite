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

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching products from:', API_ENDPOINTS.PRODUCTS)
      
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
      
      console.log('📦 Products fetched:', data.length)
      console.log('📦 Products data:', data)
      
      if (response.ok) {
        setProducts(data)
        // Store in localStorage for caching
        localStorage.setItem('asurwears_products', JSON.stringify(data))
        // Clear any old cached data
        localStorage.removeItem('asurwear_products')
      } else {
        console.error('❌ Failed to fetch products:', data)
        toast.error('Failed to load products')
        // Fallback to cached products if available
        const cachedProducts = localStorage.getItem('asurwears_products')
        if (cachedProducts) {
          setProducts(JSON.parse(cachedProducts))
        }
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      toast.error('Failed to load products')
      // Fallback to cached products if available
      const cachedProducts = localStorage.getItem('asurwears_products')
      if (cachedProducts) {
        setProducts(JSON.parse(cachedProducts))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
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
        }
        return product.price >= min
      })
    }

    // Rating filter
    if (filters.rating) {
      const minRating = Number(filters.rating)
      filtered = filtered.filter(product => product.rating >= minRating)
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, filters])

  const categories = [...new Set(products.map(p => p.category))]
  const priceRanges = [
    { label: 'Under ₹300', value: '0-300' },
    { label: '₹300 - ₹500', value: '300-500' },
    { label: '₹500 - ₹800', value: '500-800' },
    { label: 'Above ₹800', value: '800-999999' }
  ]

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      rating: '',
      size: ''
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          <p className="text-gray-600">
            {filteredProducts.length} products found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Category</h4>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <h4 className="font-medium mb-3">Price Range</h4>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Prices</option>
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Minimum Rating</h4>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3.0">3.0+ Stars</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <div className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product, index) => (
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
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={fetchProducts}
                  className="mt-4 btn btn-primary"
                >
                  Refresh Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products 