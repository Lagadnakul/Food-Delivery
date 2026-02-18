import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Order } from '../models/orderModel.js';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
export const createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount',
      });
    }

    // Create order options
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receipt || `order_${Date.now()}`,
      notes: notes || {},
    };

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
      },
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message,
    });
  }
};

// Verify Razorpay payment signature
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification data',
      });
    }

    // Create signature verification string
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Verify signature
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update order with payment details
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          'payment.status': 'completed',
          'payment.razorpayOrderId': razorpay_order_id,
          'payment.razorpayPaymentId': razorpay_payment_id,
          'payment.paidAt': new Date(),
          status: 'confirmed',
        });
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
      });
    } else {
      // Update order as failed
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          'payment.status': 'failed',
          status: 'payment_failed',
        });
      }

      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).select('payment status');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      payment: order.payment,
      orderStatus: order.status,
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status',
    });
  }
};

// Webhook handler for Razorpay events
export const handleWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    // Verify webhook signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest !== req.headers['x-razorpay-signature']) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature',
      });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    switch (event) {
      case 'payment.captured':
        // Payment successful
        console.log('Payment captured:', payload.payment.entity.id);
        break;
      case 'payment.failed':
        // Payment failed
        console.log('Payment failed:', payload.payment.entity.id);
        break;
      case 'order.paid':
        // Order paid
        console.log('Order paid:', payload.order.entity.id);
        break;
      default:
        console.log('Unhandled webhook event:', event);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
    });
  }
};

// Refund payment
export const refundPayment = async (req, res) => {
  try {
    const { paymentId, amount, notes } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required',
      });
    }

    const refundOptions = {
      notes: notes || {},
    };

    // If amount is provided, it's a partial refund
    if (amount) {
      refundOptions.amount = Math.round(amount * 100);
    }

    const refund = await razorpay.payments.refund(paymentId, refundOptions);

    res.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
      },
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Refund failed',
      error: error.message,
    });
  }
};
