import api from './api';

const PaymentService = {
  // Create Razorpay order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/payment/create-order', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating payment order:', error);
      throw error.response?.data || { success: false, message: 'Failed to create payment order' };
    }
  },

  // Verify payment after Razorpay callback
  verifyPayment: async (paymentData) => {
    try {
      const response = await api.post('/payment/verify', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error.response?.data || { success: false, message: 'Payment verification failed' };
    }
  },

  // Get payment status
  getPaymentStatus: async (orderId) => {
    try {
      const response = await api.get(`/payment/status/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error.response?.data || { success: false, message: 'Failed to get payment status' };
    }
  },

  // Initialize Razorpay checkout
  initializeRazorpay: () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  // Open Razorpay checkout modal
  openCheckout: async (orderData, onSuccess, onFailure) => {
    const isLoaded = await PaymentService.initializeRazorpay();
    
    if (!isLoaded) {
      onFailure({ message: 'Failed to load Razorpay SDK' });
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount, // Amount in paise
      currency: orderData.currency || 'INR',
      name: 'Hunger Hive',
      description: 'Food Order Payment',
      order_id: orderData.razorpayOrderId,
      prefill: {
        name: orderData.customerName || '',
        email: orderData.customerEmail || '',
        contact: orderData.customerPhone || '',
      },
      theme: {
        color: '#f97316', // Orange theme
      },
      handler: async (response) => {
        try {
          // Verify payment on backend
          const verificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderData.orderId,
          };

          const result = await PaymentService.verifyPayment(verificationData);
          
          if (result.success) {
            onSuccess(result);
          } else {
            onFailure(result);
          }
        } catch (error) {
          onFailure({ message: 'Payment verification failed' });
        }
      },
      modal: {
        ondismiss: () => {
          onFailure({ message: 'Payment cancelled by user' });
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on('payment.failed', (response) => {
      onFailure({
        message: response.error.description || 'Payment failed',
        code: response.error.code,
      });
    });

    razorpay.open();
  },
};

export default PaymentService;
