const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  // Page Views
  pageViews: {
    home: { type: Number, default: 0 },
    products: { type: Number, default: 0 },
    productDetail: { type: Number, default: 0 },
    cart: { type: Number, default: 0 },
    admin: { type: Number, default: 0 }
  },
  
  // User Actions
  userActions: {
    productViews: { type: Number, default: 0 },
    addToCart: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },
    imageUploads: { type: Number, default: 0 },
    adminLogins: { type: Number, default: 0 }
  },
  
  // Performance Metrics
  performance: {
    averageLoadTime: { type: Number, default: 0 },
    totalRequests: { type: Number, default: 0 },
    errorRate: { type: Number, default: 0 },
    uptime: { type: Number, default: 100 }
  },
  
  // Revenue Tracking
  revenue: {
    totalSales: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 }
  },
  
  // Date tracking
  date: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Index for better performance
analyticsSchema.index({ date: -1 });
analyticsSchema.index({ 'performance.uptime': -1 });

module.exports = mongoose.model('Analytics', analyticsSchema); 