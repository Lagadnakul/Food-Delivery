import axios from 'axios';
import { API_URL } from '../config';

// Order API service
const OrderService = {
  // Submit a new order
  placeOrder: async (orderData) => {
    try {
      const response = await axios.post(`${API_URL}/orders/create`, orderData, {
        headers: {
          'Content-Type': 'application/json',
          // Include auth token if you have authentication
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  },

  // Get order history for the current user
  getOrderHistory: async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/history`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw error;
    }
  },

  // Get a specific order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }
};

export default OrderService;