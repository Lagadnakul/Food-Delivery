import express from 'express';
import { createOrder, getOrderById, getUserOrderHistory } from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { Order } from '../models/orderModel.js';

const router = express.Router();

// Create a new order - protected route
router.post('/', authMiddleware, createOrder);

// Get user order history - protected route
router.get('/history', authMiddleware, getUserOrderHistory);

// Get all orders (for admin panel) - /orders/list
router.get('/list', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to fetch orders"
    });
  }
});

// Update order status (for admin) - POST /orders/status
router.post('/status', async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    
    if (!updatedOrder) return res.status(404).json({ 
      success: false, 
      message: 'Order not found' 
    });
    
    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get order by ID - protected route (must be after specific routes)
router.get('/:id', authMiddleware, getOrderById);

// Get all orders (for admin panel) - /orders/
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: orders    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to fetch orders"
    });
  }
});

export default router;