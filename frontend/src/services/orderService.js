import api from './api';

// Order API service
const OrderService = {
  // Submit a new order
  placeOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error.response?.data || { success: false, message: 'Failed to place order' };
    }
  },

  // Get order history for the current user
  getOrderHistory: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/orders/history?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch orders' };
    }
  },

  // Get a specific order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch order' };
    }
  },

  // Track order status (polling)
  trackOrder: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/track`);
      return response.data;
    } catch (error) {
      console.error('Error tracking order:', error);
      throw error.response?.data || { success: false, message: 'Failed to track order' };
    }
  },

  // Cancel order
  cancelOrder: async (orderId, reason) => {
    try {
      const response = await api.post(`/orders/${orderId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error.response?.data || { success: false, message: 'Failed to cancel order' };
    }
  }
};

export default OrderService;