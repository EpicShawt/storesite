const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const router = express.Router();

// Create new order
router.post('/', async (req, res) => {
  try {
    const { customer, items, totalAmount, paymentMethod, notes } = req.body;

    // Validate required fields
    if (!customer || !items || !totalAmount) {
      return res.status(400).json({ error: 'Customer details, items, and total amount are required' });
    }

    // Validate customer details
    if (!customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({ error: 'Complete customer details are required' });
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required' });
    }

    // Verify products exist and are in stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.product} not found` });
      }
      if (!product.inStock) {
        return res.status(400).json({ error: `Product ${product.name} is out of stock` });
      }
    }

    // Create order
    const order = new Order({
      customer,
      items,
      totalAmount,
      paymentMethod: paymentMethod || 'cod',
      notes
    });

    await order.save();

    // Populate product details for response
    await order.populate('items.product', 'name images price');

    res.status(201).json({
      message: 'Order placed successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        customer: order.customer,
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get order by order number
router.get('/track/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required for order tracking' });
    }

    const order = await Order.findOne({ 
      orderNumber: orderNumber.toUpperCase(),
      'customer.phone': phone 
    }).populate('items.product', 'name images price');

    if (!order) {
      return res.status(404).json({ error: 'Order not found. Please check your order number and phone number.' });
    }

    res.json({
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        customer: order.customer,
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        estimatedDelivery: order.estimatedDelivery,
        notes: order.notes,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({ error: 'Failed to track order' });
  }
});

// Get order status
router.get('/status/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const order = await Order.findOne({ 
      orderNumber: orderNumber.toUpperCase(),
      'customer.phone': phone 
    }).select('orderNumber status paymentStatus estimatedDelivery');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      estimatedDelivery: order.estimatedDelivery
    });

  } catch (error) {
    console.error('Get order status error:', error);
    res.status(500).json({ error: 'Failed to get order status' });
  }
});

// Cancel order (only if status is pending)
router.put('/:orderNumber/cancel', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const order = await Order.findOne({ 
      orderNumber: orderNumber.toUpperCase(),
      'customer.phone': phone 
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order cannot be cancelled. It has already been processed.' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', orderNumber: order.orderNumber });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

module.exports = router; 