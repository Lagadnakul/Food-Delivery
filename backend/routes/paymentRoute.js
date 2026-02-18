import express from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentStatus,
  handleWebhook,
  refundPayment,
} from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create payment order (requires authentication)
router.post('/create-order', authMiddleware, createPaymentOrder);

// Verify payment (requires authentication)
router.post('/verify', authMiddleware, verifyPayment);

// Get payment status (requires authentication)
router.get('/status/:orderId', authMiddleware, getPaymentStatus);

// Razorpay webhook (no auth - uses webhook signature verification)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Refund payment (admin only - you may want to add admin middleware)
router.post('/refund', authMiddleware, refundPayment);

export default router;
