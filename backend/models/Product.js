const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
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
    enum: ['Harry Potter', 'Tropical', 'Sweaters', 'Vintage', 'Minimalist', 'Other']
  },
  images: [{
    type: String,
    required: true
  }],
  sizes: [{
    type: String,
    enum: ['S', 'M', 'L', 'XL', 'XXL'],
    default: ['S', 'M', 'L', 'XL', 'XXL']
  }],
  stock: {
    S: { type: Number, default: 10 },
    M: { type: Number, default: 10 },
    L: { type: Number, default: 10 },
    XL: { type: Number, default: 10 },
    XXL: { type: Number, default: 10 }
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema); 