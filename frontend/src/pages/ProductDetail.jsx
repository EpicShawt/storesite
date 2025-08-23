import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ShoppingCart, Heart, Share2, ArrowLeft } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)

  const sizes = ['S', 'M', 'L', 'XL', 'XXL']

  useEffect(() => {
    // Load product data
    const savedProducts = localStorage.getItem('asurwears_products')
    if (savedProducts) {
      const products = JSON.parse(savedProducts)
      const foundProduct = products.find(p => p._id === parseInt(id))
      if (foundProduct) {
        setProduct(foundProduct)
      }
    }
    setLoading(false)
  }, [id])

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity)
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/products" className="btn btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  // Get product images from the images array
  const productImages = product.images && product.images.length > 0 
    ? [
        product.images[0].url,
        product.images[0].url,
        product.images[0].url,
        product.images[0].url
      ]
    : ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzE3OS4wOSAxNTAgMTYyIDE2Ny4wOSAxNjIgMTg4QzE2MiAyMDguOTEgMTc5LjA5IDIyNiAyMDAgMjI2QzIyMC45MSAyMjYgMjM4IDIwOC45MSAyMzggMTg4QzIzOCAxNjcuMDkgMjIwLjkxIDE1MCAyMDAgMTUwWk0yMDAgMjQ2QzE3OS4wOSAyNDYgMTYyIDI2My4wOSAxNjIgMjg0QzE2MiAzMDQuOTEgMTc5LjA5IDMyMiAyMDAgMzIyQzIyMC45MSAzMjIgMjM4IDMwNC45MSAyMzggMjg0QzIzOCAyNjMuMDkgMjIwLjkxIDI0NiAyMDAgMjQ2WiIgZmlsbD0iIzlDQTBBNiIvPgo8L3N2Zz4K']

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center text-amber-100 hover:text-amber-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category Badge */}
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {product.category}
            </div>

            {/* Product Title */}
            <h1 className="text-3xl font-bold text-amber-50 drop-shadow-sm">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-400'
                    }`}
                  />
                ))}
              </div>
              <span className="text-amber-100">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-amber-300">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-amber-50">Description</h3>
              <p className="text-amber-100 leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-amber-50">Select Size</h3>
              <div className="flex space-x-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      selectedSize === size
                        ? 'bg-amber-300 text-gray-900 border-amber-300'
                        : 'border-amber-200 text-amber-100 hover:border-amber-300 hover:text-amber-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-amber-50">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="btn btn-circle btn-outline btn-sm border-amber-200 text-amber-100 hover:border-amber-300 hover:text-amber-50"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center text-amber-50">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                  className="btn btn-circle btn-outline btn-sm border-amber-200 text-amber-100 hover:border-amber-300 hover:text-amber-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn btn-lg bg-amber-300 text-gray-900 hover:bg-amber-400 border-amber-300"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
              <button className="btn btn-outline btn-circle btn-lg border-amber-200 text-amber-100 hover:border-amber-300 hover:text-amber-50">
                <Heart className="w-5 h-5" />
              </button>
              <button className="btn btn-outline btn-circle btn-lg border-amber-200 text-amber-100 hover:border-amber-300 hover:text-amber-50">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Product Details */}
            <div className="border-t border-amber-200 pt-6">
              <h3 className="text-lg font-semibold mb-4 text-amber-50">Product Details</h3>
              <div className="space-y-2 text-sm text-amber-100">
                <div className="flex justify-between">
                  <span>Material:</span>
                  <span>100% Cotton</span>
                </div>
                <div className="flex justify-between">
                  <span>Care:</span>
                  <span>Machine wash cold</span>
                </div>
                <div className="flex justify-between">
                  <span>Fit:</span>
                  <span>Regular fit</span>
                </div>
                <div className="flex justify-between">
                  <span>Origin:</span>
                  <span>Made in India</span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Shipping Information</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Free shipping on orders above ₹999</li>
                <li>• Standard delivery: 3-5 business days</li>
                <li>• Express delivery available</li>
                <li>• Ships from Noida, Uttar Pradesh</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* This would show related products in a real app */}
            <div className="bg-base-100 rounded-lg p-4 text-center">
              <p className="text-gray-500">More products coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail 