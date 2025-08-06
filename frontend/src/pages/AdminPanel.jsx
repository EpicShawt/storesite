import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  BarChart3, 
  Package, 
  Users, 
  DollarSign,
  Settings,
  Image as ImageIcon,
  LogOut,
  User,
  ShoppingCart,
  TrendingUp,
  FileText,
  Link as LinkIcon
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ImageUpload from '../components/ImageUpload'
import { API_ENDPOINTS } from '../config/api'

const AdminPanel = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [bannerText, setBannerText] = useState('50% OFF - Limited Time Offer!')
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    originalPrice: '',
    description: '',
    category: '',
    images: [],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: {
      S: 10,
      M: 10,
      L: 10,
      XL: 10,
      XXL: 10
    },
    productLink: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchUsers()
    fetchOrders()
  }, [])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(API_ENDPOINTS.ADMIN_PRODUCTS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchUsers = async () => {
    // Mock data for now
    setUsers([
      { id: 1, name: 'John Doe', email: 'john@example.com', isAdmin: false },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', isAdmin: false }
    ])
  }

  const fetchOrders = async () => {
    // Mock data for now
    setOrders([
      { id: 1, customer: 'John Doe', total: 1500, status: 'Completed' },
      { id: 2, customer: 'Jane Smith', total: 2300, status: 'Pending' }
    ])
  }

  // Check if user is admin or manager
  if (!user?.isAdmin && !user?.isManager) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-4">You need admin privileges to access this page.</p>
          <button 
            onClick={() => navigate('/admin-login')}
            className="btn bg-white text-black hover:bg-gray-200"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    )
  }

  const handleImageUpload = (imageUrl) => {
    setNewProduct(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }))
    toast.success('Image uploaded successfully!')
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      toast.error('Please fill in all required fields')
      return
    }

    if (newProduct.images.length === 0) {
      toast.error('Please upload at least one image')
      return
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(API_ENDPOINTS.ADMIN_PRODUCTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined
        })
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('Product added successfully!')
        setNewProduct({
          name: '',
          price: '',
          originalPrice: '',
          description: '',
          category: '',
          images: [],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          stock: {
            S: 10,
            M: 10,
            L: 10,
            XL: 10,
            XXL: 10
          },
          productLink: ''
        })
        fetchProducts()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Failed to add product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this product? This action cannot be undone.');
    
    if (!isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Product deleted successfully!')
        fetchProducts()
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleUpdateBanner = () => {
    localStorage.setItem('asurwears_banner', bannerText)
    toast.success('Banner updated successfully!')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'text-blue-500'
    },
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'text-green-500'
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: ShoppingCart,
      color: 'text-purple-500'
    },
    {
      title: 'Revenue',
      value: `₹${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-yellow-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-base-200 border-b border-gray-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">
              {user?.isManager ? 'Order Manager Panel' : 'Asur Wear Admin'}
            </h1>
            <span className="text-sm text-gray-400">
              Welcome, {user?.name} ({user?.isManager ? 'Manager' : 'Admin'})
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-sm bg-red-600 hover:bg-red-700 text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-base-200 rounded-lg p-4 border border-gray-700">
              <nav className="space-y-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'products', label: 'Products', icon: Package },
                  { id: 'users', label: 'Users', icon: Users },
                  { id: 'orders', label: 'Orders', icon: ShoppingCart },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-black'
                        : 'text-gray-300 hover:bg-base-300'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-base-200 rounded-lg p-6 border border-gray-700"
            >
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-base-300 p-4 rounded-lg border border-gray-600"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">{stat.title}</p>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                          </div>
                          <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-base-300 p-4 rounded-lg border border-gray-600">
                      <h3 className="text-lg font-semibold text-white mb-4">Recent Products</h3>
                      <div className="space-y-2">
                        {products.slice(-5).map((product) => (
                          <div key={product._id} className="flex items-center space-x-3 p-2 bg-base-200 rounded">
                            <Package className="w-4 h-4 text-blue-500" />
                            <span className="text-white text-sm">{product.name}</span>
                            <span className="text-gray-400 text-xs">₹{product.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-base-300 p-4 rounded-lg border border-gray-600">
                      <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>
                      <div className="space-y-2">
                        {orders.slice(-5).map((order) => (
                          <div key={order.id} className="flex items-center space-x-3 p-2 bg-base-200 rounded">
                            <ShoppingCart className="w-4 h-4 text-green-500" />
                            <span className="text-white text-sm">Order #{order.id}</span>
                            <span className="text-gray-400 text-xs">₹{order.total}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Products Management</h2>
                    <button
                      onClick={() => setActiveTab('add-product')}
                      className="btn bg-white text-black hover:bg-gray-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <div key={product._id} className="bg-base-300 p-4 rounded-lg border border-gray-600">
                        <img
                          src={product.images[0] || 'https://via.placeholder.com/200x200?text=Product'}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                        <h3 className="text-white font-semibold mb-2">{product.name}</h3>
                        <p className="text-gray-400 text-sm mb-2">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-white font-bold">₹{product.price}</span>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="btn btn-sm bg-red-600 hover:bg-red-700 text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {user?.isAdmin && product.productLink && (
                          <div className="mt-2 flex items-center space-x-2">
                            <LinkIcon className="w-4 h-4 text-blue-500" />
                            <a 
                              href={product.productLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 text-sm hover:underline"
                            >
                              View Product Link
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Product Tab */}
              {activeTab === 'add-product' && (
                <div>
                  <div className="flex items-center space-x-4 mb-6">
                    <button
                      onClick={() => setActiveTab('products')}
                      className="btn btn-sm bg-gray-600 hover:bg-gray-700 text-white"
                    >
                      ← Back to Products
                    </button>
                    <h2 className="text-2xl font-bold text-white">Add New Product</h2>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleAddProduct(); }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Product Name *</label>
                        <input
                          type="text"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          className="w-full p-3 bg-base-300 border border-gray-600 rounded-lg text-white"
                          placeholder="Enter product name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹) *</label>
                        <input
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                          className="w-full p-3 bg-base-300 border border-gray-600 rounded-lg text-white"
                          placeholder="Enter price"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Original Price (₹)</label>
                        <input
                          type="number"
                          value={newProduct.originalPrice}
                          onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                          className="w-full p-3 bg-base-300 border border-gray-600 rounded-lg text-white"
                          placeholder="Enter original price (optional)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                        <select
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                          className="w-full p-3 bg-base-300 border border-gray-600 rounded-lg text-white"
                          required
                        >
                          <option value="">Select category</option>
                          <option value="Harry Potter">Harry Potter</option>
                          <option value="Tropical">Tropical</option>
                          <option value="Sweaters">Sweaters</option>
                          <option value="Vintage">Vintage</option>
                          <option value="Minimalist">Minimalist</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                      <textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        className="w-full p-3 bg-base-300 border border-gray-600 rounded-lg text-white"
                        rows="3"
                        placeholder="Enter product description"
                        required
                      />
                    </div>

                    {user?.isAdmin && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Product Link (Admin Only)
                        </label>
                        <input
                          type="url"
                          value={newProduct.productLink}
                          onChange={(e) => setNewProduct({...newProduct, productLink: e.target.value})}
                          className="w-full p-3 bg-base-300 border border-gray-600 rounded-lg text-white"
                          placeholder="Enter product link (optional)"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Product Images *</label>
                      <ImageUpload onImageUpload={handleImageUpload} />
                      {newProduct.images.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Uploaded Images:</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {newProduct.images.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={image}
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-20 object-cover rounded"
                                />
                                <button
                                  onClick={() => setNewProduct(prev => ({
                                    ...prev,
                                    images: prev.images.filter((_, i) => i !== index)
                                  }))}
                                  className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-lg bg-white text-black hover:bg-gray-200 w-full disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="loading loading-spinner loading-sm"></div>
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      {isLoading ? 'Adding Product...' : 'Add Product'}
                    </button>
                  </form>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Users Management</h2>
                  <div className="bg-base-300 rounded-lg border border-gray-600 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-base-200">
                        <tr>
                          <th className="text-left p-4 text-white">User</th>
                          <th className="text-left p-4 text-white">Email</th>
                          <th className="text-left p-4 text-white">Role</th>
                          <th className="text-left p-4 text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-t border-gray-600">
                            <td className="p-4 text-white">{user.name}</td>
                            <td className="p-4 text-gray-300">{user.email}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs ${
                                user.isAdmin ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                              }`}>
                                {user.isAdmin ? 'Admin' : 'User'}
                              </span>
                            </td>
                            <td className="p-4">
                              <button className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white mr-2">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="btn btn-sm bg-red-600 hover:bg-red-700 text-white">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Orders Management</h2>
                  <div className="bg-base-300 rounded-lg border border-gray-600 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-base-200">
                        <tr>
                          <th className="text-left p-4 text-white">Order ID</th>
                          <th className="text-left p-4 text-white">Customer</th>
                          <th className="text-left p-4 text-white">Total</th>
                          <th className="text-left p-4 text-white">Status</th>
                          <th className="text-left p-4 text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-t border-gray-600">
                            <td className="p-4 text-white">#{order.id}</td>
                            <td className="p-4 text-gray-300">{order.customer}</td>
                            <td className="p-4 text-white">₹{order.total}</td>
                            <td className="p-4">
                              <span className="px-2 py-1 rounded text-xs bg-green-600 text-white">
                                Completed
                              </span>
                            </td>
                            <td className="p-4">
                              <button className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Site Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-base-300 p-4 rounded-lg border border-gray-600">
                      <h3 className="text-lg font-semibold text-white mb-4">Banner Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Banner Text</label>
                          <input
                            type="text"
                            value={bannerText}
                            onChange={(e) => setBannerText(e.target.value)}
                            className="w-full p-3 bg-base-300 border border-gray-600 rounded-lg text-white"
                            placeholder="Enter banner text"
                          />
                        </div>
                        <button
                          onClick={handleUpdateBanner}
                          className="btn bg-white text-black hover:bg-gray-200"
                        >
                          Update Banner
                        </button>
                      </div>
                    </div>

                    <div className="bg-base-300 p-4 rounded-lg border border-gray-600">
                      <h3 className="text-lg font-semibold text-white mb-4">Site Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
                          <input
                            type="text"
                            defaultValue="Asur Wear"
                            className="w-full p-3 bg-base-300 border border-gray-600 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email</label>
                          <input
                            type="email"
                            defaultValue="contact@asurwear.com"
                            className="w-full p-3 bg-base-300 border border-gray-600 rounded-lg text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel 