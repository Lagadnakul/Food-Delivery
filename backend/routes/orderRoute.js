import express from 'express';
import { 
  createOrder, 
  getUserOrderHistory, 
  getOrderById, 
  trackOrder, 
  cancelOrder, 
  updateOrderStatus 
} from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { Order } from '../models/orderModel.js';

const router = express.Router();

// Create a new order - protected route
router.post('/', authMiddleware, createOrder);

// Get user order history - protected route
router.get('/history', authMiddleware, getUserOrderHistory);

// Track order - protected route
router.get('/:id/track', authMiddleware, trackOrder);

// Cancel order - protected route
router.post('/:id/cancel', authMiddleware, cancelOrder);

// Get order by ID - protected route
router.get('/:id', authMiddleware, getOrderById);

// Admin Routes
// Get all orders (for admin panel)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    
    const query = status ? { status } : {};
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'name email');
      
    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      data: orders,
      pagination: {
        page,
        totalPages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to fetch orders"
    });
  }
});

// Update order status (for admin)
router.patch('/:id/status', updateOrderStatus);

export default router;