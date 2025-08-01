import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Filter, Grid, List, Search, Star } from 'lucide-react'
import ProductCard from '../components/ProductCard'

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

  useEffect(() => {
    // Load products from localStorage or use mock data
    const savedProducts = localStorage.getItem('asurwears_products')
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      // Mock products data
      const mockProducts = [
        {
          id: 1,
          name: "Platform 9¾ T-Shirt",
          price: 499,
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
          description: "Hogwarts-inspired design with Platform 9¾ patch",
          category: "Harry Potter",
          rating: 4.8,
          reviews: 124,
          sizes: ['S', 'M', 'L', 'XL', 'XXL']
        },
        {
          id: 2,
          name: "Tropical State of Mind",
          price: 499,
          image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop",
          description: "Vibrant tropical design with palm tree graphics",
          category: "Tropical",
          rating: 4.6,
          reviews: 89,
          sizes: ['S', 'M', 'L', 'XL', 'XXL']
        },
        {
          id: 3,
          name: "Soulêd Sweater",
          price: 799,
          image: "https://images.unsplash.com/photo-1434389677669-e08b4c3f5b5f?w=400&h=400&fit=crop",
          description: "Oversized cable-knit sweater with embroidered logo",
          category: "Sweaters",
          rating: 4.9,
          reviews: 156,
          sizes: ['S', 'M', 'L', 'XL', 'XXL']
        },
        {
          id: 4,
          name: "Hogwarts House Collection",
          price: 499,
          image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
          description: "All four Hogwarts houses in one stunning design",
          category: "Harry Potter",
          rating: 4.7,
          reviews: 203,
          sizes: ['S', 'M', 'L', 'XL', 'XXL']
        },
        {
          id: 5,
          name: "Vintage Rock Tee",
          price: 449,
          image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop",
          description: "Classic rock band inspired vintage t-shirt",
          category: "Vintage",
          rating: 4.5,
          reviews: 67,
          sizes: ['S', 'M', 'L', 'XL', 'XXL']
        },
        {
          id: 6,
          name: "Minimalist Logo Tee",
          price: 399,
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
          description: "Clean minimalist design with subtle branding",
          category: "Minimalist",
          rating: 4.4,
          reviews: 92,
          sizes: ['S', 'M', 'L', 'XL', 'XXL']
        }
      ]
      setProducts(mockProducts)
      localStorage.setItem('asurwears_products', JSON.stringify(mockProducts))
    }
    setLoading(false)
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-base-100 rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchParams({ search: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                <label className="block text-sm font-medium mb-2">Minimum Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Any Rating</option>
                  {[4, 3, 2, 1].map(rating => (
                    <option key={rating} value={rating}>
                      {rating}+ Stars
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-primary-content' : 'bg-gray-200'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-primary-content' : 'bg-gray-200'}`}
                >
                  <List className="w-5 h-5" />
                </button>
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
                    key={product.id}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products 