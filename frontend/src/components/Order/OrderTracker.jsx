import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import OrderService from '../../services/orderService';
import DeliveryMap from '../Map/DeliveryMap';
import LoadingSpinner from '../UI/LoadingSpinner';

const ORDER_STATUSES = [
  { key: 'pending', label: 'Order Placed', icon: '📝' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅' },
  { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚴' },
  { key: 'delivered', label: 'Delivered', icon: '🎉' },
];

const OrderTracker = ({ orderId, initialStatus, onStatusUpdate }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

  // Fetch order details
  const fetchOrder = useCallback(async () => {
    try {
      const result = await OrderService.getOrderById(orderId);
      if (result.success) {
        setOrder(result.data);
        const statusIndex = ORDER_STATUSES.findIndex(s => s.key === result.data.status);
        setCurrentStatusIndex(statusIndex >= 0 ? statusIndex : 0);
        if (onStatusUpdate) {
          onStatusUpdate(result.data.status);
        }
      } else {
        setError(result.message || 'Failed to load order');
      }
    } catch (err) {
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  }, [orderId, onStatusUpdate]);

  // Initial fetch and polling
  useEffect(() => {
    fetchOrder();

    // Poll for updates every 30 seconds if order is not delivered/cancelled
    const pollInterval = setInterval(() => {
      if (order && !['delivered', 'cancelled'].includes(order.status)) {
        fetchOrder();
      }
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [fetchOrder, order?.status]);

  // Set initial status from props
  useEffect(() => {
    if (initialStatus) {
      const index = ORDER_STATUSES.findIndex(s => s.key === initialStatus);
      if (index >= 0) {
        setCurrentStatusIndex(index);
      }
    }
  }, [initialStatus]);

  if (loading) {
    return <LoadingSpinner message="Loading order details..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchOrder}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const isCancelled = order?.status === 'cancelled';
  const isDelivered = order?.status === 'delivered';

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Order #{order?._id?.slice(-8)}</h2>
            <p className="text-orange-100 text-sm mt-1">
              {new Date(order?.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          {order?.estimatedDeliveryTime && !isDelivered && !isCancelled && (
            <div className="text-right">
              <p className="text-sm text-orange-100">Estimated Delivery</p>
              <p className="text-lg font-bold">{order.estimatedDeliveryTime} mins</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Timeline */}
      <div className="p-6">
        {isCancelled ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <h3 className="text-xl font-bold text-red-600">Order Cancelled</h3>
            {order?.cancellationReason && (
              <p className="text-gray-500 mt-2">{order.cancellationReason}</p>
            )}
          </div>
        ) : (
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div
              className="absolute left-6 top-0 w-0.5 bg-orange-500 transition-all duration-500"
              style={{ height: `${(currentStatusIndex / (ORDER_STATUSES.length - 1)) * 100}%` }}
            />

            {/* Status Items */}
            <div className="space-y-6">
              {ORDER_STATUSES.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <motion.div
                    key={status.key}
                    className="flex items-center gap-4 relative"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Status Circle */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl z-10 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-orange-200' : ''}`}
                    >
                      {isCompleted ? status.icon : index + 1}
                    </div>

                    {/* Status Text */}
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          isCompleted ? 'text-gray-800' : 'text-gray-400'
                        }`}
                      >
                        {status.label}
                      </p>
                      {isCurrent && !isDelivered && (
                        <p className="text-sm text-orange-500 animate-pulse">
                          In Progress...
                        </p>
                      )}
                      {isDelivered && index === ORDER_STATUSES.length - 1 && (
                        <p className="text-sm text-green-500">
                          Delivered at{' '}
                          {new Date(order?.deliveredAt || order?.updatedAt).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Map Section (for out_for_delivery status) */}
      {order?.status === 'out_for_delivery' && order?.customer?.location && (
        <div className="px-6 pb-6">
          <h3 className="font-medium text-gray-800 mb-3">Track Delivery</h3>
          <DeliveryMap
            userLocation={order.customer.location}
            showRoute={true}
            height="200px"
          />
        </div>
      )}

      {/* Order Items */}
      <div className="border-t px-6 py-4">
        <h3 className="font-medium text-gray-800 mb-3">Order Items</h3>
        <div className="space-y-3">
          {order?.items?.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium text-gray-800">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Order Total */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>₹{order?.payment?.subtotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>Tax</span>
            <span>₹{order?.payment?.tax?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>Delivery Fee</span>
            <span>₹{order?.payment?.deliveryFee?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-800 mt-2 pt-2 border-t">
            <span>Total</span>
            <span>₹{order?.payment?.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="border-t px-6 py-4">
        <h3 className="font-medium text-gray-800 mb-2">Delivery Address</h3>
        <p className="text-gray-600">{order?.customer?.name}</p>
        <p className="text-sm text-gray-500">{order?.customer?.address}</p>
        <p className="text-sm text-gray-500">{order?.customer?.phone}</p>
        {order?.customer?.instructions && (
          <p className="text-sm text-orange-500 mt-2">
            Note: {order.customer.instructions}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderTracker;
