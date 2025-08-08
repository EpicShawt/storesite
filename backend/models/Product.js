const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Minimalist', 'Vintage', 'Streetwear', 'Casual', 'Formal', 'Sports']
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    cloudinaryUrl: {
      type: String,
      required: true
    }
  }],
  productLink: {
    type: String,
    trim: true
  },
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  sales: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better performance
productSchema.index({ category: 1, inStock: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema); 