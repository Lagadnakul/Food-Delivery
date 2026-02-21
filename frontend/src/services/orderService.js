/**
 * Order Service
 * 
 * Handles all order-related API calls
 */
import api, { endpoints } from './api';

const OrderService = {
  /**
   * Submit a new order
   * @param {Object} orderData - The order data
   * @returns {Promise<Object>} The created order
   */
  placeOrder: async (orderData) => {
    try {
      const response = await api.post(endpoints.orders, orderData);
      return response.data;
    } catch (error) {
      console.error('Error placing order:', error);
      if (error.isNetworkError) {
        return { 
          success: false, 
          message: 'Network error. Please check your internet connection and try again.' 
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to place order. Please try again.',
        details: error.response?.data?.details || [],
      };
    }
  },

  /**
   * Get order history for the current user
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Order history with pagination
   */
  getOrderHistory: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`${endpoints.orderHistory}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order history:', error);
      if (error.isNetworkError) {
        return { success: false, message: error.message };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch order history.',
      };
    }
  },

  /**
   * Get a specific order by ID
   * @param {string} orderId - The order ID
   * @returns {Promise<Object>} The order details
   */
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`${endpoints.orders}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      if (error.isNetworkError) {
        return { success: false, message: error.message };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch order details.',
      };
    }
  },

  /**
   * Cancel an order (if allowed)
   * @param {string} orderId - The order ID
   * @returns {Promise<Object>} The updated order
   */
  cancelOrder: async (orderId) => {
    try {
      const response = await api.patch(`${endpoints.orders}/${orderId}/status`, {
        status: 'cancelled',
      });
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      if (error.isNetworkError) {
        return { success: false, message: error.message };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel order.',
      };
    }
  },

  /**
   * Track order status
   * @param {string} orderId - The order ID
   * @returns {Promise<Object>} The order tracking info
   */
  trackOrder: async (orderId) => {
    try {
      const response = await api.get(`${endpoints.orders}/${orderId}`);
      if (response.data.success) {
        const order = response.data.data || response.data;
        return {
          success: true,
          status: order.status,
          estimatedDelivery: order.estimatedDelivery,
          updates: order.statusHistory || [],
        };
      }
      return response.data;
    } catch (error) {
      console.error('Error tracking order:', error);
      if (error.isNetworkError) {
        return { success: false, message: error.message };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to track order.',
      };
    }
  },
};

export default OrderService;