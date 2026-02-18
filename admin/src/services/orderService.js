import api from './api';

const OrderService = {
  // Get all orders with pagination and filters
  getOrders: async (page = 1, limit = 20, status = '') => {
    try {
      const params = { page, limit };
      if (status) params.status = status;
      
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch orders' };
    }
  },

  // Get single order
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch order' };
    }
  },

  // Update order status
  updateStatus: async (orderId, status, note = '') => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status, note });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update status' };
    }
  },

  // Get order statistics
  getStats: async () => {
    try {
      const response = await api.get('/orders/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch stats' };
    }
  },
};

export default OrderService;
