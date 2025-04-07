import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
// Removed useNavigate since it's not being used
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import OrderService from '../services/orderService';
import { CURRENCY } from '../config';
import { assets } from '../assets/assets';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  // Removed the unused navigate variable
  const [order, setOrder] = useState(location.state?.orderDetails || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <div className="bg-white rounded-xl p-8 shadow-md">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">{error || "We couldn't find the order you're looking for."}</p>
          <Link to="/menu" className="px-6 py-3 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 inline-block">
            Return to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-5 bg-gradient-to-r from-green-500 to-green-600 text-white text-center">
          <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Order Confirmed!</h1>
          <p className="mt-2">Your order has been successfully placed.</p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {order._id ? `Order #${order._id.slice(-6)}` : 'New Order'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 mb-1">Name</p>
                <p className="font-medium">{order.customer.name}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 mb-1">Phone</p>
                <p className="font-medium">{order.customer.phone}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg md:col-span-2">
                <p className="text-gray-500 mb-1">Delivery Address</p>
                <p className="font-medium">{order.customer.address}</p>
              </div>
              {order.customer.instructions && (
                <div className="bg-gray-50 p-3 rounded-lg md:col-span-2">
                  <p className="text-gray-500 mb-1">Instructions</p>
                  <p className="font-medium">{order.customer.instructions}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Items</h3>
            <div className="border rounded-lg overflow-hidden">
              {order.items.map((item, index) => (
                <div 
                  key={index} 
                  className={`flex items-center p-3 ${
                    index < order.items.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
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
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{CURRENCY}{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 border-t pt-4">
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Subtotal</span>
              <span>{CURRENCY}{order.payment.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Tax</span>
              <span>{CURRENCY}{order.payment.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Delivery Fee</span>
              <span>{CURRENCY}{order.payment.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 font-semibold text-lg border-t mt-2">
              <span>Total</span>
              <span>{CURRENCY}{order.payment.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between">
            <Link 
              to="/menu"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to Menu
            </Link>
            
            <Link 
              to="/"
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;