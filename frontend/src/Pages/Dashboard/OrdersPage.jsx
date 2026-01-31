import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL, CURRENCY } from '../../config';
import { showToast } from '../../utils/toastUtils';
import { ShoppingBag, ChevronDown, ChevronRight, MapPin, Phone, Clock, Check, AlertTriangle } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/orders/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast.error('Failed to load your orders');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  // Format date string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
        <p className="text-gray-600 mt-1">Track and manage your recent orders</p>
      </div>
      
      <div className="p-6">
        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 p-10 rounded-xl text-center"
          >
            <AlertTriangle className="mx-auto h-12 w-12 text-orange-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => window.location.href = '/menu'}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 inline-flex items-center"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Menu
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
              >
                <div 
                  className="p-6 flex flex-wrap md:flex-nowrap justify-between items-center cursor-pointer"
                  onClick={() => toggleOrderDetails(order._id)}
                >
                  <div className="flex items-start space-x-4 mb-4 md:mb-0 w-full md:w-auto">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          Order #{order._id.substring(order._id.length - 6).toUpperCase()}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                      <div className="text-sm text-gray-500 mt-1 flex items-center">
                        <MapPin size={14} className="mr-1" />
                        <span className="truncate max-w-xs">{order.customer.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 ml-auto">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-lg font-bold text-orange-600">
                        {CURRENCY}{order.payment.total.toFixed(2)}
                      </p>
                    </div>
                    <div className={`transition-transform duration-200 ${expandedOrder === order._id ? 'rotate-180' : ''}`}>
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>
                
                {/* Order Details Section */}
                {expandedOrder === order._id && (
                  <div className="bg-gray-50 p-6">
                    <h4 className="font-medium text-gray-700 mb-4">Order Details</h4>
                    
                    {/* Order Items */}
                    <div className="space-y-3 mb-6">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-orange-100 rounded-md flex items-center justify-center mr-3">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                              ) : (
                                <ShoppingBag size={16} className="text-orange-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{item.name}</p>
                              <p className="text-xs text-gray-500">{CURRENCY}{item.price.toFixed(2)} x {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-medium text-gray-900">{CURRENCY}{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Order Summary */}
                    <div className="bg-white p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{CURRENCY}{order.payment.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery Fee</span>
                        <span>{CURRENCY}{order.payment.deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax</span>
                        <span>{CURRENCY}{order.payment.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-gray-900 pt-2 border-t">
                        <span>Total</span>
                        <span>{CURRENCY}{order.payment.total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Delivery Information */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-800">Delivery Address</p>
                            <p className="text-sm text-gray-600 mt-1">{order.customer.address}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg">
                        <div className="flex items-start">
                          <Phone className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-800">Contact Information</p>
                            <p className="text-sm text-gray-600 mt-1">{order.customer.name} • {order.customer.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Status */}
                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute top-0 left-4 h-full border-l-2 border-gray-200 z-0"></div>
                        <div className="relative z-10 flex items-start space-y-6 flex-col">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="h-5 w-5 text-white" />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-sm font-medium text-gray-900">Order Placed</h4>
                              <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                            </div>
                          </div>
                          
                          {order.status !== 'cancelled' && (
                            <div className="flex items-center mt-4">
                              <div className={`flex-shrink-0 h-8 w-8 rounded-full border-2 ${order.status !== 'pending' ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'} flex items-center justify-center`}>
                                {order.status !== 'pending' ? (
                                  <Check className="h-5 w-5 text-white" />
                                ) : (
                                  <Clock className="h-4 w-4 text-gray-400" />
                                )}
                              </div>
                              <div className="ml-4">
                                <h4 className="text-sm font-medium text-gray-900">Processing</h4>
                                <p className="text-xs text-gray-500">Your order is being prepared</p>
                              </div>
                            </div>
                          )}
                          
                          {order.status === 'delivered' && (
                            <div className="flex items-center mt-4">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500 border-2 border-green-500 flex items-center justify-center">
                                <Check className="h-5 w-5 text-white" />
                              </div>
                              <div className="ml-4">
                                <h4 className="text-sm font-medium text-gray-900">Delivered</h4>
                                <p className="text-xs text-gray-500">Your order has been delivered</p>
                              </div>
                            </div>
                          )}
                          
                          {order.status === 'cancelled' && (
                            <div className="flex items-center mt-4">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-500 border-2 border-red-500 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-white" />
                              </div>
                              <div className="ml-4">
                                <h4 className="text-sm font-medium text-gray-900">Cancelled</h4>
                                <p className="text-xs text-gray-500">Order has been cancelled</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;