import express from 'express';
import { createOrder, getUserOrderHistory, getOrderById } from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { Order } from '../models/orderModel.js';

const router = express.Router();

// Create a new order - protected route
router.post('/', authMiddleware, createOrder);

// Get user order history - protected route
router.get('/history', authMiddleware, getUserOrderHistory);

// Get order by ID - protected route
router.get('/:id', authMiddleware, getOrderById);

// Get all orders (for admin panel)
router.get('/', async (req, res) => {
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

// Update order status (for admin)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
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

export default router;