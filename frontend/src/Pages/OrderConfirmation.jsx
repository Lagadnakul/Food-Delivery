import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import OrderService from '../services/orderService';
import { CURRENCY } from '../config';
import { assets } from '../assets/assets';
import confetti from 'canvas-confetti';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.orderDetails || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);
  const [showDeliveryDetails, setShowDeliveryDetails] = useState(true);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [copied, setCopied] = useState(false);

  // Trigger confetti effect when order is loaded successfully
  useEffect(() => {
    if (order && !loading && !error) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 500);

      // Set estimated delivery time (30-45 min from now)
      const now = new Date();
      const deliveryStart = new Date(now.getTime() + 30 * 60000);
      const deliveryEnd = new Date(now.getTime() + 45 * 60000);
      
      const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };
      
      setEstimatedDelivery(`${formatTime(deliveryStart)} - ${formatTime(deliveryEnd)}`);
    }
  }, [order, loading, error]);

  useEffect(() => {
    // If we don't have the order details from navigation state, fetch them
    if (!order && orderId) {
      const fetchOrderDetails = async () => {
        try {
          setLoading(true);
          const response = await OrderService.getOrderById(orderId);
          if (response.success) {
            setOrder(response.data);
          } else {
            setError('Could not find order details');
          }
        } catch (err) {
          setError('Error loading order details');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchOrderDetails();
    }
  }, [order, orderId]);

  const copyOrderId = () => {
    if (order && order._id) {
      navigator.clipboard.writeText(order._id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img src={assets.HH_logo_small || assets.HH_logo} alt="Logo" className="w-12 h-12" />
          </motion.div>
        </div>
        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.7 }}
          className="mt-6 text-gray-600 font-medium"
        >
          Loading your order details...
        </motion.p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] container mx-auto px-4 py-16 max-w-2xl flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-lg w-full text-center"
        >
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">{error || "We couldn't find the order you're looking for. It might have been removed or the link is invalid."}</p>
          <div className="flex flex-col md:flex-row gap-3 justify-center">
            <Link to="/menu" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
              Browse Our Menu
            </Link>
            <Link to="/contact" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl pt-30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden"
      >
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-2xl text-white px-8 py-10 text-center relative overflow-hidden">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mb-5 shadow-lg"
          >
            <svg className="w-14 h-14 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold mb-2"
          >
            Order Confirmed!
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-green-50 text-lg"
          >
            Thank you for your order
          </motion.p>
          
          {/* Decorative elements */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
        </div>
        
        {/* Order Content */}
        <div className="bg-white rounded-b-2xl shadow-lg overflow-hidden">
          {/* Order ID and Tracking */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Order #{order._id ? order._id.slice(-6).toUpperCase() : 'New'}</h2>
                  <button 
                    onClick={copyOrderId} 
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy order ID"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {copied && (
                      <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="ml-2 text-sm text-green-600"
                      >
                        Copied!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-gray-500 text-sm">
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <div className="flex flex-col items-start md:items-end">
                <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                  Order Processing
                </div>
                {estimatedDelivery && (
                  <p className="text-gray-500 text-sm mt-1">Estimated delivery: {estimatedDelivery}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Delivery Details */}
          <div className="p-6 border-b border-gray-100">
            <div 
              className="flex justify-between items-center cursor-pointer mb-3" 
              onClick={() => setShowDeliveryDetails(!showDeliveryDetails)}
            >
              <h3 className="font-semibold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Delivery Details
              </h3>
              <motion.div
                animate={{ rotate: showDeliveryDetails ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </div>
            
            <AnimatePresence>
              {showDeliveryDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-500 text-xs uppercase mb-1 tracking-wider">Recipient</p>
                      <p className="font-medium text-gray-800">{order.customer.name}</p>
                      <p className="text-gray-600 mt-1">{order.customer.phone}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-500 text-xs uppercase mb-1 tracking-wider">Payment Method</p>
                      <div className="flex items-center">
                        {order.payment.method === 'card' && (
                          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        )}
                        {order.payment.method === 'paypal' && (
                          <svg className="w-6 h-6 mr-2 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 3.217a.99.99 0 01.978-.833h6.648c3.07 0 5.221 1.737 5.128 4.3-.036 1.02-.368 2.557-1.139 3.92-.802 1.408-2.062 2.23-3.542 2.36.95.49 1.464 1.22 1.271 2.48-.198 1.296-.986 2.335-2.143 2.842-.912.4-2.496.557-4.099.557h-1.22c-.223 0-.404.182-.4.405l.122 2.008a.642.642 0 01-.632.74H3.307c-.341 0-.678-.192-.842-.506L2 19.385l.463-.148h4.613zm3.672-9.202c-.82.152-1.74.156-2.624.156h-.855c-.223 0-.404.182-.4.405l.387 4.144c.004.223.185.405.409.405h.577c.706 0 1.376-.04 1.98-.146 1.728-.3 2.67-1.456 2.82-3.457.203-2.453-1.112-3.028-2.3-3.507l.006.001z"/>
                          </svg>
                        )}
                        {order.payment.method === 'cod' && (
                          <svg className="w-6 h-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        )}
                        <span className="font-medium text-gray-800 capitalize">
                          {order.payment.method === 'cod' ? 'Cash on Delivery' : order.payment.method}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                      <p className="text-gray-500 text-xs uppercase mb-1 tracking-wider">Delivery Address</p>
                      <p className="font-medium text-gray-800">{order.customer.address}</p>
                    </div>
                    
                    {order.customer.instructions && (
                      <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                        <p className="text-gray-500 text-xs uppercase mb-1 tracking-wider">Special Instructions</p>
                        <p className="text-gray-800">{order.customer.instructions}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Order Items */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Order Items ({order.items.length})
            </h3>
            
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center bg-gray-50 rounded-xl p-3 hover:shadow-sm transition-shadow"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white shadow-sm">
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = assets.food_1;
                      }}
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{CURRENCY}{(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{CURRENCY}{item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Order Summary
            </h3>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{CURRENCY}{order.payment.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{CURRENCY}{order.payment.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{CURRENCY}{order.payment.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-3 border-t border-gray-200 mt-2">
                  <span>Total</span>
                  <span className="text-green-600">{CURRENCY}{order.payment.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <Link 
                to="/menu"
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center flex-1 sm:flex-none"
              >
                Order More Food
              </Link>
              
              <Link 
                to="/"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:shadow-md transition-all text-center flex-1 sm:flex-none"
              >
                Back to Home
              </Link>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Having issues with your order? <Link to="/contact" className="text-orange-600 hover:underline">Contact Support</Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;