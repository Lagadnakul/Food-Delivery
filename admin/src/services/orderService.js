/**
 * Order Service for Admin Panel
 * Handles all order-related API calls
 */
import api, { endpoints } from './api';

/**
 * Get all orders
 */
export const getAllOrders = async () => {
  try {
    const response = await api.get(endpoints.ordersList);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Get a single order by ID
 * @param {string} orderId - Order ID
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`${endpoints.orders}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.post(endpoints.updateOrderStatus, {
      orderId,
      status
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export default {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
