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

  const handleAddToCart = () => {
    addToCart(product, selectedSize)
  }

  const handleQuickAdd = () => {
    addToCart(product, 'M') // Default size for quick add
  }

  return (
    <motion.div
      className="group bg-base-100 rounded-lg shadow-md overflow-hidden card-hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
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
            className="bg-primary hover:bg-primary-focus text-primary-content p-2 rounded-full shadow-md"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-primary text-primary-content text-xs px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-500 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">
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
          <div className="flex space-x-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 text-sm rounded border transition-colors ${
                  selectedSize === size
                    ? 'bg-primary text-primary-content border-primary'
                    : 'border-gray-300 hover:border-primary'
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
          className="w-full btn btn-primary"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  )
}

export default ProductCard 