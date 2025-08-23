import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, MapPin } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, applyCoupon, getCartTotal, getShippingCost, clearCart, couponCode, discountApplied } = useCart()
  const { user } = useAuth()
  const [couponInput, setCouponInput] = useState('')
  const [pincode, setPincode] = useState('')
  const navigate = useNavigate()

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim())
      setCouponInput('')
    }
  }

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout')
      return
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    toast.success('Proceeding to checkout...')
    // In a real app, this would redirect to a checkout page
  }

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shippingCost = getShippingCost(pincode)
  const total = getCartTotal() + shippingCost

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-base-100 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Cart Items ({cart.length})</h2>
              
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <motion.div
                    key={`${item._id}-${item.size}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    {/* Product Image */}
                    <img
                      src={item.images && item.images.length > 0 ? item.images[0].url : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzE3OS4wOSAxNTAgMTYyIDE2Ny4wOSAxNjIgMTg4QzE2MiAyMDguOTEgMTc5LjA5IDIyNiAyMDAgMjI2QzIyMC45MSAyMjYgMjM4IDIwOC45MSAyMzggMTg4QzIzOCAxNjcuMDkgMjIwLjkxIDE1MCAyMDAgMTUwWk0yMDAgMjQ2QzE3OS4wOSAyNDYgMTYyIDI2My4wOSAxNjIgMjg0QzE2MiAzMDQuOTEgMTc5LjA5IDMyMiAyMDAgMzIyQzIyMC45MSAzMjIgMjM4IDMwNC45MSAyMzggMjg0QzIzOCAyNjMuMDkgMjIwLjkxIDI0NiAyMDAgMjQ2WiIgZmlsbD0iIzlDQTBBNiIvPgo8L3N2Zz4K'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">Size: {item.size}</p>
                      <p className="text-primary font-semibold">₹{item.price}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                        className="btn btn-sm btn-circle btn-outline"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                        className="btn btn-sm btn-circle btn-outline"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Total Price */}
                    <div className="text-right">
                      <p className="font-semibold">₹{item.price * item.quantity}</p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item._id, item.size)}
                      className="btn btn-sm btn-error btn-circle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Clear Cart Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={clearCart}
                  className="btn btn-outline btn-error"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-base-100 rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Coupon Code</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="btn btn-primary"
                  >
                    Apply
                  </button>
                </div>
                {couponCode && (
                  <p className="text-sm text-green-600 mt-2">
                    Coupon applied: {couponCode}
                  </p>
                )}
              </div>

              {/* Shipping */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Shipping Address</label>
                <div className="flex space-x-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-2" />
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter pincode"
                    maxLength={6}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {pincode && (
                  <p className="text-sm text-gray-600 mt-2">
                    Shipping from Noida to {pincode}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.reduce((total, item) => total + item.quantity, 0)} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                
                {discountApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{subtotal}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="mt-6">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full btn btn-primary btn-lg"
                >
                  Proceed to Checkout
                </button>
              </div>

              {!user && (
                <p className="text-sm text-gray-600 mt-2 text-center">
                  <Link to="/login" className="text-primary hover:underline">
                    Login
                  </Link>{' '}
                  or{' '}
                  <Link to="/register" className="text-primary hover:underline">
                    Register
                  </Link>{' '}
                  to checkout
                </p>
              )}

              {/* Continue Shopping */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link to="/products" className="btn btn-outline w-full">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart 