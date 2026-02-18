import { useState, useCallback } from 'react';
import OrderService from '../services/orderService';

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  // Fetch order history
  const fetchOrders = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);

      const result = await OrderService.getOrderHistory(page, limit);

      if (result.success) {
        setOrders(result.data || []);
        setPagination({
          page: result.page || page,
          totalPages: result.totalPages || 1,
          total: result.total || 0,
        });
      } else {
        setError(result.message || 'Failed to fetch orders');
      }

      return result;
    } catch (err) {
      const message = err.message || 'Failed to fetch orders';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single order
  const fetchOrderById = useCallback(async (orderId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await OrderService.getOrderById(orderId);

      if (result.success) {
        setCurrentOrder(result.data);
      } else {
        setError(result.message || 'Failed to fetch order');
      }

      return result;
    } catch (err) {
      const message = err.message || 'Failed to fetch order';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Place new order
  const placeOrder = useCallback(async (orderData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await OrderService.placeOrder(orderData);

      if (result.success) {
        setCurrentOrder(result.data);
      }

      return result;
    } catch (err) {
      const message = err.message || 'Failed to place order';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel order
  const cancelOrder = useCallback(async (orderId, reason) => {
    try {
      setLoading(true);
      setError(null);

      const result = await OrderService.cancelOrder(orderId, reason);

      if (result.success) {
        // Update current order if it's the one being cancelled
        if (currentOrder?._id === orderId) {
          setCurrentOrder((prev) => ({ ...prev, status: 'cancelled' }));
        }
        // Update orders list
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: 'cancelled' } : order
          )
        );
      }

      return result;
    } catch (err) {
      const message = err.message || 'Failed to cancel order';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentOrder]);

  // Clear current order
  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder(null);
  }, []);

  return {
    orders,
    currentOrder,
    loading,
    error,
    pagination,
    fetchOrders,
    fetchOrderById,
    placeOrder,
    cancelOrder,
    clearCurrentOrder,
  };
};

export default useOrders;
