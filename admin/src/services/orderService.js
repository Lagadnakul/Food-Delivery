import api from './api';

/**
 * Admin order service.
 * All endpoints match backend routes in /backend/routes/orderRoute.js
 *   GET   /orders            — list all orders (admin, no auth required)
 *   PATCH /orders/:id/status — update order status
 */

/**
 * Fetch all orders (for admin panel — newest first).
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const listOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

/**
 * Update the status of a specific order.
 * @param {string} orderId  — MongoDB _id of the order
 * @param {string} status   — one of: 'Food Processing', 'Out for Delivery', 'Delivered'
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/orders/${orderId}/status`, { status });
  return response.data;
};
