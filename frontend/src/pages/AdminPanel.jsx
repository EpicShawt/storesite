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
  Image as ImageIcon
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const AdminPanel = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [bannerText, setBannerText] = useState('')
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: ''
  })

  useEffect(() => {
    // Load products and banner text
    const savedProducts = localStorage.getItem('asurwears_products')
    const savedBanner = localStorage.getItem('asurwears_banner')
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }
    if (savedBanner) {
      setBannerText(savedBanner)
    }
  }, [])

  // Check if user is admin
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      toast.error('Please fill in all required fields')
      return
    }

    const product = {
      id: Date.now(),
      ...newProduct,
      price: parseInt(newProduct.price),
      rating: 4.5,
      reviews: Math.floor(Math.random() * 200) + 50,
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    }

    const updatedProducts = [...products, product]
    setProducts(updatedProducts)
    localStorage.setItem('asurwears_products', JSON.stringify(updatedProducts))
    
    setNewProduct({
      name: '',
      price: '',
      description: '',
      category: '',
      image: ''
    })
    
    toast.success('Product added successfully!')
  }

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId)
    setProducts(updatedProducts)
    localStorage.setItem('asurwears_products', JSON.stringify(updatedProducts))
    toast.success('Product deleted successfully!')
  }

  const handleUpdateBanner = () => {
    localStorage.setItem('asurwears_banner', bannerText)
    toast.success('Banner updated successfully!')
  }

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Total Sales',
      value: '₹24,500',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Total Orders',
      value: '156',
      icon: BarChart3,
      color: 'text-purple-600'
    },
    {
      title: 'Total Customers',
      value: '89',
      icon: Users,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="text-sm text-gray-600">
            Welcome back, {user?.name}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-base-100 rounded-lg p-1 mb-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'banner', label: 'Banner', icon: ImageIcon },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-content'
                  : 'hover:bg-base-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-base-100 rounded-lg p-6 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-base-200 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-base-100 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Products</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#12345</td>
                      <td>John Doe</td>
                      <td>Platform 9¾ T-Shirt</td>
                      <td>₹499</td>
                      <td><span className="badge badge-success">Delivered</span></td>
                    </tr>
                    <tr>
                      <td>#12346</td>
                      <td>Jane Smith</td>
                      <td>Tropical State of Mind</td>
                      <td>₹499</td>
                      <td><span className="badge badge-warning">Processing</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Add Product Form */}
            <div className="bg-base-100 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select category</option>
                    <option value="Harry Potter">Harry Potter</option>
                    <option value="Tropical">Tropical</option>
                    <option value="Sweaters">Sweaters</option>
                    <option value="Vintage">Vintage</option>
                    <option value="Minimalist">Minimalist</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="url"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter image URL"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows="3"
                    placeholder="Enter product description"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    onClick={handleAddProduct}
                    className="btn btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </button>
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="bg-base-100 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">All Products</h3>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>₹{product.price}</td>
                        <td>
                          <div className="flex space-x-2">
                            <button className="btn btn-sm btn-outline">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="btn btn-sm btn-error"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Banner Tab */}
        {activeTab === 'banner' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-base-100 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">Banner Management</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Banner Text</label>
                  <textarea
                    value={bannerText}
                    onChange={(e) => setBannerText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows="3"
                    placeholder="Enter banner text (e.g., 🎉 50% OFF ON ALL PRODUCTS! FREE SHIPPING ON ORDERS ABOVE ₹999 🎉)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Banner Image (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Recommended size: 1200x200px, Max file size: 200KB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-2"
                    />
                  </div>
                </div>
                <button
                  onClick={handleUpdateBanner}
                  className="btn btn-primary"
                >
                  Update Banner
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-base-100 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">Store Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Store Name</label>
                  <input
                    type="text"
                    defaultValue="Asur Wears"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Shipping Cost (₹)</label>
                  <input
                    type="number"
                    defaultValue="50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Free Shipping Threshold (₹)</label>
                  <input
                    type="number"
                    defaultValue="999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button className="btn btn-primary">
                  Save Settings
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel 