import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowLeft, Shield, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { API_ENDPOINTS } from '../config/api'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    
    try {
      console.log('Attempting login to:', API_ENDPOINTS.ADMIN_LOGIN)
      const response = await fetch(API_ENDPOINTS.ADMIN_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      console.log('Login response:', data)

      if (response.ok) {
        // Store admin token
        localStorage.setItem('adminToken', data.token)
        
        // Login user
        login(data.user)
        
        toast.success(data.message)
        navigate('/admin')
      } else {
        toast.error(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Admin login error:', error)
      toast.error('Login failed. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-white mb-6 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Admin Login Card */}
        <div className="bg-base-200 rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-gray-300">
              Access the admin panel to manage products and settings
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  className="w-full pl-10 pr-4 py-3 bg-base-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-12 py-3 bg-base-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-lg bg-white text-black hover:bg-gray-200 font-semibold"
            >
              {isLoading ? (
                <div className="loading loading-spinner loading-sm"></div>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Login Options */}
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-base-300 rounded-lg border border-gray-600">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Admin Access
              </h3>
              <div className="text-xs text-gray-400 space-y-1">
                <p><strong>Email:</strong> akshat@asurwear.com</p>
                <p><strong>Password:</strong> admin@123</p>
                <p className="text-blue-400 mt-2">Full access to all features including product links</p>
              </div>
            </div>

            <div className="p-4 bg-base-300 rounded-lg border border-gray-600">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Order Manager Access
              </h3>
              <div className="text-xs text-gray-400 space-y-1">
                <p><strong>Email:</strong> manager@asurwear.com</p>
                <p><strong>Password:</strong> manager@123</p>
                <p className="text-green-400 mt-2">Limited access for order management</p>
              </div>
            </div>
          </div>

          {/* API Status */}
          <div className="mt-4 p-3 bg-base-300 rounded-lg border border-gray-600">
            <h4 className="text-xs font-semibold text-gray-300 mb-1">API Status</h4>
            <p className="text-xs text-gray-400">
              Backend: {window.location.hostname === 'localhost' ? 'Local' : 'Production'}
            </p>
            <p className="text-xs text-gray-400">
              URL: {API_ENDPOINTS.ADMIN_LOGIN}
            </p>
          </div>

          {/* Regular Login Link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-600">
            <p className="text-gray-300">
              Regular user?{' '}
              <Link to="/login" className="text-white hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin 