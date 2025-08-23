import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [couponCode, setCouponCode] = useState('')
  const [discountApplied, setDiscountApplied] = useState(false)

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('asurwears_cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('asurwears_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, size = 'M', quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item._id === product._id && item.size === size
      )

      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prevCart, { ...product, size, quantity }]
      }
    })
    
    toast.success(`${product.name} added to cart!`)
  }

  const removeFromCart = (productId, size) => {
    setCart(prevCart => prevCart.filter(
      item => !(item._id === productId && item.size === size)
    ))
    toast.success('Item removed from cart')
  }

  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size)
      return
    }

    setCart(prevCart => prevCart.map(item =>
      item._id === productId && item.size === size
        ? { ...item, quantity }
        : item
    ))
  }

  const clearCart = () => {
    setCart([])
    setCouponCode('')
    setDiscountApplied(false)
    toast.success('Cart cleared')
  }

  const applyCoupon = (code) => {
    if (code.toUpperCase() === 'DEVSCOTCH') {
      setCouponCode(code)
      setDiscountApplied(true)
      toast.success('Coupon applied! 100% discount!')
      return true
    } else {
      toast.error('Invalid coupon code')
      return false
    }
  }

  const getCartTotal = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    
    if (discountApplied && couponCode.toUpperCase() === 'DEVSCOTCH') {
      return 0 // 100% discount
    }
    
    return subtotal
  }

  const getShippingCost = (pincode) => {
    // Simple shipping calculation based on pincode
    if (!pincode) return 50 // Default shipping
    
    const pincodeNum = parseInt(pincode)
    if (pincodeNum >= 110000 && pincodeNum <= 119999) {
      return 0 // Free shipping for Delhi
    } else if (pincodeNum >= 200000 && pincodeNum <= 299999) {
      return 30 // Reduced shipping for nearby states
    } else {
      return 50 // Standard shipping for rest of India
    }
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    getCartTotal,
    getShippingCost,
    getCartItemCount,
    couponCode,
    discountApplied
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
} 