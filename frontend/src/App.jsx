import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Banner from './components/Banner'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => setIsLoading(false), 2000)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4 text-white">W</div>
                      <div className="text-white text-xl font-semibold mb-2">Loading Asur Wear...</div>
          <div className="text-gray-400 text-sm">Mythically Vibey</div>
          <div className="mt-4">
            <div className="loading loading-spinner loading-lg text-white"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <Banner />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App 