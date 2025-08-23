import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, MapPin, Phone, User, CreditCard, Truck } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { API_ENDPOINTS } from '../config/api'
import toast from 'react-hot-toast'

const Checkout = () => {
  const navigate = useNavigate()
  const { cart, getCartTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pinCode: '',
    paymentMethod: 'cod'
  })

  const subtotal = getCartTotal()
  const shippingCost = subtotal >= 999 ? 0 : 50
  const total = subtotal + shippingCost

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    // Validate form
    const requiredFields = ['name', 'phone', 'street', 'area', 'city', 'state', 'pinCode']
    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return
      }
    }

    // Validate phone number
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    // Validate PIN code
    if (!/^\d{6}$/.test(formData.pinCode)) {
      toast.error('Please enter a valid 6-digit PIN code')
      return
    }

    setLoading(true)

    try {
      // Prepare order data
      const orderData = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          address: {
            street: formData.street,
            area: formData.area,
            city: formData.city,
            state: formData.state,
            pinCode: formData.pinCode
          }
        },
        items: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          size: item.size,
          price: item.price
        })),
        totalAmount: total,
        paymentMethod: formData.paymentMethod,
        notes: `Order placed on ${new Date().toLocaleDateString()}`
      }

      console.log('📦 Creating order:', orderData)

      // Send order to backend
      const response = await fetch(API_ENDPOINTS.ORDERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create order')
      }

      const result = await response.json()
      console.log('✅ Order created successfully:', result)

      // Clear cart
      clearCart()

      // Show success message
      toast.success(`Order placed successfully! Order number: ${result.order.orderNumber}`)

      // Redirect to order confirmation
      navigate(`/order-confirmation/${result.order.orderNumber}`)

    } catch (error) {
      console.error('❌ Order creation error:', error)
      toast.error(error.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to checkout</p>
          <button 
            onClick={() => navigate('/products')}
            className="btn btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="lg:order-2">
            <div className="bg-base-100 rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div key={`${item._id}-${item.size}`} className="flex items-center space-x-4">
                    <img
                      src={item.images && item.images.length > 0 ? item.images[0].url : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzE3OS4wOSAxNTAgMTYyIDE2Ny4wOSAxNjIgMTg4QzE2MiAyMDguOTEgMTc5LjA5IDIyNiAyMDAgMjI2QzIyMC45MSAyMjYgMjM4IDIwOC45MSAyMzggMTg4QzIzOCAxNjcuMDkgMjIwLjkxIDE1MCAyMDAgMTUwWk0yMDAgMjQ2QzE3OS4wOSAyNDYgMTYyIDI2My4wOSAxNjIgMjg0QzE2MiAzMDQuOTEgMTc5LjA5IDMyMiAyMDAgMzIyQzIyMC45MSAzMjIgMjM4IDMwNC45MSAyMzggMjg0QzIzOCAyNjMuMDkgMjIwLjkxIDI0NiAyMDAgMjQ2WiIgZmlsbD0iIzlDQTBBNiIvPgo8L3N2Zz4K'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                      <p className="text-primary font-semibold">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {shippingCost === 0 && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
                  🎉 Free shipping on orders above ₹999!
                </div>
              )}
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:order-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div className="bg-base-100 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="10-digit phone number"
                      maxLength="10"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Email (Optional)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-base-100 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="House/Flat number, Street name"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Area/Locality *</label>
                      <input
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Area or locality"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="City"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="State"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">PIN Code *</label>
                      <input
                        type="text"
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="6-digit PIN code"
                        maxLength="6"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-base-100 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </h2>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="text-primary"
                    />
                    <span>Cash on Delivery (COD)</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleInputChange}
                      className="text-primary"
                    />
                    <span>UPI Payment</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={handleInputChange}
                      className="text-primary"
                    />
                    <span>Online Payment (Card/Net Banking)</span>
                  </label>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary btn-lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="loading loading-spinner loading-sm mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Place Order - ₹{total}
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
