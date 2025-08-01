import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import otpService from '../services/otpService'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSendOTP = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsLoading(true)
    try {
      const result = await otpService.sendOTP(email)
      if (result.success) {
        setIsOtpSent(true)
        toast.success('OTP sent successfully! Check console for OTP code.')
        console.log('OTP Code:', otpService.getStoredOTP())
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    
    if (!otp) {
      toast.error('Please enter the OTP')
      return
    }

    setIsLoading(true)
    try {
      const result = await otpService.verifyOTP(email, otp)
      if (result.success) {
        // Create user session
        const user = {
          email,
          name: email.split('@')[0],
          isAdmin: email.includes('admin')
        }
        login(user)
        toast.success('Login successful!')
        navigate('/')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Failed to verify OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsLoading(true)
    try {
      const result = await otpService.sendOTP(email)
      if (result.success) {
        toast.success('OTP resent successfully! Check console for OTP code.')
        console.log('OTP Code:', otpService.getStoredOTP())
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Failed to resend OTP')
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

        {/* Login Card */}
        <div className="bg-base-200 rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300">
              {isOtpSent ? 'Enter the OTP sent to your email' : 'Sign in to your account'}
            </p>
          </div>

          {!isOtpSent ? (
            // Email Form
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-base-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
                    required
                  />
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
                  'Send OTP'
                )}
              </button>
            </form>
          ) : (
            // OTP Form
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  OTP Code
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-3 bg-base-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-center text-lg tracking-widest text-white placeholder-gray-400"
                    required
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  OTP sent to <span className="font-medium text-white">{email}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Check browser console for OTP code (for testing)
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-lg bg-white text-black hover:bg-gray-200 font-semibold"
              >
                {isLoading ? (
                  <div className="loading loading-spinner loading-sm"></div>
                ) : (
                  'Verify OTP'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-sm text-gray-300 hover:text-white hover:underline"
                >
                  Didn't receive? Resend OTP
                </button>
              </div>
            </form>
          )}

          {/* Register Link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-600">
            <p className="text-gray-300">
              Don't have an account?{' '}
              <Link to="/register" className="text-white hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>

          {/* Admin Login Hint */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              Admin? Use <span className="text-white">akshat@asurwears.com</span> for admin access
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login 