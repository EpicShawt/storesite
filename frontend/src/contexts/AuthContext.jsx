import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('asurwears_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('asurwears_user', JSON.stringify(userData))
  }

  const sendOTP = async (email) => {
    setIsLoading(true)
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real app, this would be an API call
      const mockOTP = Math.floor(100000 + Math.random() * 900000)
      localStorage.setItem('mock_otp', mockOTP.toString())
      
      setOtpSent(true)
      toast.success(`OTP sent to ${email}`)
      return true
    } catch (error) {
      toast.error('Failed to send OTP')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOTP = async (email, otp) => {
    setIsLoading(true)
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const storedOTP = localStorage.getItem('mock_otp')
      if (otp === storedOTP) {
        const userData = {
          id: Date.now(),
          email,
          name: email.split('@')[0],
          isAdmin: email.includes('admin')
        }
        
        setUser(userData)
        localStorage.setItem('asurwears_user', JSON.stringify(userData))
        localStorage.removeItem('mock_otp')
        setOtpSent(false)
        
        toast.success('Login successful!')
        return true
      } else {
        toast.error('Invalid OTP')
        return false
      }
    } catch (error) {
      toast.error('Verification failed')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email, password, name) => {
    setIsLoading(true)
    try {
      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const userData = {
        id: Date.now(),
        email,
        name,
        isAdmin: false
      }
      
      setUser(userData)
      localStorage.setItem('asurwears_user', JSON.stringify(userData))
      
      toast.success('Registration successful!')
      return true
    } catch (error) {
      toast.error('Registration failed')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('asurwears_user')
    toast.success('Logged out successfully')
  }

  const value = {
    user,
    isLoading,
    otpSent,
    login,
    sendOTP,
    verifyOTP,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 