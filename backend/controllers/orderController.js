import { Order } from '../models/orderModel.js';

// Create a new order
const createOrder = async (req, res) => {
  try {
    // Log received data for debugging
    console.log('Received order data:', req.body);
    
    // Validate required fields
    const { customer, items, payment } = req.body;
    
    // Check for required customer fields
    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required customer information",
        details: ["Customer name, phone, and address are required"]
      });
    }
    
    // Check for items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Order must contain at least one item",
        details: ["No items in order"]
      });
    }
    
    // Check payment info
    if (!payment || !payment.method || typeof payment.total !== 'number') {
      return res.status(400).json({ 
        success: false,
        message: "Missing payment information",
        details: ["Payment method and total are required"]
      });
    }
    
    // Create and save the new order with user reference
    const newOrder = new Order({
      user: req.user._id,
      customer: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        instructions: customer.instructions || ''
      },
      items: items.map(item => ({
        productId: String(item.productId || item._id || item.id),
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image || ''
      })),
      payment: {
        method: payment.method,
        subtotal: Number(payment.subtotal),
        tax: Number(payment.tax),
        deliveryFee: Number(payment.deliveryFee),
        total: Number(payment.total)
      },
      status: 'pending'
    });
    
    const savedOrder = await newOrder.save();
    
    // Return success response
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      _id: savedOrder._id,
      data: savedOrder
    });
  } catch (error) {
    console.error("Order creation error:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: "Validation error",
        details: messages
      });
    }
    
    // Handle other errors
    res.status(400).json({ 
      success: false,
      message: error.message || "Failed to create order",
      details: [error.toString()]
    });
  }
};

// Get user order history
const getUserOrderHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Order.countDocuments({ user: req.user._id });
    
    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching user order history:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to fetch order history" 
    });
  }
};

// Get order details by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    // Check if the order belongs to the current user
    if (req.user && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this order"
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error("Error retrieving order:", error);
    
    // Handle invalid ID format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format"
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || "Error retrieving order"
    });
  }
};

export {
  createOrder,
  getUserOrderHistory,
  getOrderById
};