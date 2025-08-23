import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('M')
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart()

  const sizes = ['S', 'M', 'L', 'XL', 'XXL']

  // Get the first image from the images array
  const productImage = product.images && product.images.length > 0 ? product.images[0].url : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzE3OS4wOSAxNTAgMTYyIDE2Ny4wOSAxNjIgMTg4QzE2MiAyMDguOTEgMTc5LjA5IDIyNiAyMDAgMjI2QzIyMC45MSAyMjYgMjM4IDIwOC45MSAyMzggMTg4QzIzOCAxNjcuMDkgMjIwLjkxIDE1MCAyMDAgMTUwWk0yMDAgMjQ2QzE3OS4wOSAyNDYgMTYyIDI2My4wOSAxNjIgMjg0QzE2MiAzMDQuOTEgMTc5LjA5IDMyMiAyMDAgMzIyQzIyMC45MSAzMjIgMjM4IDMwNC45MSAyMzggMjg0QzIzOCAyNjMuMDkgMjIwLjkxIDI0NiAyMDAgMjQ2WiIgZmlsbD0iIzlDQTBBNiIvPgo8L3N2Zz4K'
  
  // Add default rating and reviews if not present
  const rating = product.rating || 4.5
  const reviews = product.reviews || Math.floor(Math.random() * 50) + 10

  const handleAddToCart = () => {
    addToCart(product, selectedSize)
  }

  const handleQuickAdd = () => {
    addToCart(product, 'M') // Default size for quick add
  }

  return (
    <motion.div
      className="group bg-base-200 rounded-lg shadow-xl overflow-hidden card-hover border border-gray-700 h-full flex flex-col"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden flex-shrink-0">
        <Link to={`/product/${product._id}`}>
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        
        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={handleQuickAdd}
            className="bg-white hover:bg-gray-200 text-black p-2 rounded-full shadow-md"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-white text-black text-xs px-2 py-1 rounded-full font-semibold">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-lg mb-2 text-white hover:text-gray-300 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-400 text-sm mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? 'text-yellow-500 fill-current'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-400">
            ({reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Size Selection */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-2 py-1 text-xs rounded border transition-colors ${
                  selectedSize === size
                    ? 'bg-white text-black border-white'
                    : 'border-gray-600 text-gray-300 hover:border-white hover:text-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full btn bg-white text-black hover:bg-gray-200 font-semibold mt-auto"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  )
}

export default ProductCard 