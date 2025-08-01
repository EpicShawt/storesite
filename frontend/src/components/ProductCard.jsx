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
      className="group bg-base-200 rounded-lg shadow-xl overflow-hidden card-hover border border-gray-700"
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
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 text-white hover:text-gray-300 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
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
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-400">
            ({product.reviews})
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
          <div className="flex space-x-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 text-sm rounded border transition-colors ${
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
          className="w-full btn bg-white text-black hover:bg-gray-200 font-semibold"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  )
}

export default ProductCard 