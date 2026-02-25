import { useState, useCallback } from 'react';
import OrderService from '../services/orderService';

/**
 * Custom hook for managing orders with loading and error state.
 * Abstracts OrderService calls for use in any component.
 *
 * @returns {Object} { orders, loading, error, fetchOrders, placeOrder, cancelOrder }
 */
const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await OrderService.getUserOrders();
    if (result.success) {
      setOrders(result.orders ?? []);
    } else {
      setError(result.message ?? 'Failed to load orders');
    }
    setLoading(false);
  }, []);

  const placeOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    const result = await OrderService.placeOrder(orderData);
    setLoading(false);
    if (!result.success) setError(result.message ?? 'Failed to place order');
    return result;
  }, []);

  const cancelOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    const result = await OrderService.cancelOrder(orderId);
    if (result.success) {
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } else {
      setError(result.message ?? 'Failed to cancel order');
    }
    setLoading(false);
    return result;
  }, []);

  return { orders, loading, error, fetchOrders, placeOrder, cancelOrder };
};

export default useOrders;
