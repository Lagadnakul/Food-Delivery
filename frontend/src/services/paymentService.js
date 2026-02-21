/**
 * Payment Service
 * 
 * Handles payment processing (COD and future online payments)
 */
import api, { endpoints } from './api';

/**
 * Payment methods enum
 */
export const PAYMENT_METHODS = {
  COD: 'cod',
  CARD: 'card',
  UPI: 'upi',
  WALLET: 'wallet',
};

/**
 * Payment status enum
 */
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

const PaymentService = {
  /**
   * Process payment for an order
   * @param {Object} paymentData - Payment details
   * @param {string} paymentData.orderId - Order ID
   * @param {string} paymentData.method - Payment method (cod, card, upi)
   * @param {number} paymentData.amount - Payment amount
   * @returns {Promise<Object>} - Payment result
   */
  processPayment: async (paymentData) => {
    try {
      // For COD, just return success
      if (paymentData.method === PAYMENT_METHODS.COD) {
        return {
          success: true,
          message: 'Cash on delivery selected. Payment will be collected upon delivery.',
          paymentId: `COD_${Date.now()}`,
          status: PAYMENT_STATUS.PENDING,
        };
      }

      // For online payments (when implemented)
      const response = await api.post(endpoints.createPayment, paymentData);
      return response.data;
    } catch (error) {
      if (error.isNetworkError) {
        return { success: false, message: error.message };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Payment processing failed.',
      };
    }
  },

  /**
   * Verify payment status
   * @param {string} paymentId - Payment ID to verify
   * @returns {Promise<Object>} - Verification result
   */
  verifyPayment: async (paymentId) => {
    try {
      // For COD payments
      if (paymentId.startsWith('COD_')) {
        return {
          success: true,
          status: PAYMENT_STATUS.PENDING,
          message: 'Cash on delivery - payment pending',
        };
      }

      const response = await api.post(endpoints.verifyPayment, { paymentId });
      return response.data;
    } catch (error) {
      if (error.isNetworkError) {
        return { success: false, message: error.message };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Payment verification failed.',
      };
    }
  },

  /**
   * Calculate order totals
   * @param {Array} items - Cart items
   * @param {number} taxRate - Tax rate (decimal)
   * @param {number} deliveryFee - Delivery fee
   * @returns {Object} - { subtotal, tax, deliveryFee, total }
   */
  calculateTotals: (items, taxRate = 0.10, deliveryFee = 2.99) => {
    const subtotal = items.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );
    
    const tax = subtotal * taxRate;
    const total = subtotal + tax + deliveryFee;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      deliveryFee: parseFloat(deliveryFee.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  },

  /**
   * Validate payment method
   * @param {string} method - Payment method to validate
   * @returns {boolean} - Is valid
   */
  isValidPaymentMethod: (method) => {
    return Object.values(PAYMENT_METHODS).includes(method);
  },

  /**
   * Get payment method display name
   * @param {string} method - Payment method code
   * @returns {string} - Display name
   */
  getPaymentMethodName: (method) => {
    const names = {
      [PAYMENT_METHODS.COD]: 'Cash on Delivery',
      [PAYMENT_METHODS.CARD]: 'Credit/Debit Card',
      [PAYMENT_METHODS.UPI]: 'UPI Payment',
      [PAYMENT_METHODS.WALLET]: 'Digital Wallet',
    };
    return names[method] || method;
  },
};

export default PaymentService;
