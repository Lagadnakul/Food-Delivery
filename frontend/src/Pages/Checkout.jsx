import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CURRENCY } from '../config';
import { assets } from '../assets/assets';
import axios from 'axios';
import { API_URL } from '../config';
import { showToast } from '../utils/toastUtils';

const Checkout = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const { 
    cartItems, 
    cartSubtotal,
    cartTax,
    deliveryFee,
    cartTotal,
    updateQuantity,
    clearCart
  } = useCart();
  
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    phone: '',
    address: '',
    instructions: ''
  });

  // Load user data from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setDeliveryDetails(prev => ({
          ...prev,
          name: userData.name || prev.name,
          phone: userData.phone || prev.phone,
        }));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }
  }, []);

  const steps = ['Cart Review', 'Delivery Info', 'Payment'];

  const nextStep = () => {
    setActiveStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setActiveStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const saveAddressCheckbox = document.getElementById('save-address');
      
      // If user wants to save address and they aren't using a saved address already
      if (saveAddressCheckbox && saveAddressCheckbox.checked && !selectedAddressId) {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            // Save the address to user profile
            await axios.post(
              `${API_URL}/user/addresses`, 
              {
                name: deliveryDetails.name,
                phone: deliveryDetails.phone,
                address: deliveryDetails.address,
                label: 'home', // Default label
                isDefault: false // Not default by default
              },
              { headers: { 'Authorization': `Bearer ${token}` } }
            );
          } catch (err) {
            console.error("Error saving address:", err);
            // Continue with order even if saving address fails
          }
        }
      }
      
      // Format the order data for the API
      const orderData = {
        customer: {
          name: deliveryDetails.name,
          phone: deliveryDetails.phone,
          address: deliveryDetails.address,
          instructions: deliveryDetails.instructions || ''
        },
        items: cartItems.map(item => ({
          productId: String(item._id || item.id),
          name: item.name,
          price: Number(parseFloat(item.price).toFixed(2)),
          quantity: Number(item.quantity),
          image: item.image.replace(/^\/src\/assets\//, '')
        })),
        payment: {
          method: paymentMethod,
          subtotal: Number(parseFloat(cartSubtotal).toFixed(2)),
          tax: Number(parseFloat(cartTax).toFixed(2)),
          deliveryFee: Number(parseFloat(deliveryFee).toFixed(2)),
          total: Number(parseFloat(cartTotal).toFixed(2))
        },
        status: 'pending'
      };
      
      // Make API call to create order
      const response = await axios.post(`${API_URL}/orders`, orderData);
      
      // Clear the cart after successful order
      clearCart();
      
      // Navigate to the order confirmation page
      const orderId = response.data._id || (response.data.data && response.data.data._id);
      if (orderId) {
        navigate(`/order-confirmation/${orderId}`, { 
          state: { orderDetails: response.data.data || response.data } 
        });
        showToast.order.placed();
      } else {
        showToast.error('Order created but could not redirect to confirmation page.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      if (error.response) {
        showToast.order.failed(error.response.data.message || 'Please check your details and try again.');
      } else {
        showToast.error('Connection error. Please check your internet and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1: Review Order Items
  const ReviewOrder = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden "
    >
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <h2 className="text-2xl font-bold">Your Cart</h2>
        <p className="text-orange-100 mt-1">Review your items before checkout</p>
      </div>

      <div className="p-6">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <motion.div 
              className="w-28 h-28 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <svg className="w-14 h-14 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Your cart is empty</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Looks like you haven't added any delicious items to your cart yet. 
              Explore our menu to find something tasty!
            </p>
            <Link 
              to="/menu"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-gray-50">
              <AnimatePresence>
                {cartItems.map(item => (
                  <motion.div 
                    key={item.cartId || item._id || item.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center border-b border-gray-100 py-4 group hover:bg-orange-50 px-3 rounded-lg transition-colors"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                      <img 
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const itemId = parseInt(item._id || item.id);
                          if (!isNaN(itemId) && itemId >= 1 && itemId <= 32) {
                            e.target.src = assets[`food_${itemId}`];
                          } else {
                            e.target.src = assets.food_1;
                          }
                        }}
                      />
                    </div>
                    
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                        <div className="text-orange-600 font-medium">
                          {CURRENCY}{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {CURRENCY}{parseFloat(item.price).toFixed(2)} per item
                        </span>
                        
                        <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                          <motion.button 
                            whileHover={{ backgroundColor: "#f97316", color: "#ffffff" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.cartId || item._id || item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                            </svg>
                          </motion.button>
                          <span className="w-10 text-center font-medium text-gray-700">{item.quantity}</span>
                          <motion.button 
                            whileHover={{ backgroundColor: "#f97316", color: "#ffffff" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.cartId || item._id || item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="mt-8 space-y-2.5 bg-gray-50 p-5 rounded-xl">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{CURRENCY}{cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{CURRENCY}{cartTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>{CURRENCY}{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2.5 border-t border-gray-200 mt-1">
                <span>Total</span>
                <span className="text-orange-600">{CURRENCY}{cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <div className="flex justify-between">
          <Link 
            to="/menu"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Menu
          </Link>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextStep}
            disabled={cartItems.length === 0}
            className={`inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all ${
              cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Continue
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Step 2: Delivery Details Form
  const DeliveryDetails = () => {
    const handleSubmit = (e) => {
      e.preventDefault();
      nextStep();
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <h2 className="text-2xl font-bold">Delivery Details</h2>
          <p className="text-orange-100 mt-1">Tell us where to deliver your order</p>
        </div>

        <div className="p-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <label htmlFor="form-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="form-name"
                  name="name"
                  value={deliveryDetails.name}
                  onChange={(e) => setDeliveryDetails({...deliveryDetails, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 text-gray-700 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all shadow-sm"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
            
            {/* Phone Field */}
            <div>
              <label htmlFor="form-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  id="form-phone"
                  name="phone"
                  value={deliveryDetails.phone}
                  onChange={(e) => setDeliveryDetails({...deliveryDetails, phone: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 text-gray-700 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all shadow-sm"
                  placeholder="Your contact number"
                  required
                />
              </div>
            </div>
            
            {/* Address Field */}
            <div>
              <label htmlFor="form-address" className="block text-sm font-medium text-gray-700 mb-1.5">
                Delivery Address
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <textarea
                  id="form-address"
                  name="address"
                  rows="3"
                  value={deliveryDetails.address}
                  onChange={(e) => setDeliveryDetails({...deliveryDetails, address: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 text-gray-700 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all shadow-sm resize-none"
                  placeholder="Enter your full address"
                  required
                ></textarea>
              </div>
            </div>
            
            {/* Instructions Field */}
            <div>
              <label htmlFor="form-instructions" className="block text-sm font-medium text-gray-700 mb-1.5">
                Delivery Instructions <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <textarea
                  id="form-instructions"
                  name="instructions"
                  rows="2"
                  value={deliveryDetails.instructions}
                  onChange={(e) => setDeliveryDetails({...deliveryDetails, instructions: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 text-gray-700 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all shadow-sm resize-none"
                  placeholder="Any special instructions for delivery"
                ></textarea>
              </div>
            </div>
          
            {/* Save Address Option */}
            <div className="flex items-center mt-2">
              <input
                id="save-address"
                type="checkbox"
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="save-address" className="ml-2 text-sm text-gray-700">
                Save this address for future orders
              </label>
            </div>
          
            <div className="pt-6 border-t border-gray-100 mt-5">
              <div className="flex justify-between">
                <motion.button 
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </motion.button>
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!deliveryDetails.name || !deliveryDetails.phone || !deliveryDetails.address}
                  className={`inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all ${
                    !deliveryDetails.name || !deliveryDetails.phone || !deliveryDetails.address 
                      ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Continue
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    );
  };

  // Step 3: Payment Options
  const Payment = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <h2 className="text-2xl font-bold">Payment Method</h2>
        <p className="text-orange-100 mt-1">Choose how you want to pay</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
              paymentMethod === 'card' 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-orange-300'
            }`}
            onClick={() => setPaymentMethod('card')}
          >
            <div className="flex items-center">
              <input
                type="radio"
                id="card"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="h-5 w-5 text-orange-500 focus:ring-orange-500"
              />
              <label htmlFor="card" className="ml-3 flex items-center justify-between cursor-pointer w-full">
                <div>
                  <span className="font-medium text-gray-800 block mb-1">Credit/Debit Card</span>
                  <p className="text-sm text-gray-500">Pay securely with your card</p>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-11 rounded shadow-sm overflow-hidden border border-gray-200">
                    <svg viewBox="0 0 48 48" className="h-full w-full">
                      <rect x="4" y="8" width="40" height="32" rx="4" fill="#1A1F71" />
                      <path d="M19 30L22 18H26L23 30H19Z" fill="#FFFFFF" />
                      <path d="M33 18L29.5 25.5L29 24L27 18H23L28 30H32L39 18H33Z" fill="#FFFFFF" />
                    </svg>
                  </div>
                  <div className="h-8 w-11 rounded shadow-sm overflow-hidden border border-gray-200">
                    <svg viewBox="0 0 48 48" className="h-full w-full">
                      <rect x="4" y="8" width="40" height="32" rx="4" fill="#EB001B" />
                      <circle cx="24" cy="24" r="8" fill="#FFFFFF" />
                      <circle cx="24" cy="24" r="8" fill="#F79E1B" fillOpacity="0.8" />
                    </svg>
                  </div>
                </div>
              </label>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
              paymentMethod === 'paypal' 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-orange-300'
            }`}
            onClick={() => setPaymentMethod('paypal')}
          >
            <div className="flex items-center">
              <input
                type="radio"
                id="paypal"
                name="payment"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={() => setPaymentMethod('paypal')}
                className="h-5 w-5 text-orange-500 focus:ring-orange-500"
              />
              <label htmlFor="paypal" className="ml-3 flex items-center justify-between cursor-pointer w-full">
                <div>
                  <span className="font-medium text-gray-800 block mb-1">PayPal</span>
                  <p className="text-sm text-gray-500">Fast and secure payment with PayPal</p>
                </div>
                <div className="h-8 w-11 rounded shadow-sm overflow-hidden border border-gray-200">
                  <svg viewBox="0 0 48 48" className="h-full w-full">
                    <rect x="4" y="8" width="40" height="32" rx="4" fill="#003087" />
                    <path d="M16 18C16 16.8954 16.8954 16 18 16H21C23.2091 16 25 17.7909 25 20C25 22.2091 23.2091 24 21 24H18C16.8954 24 16 23.1046 16 22V18Z" fill="#FFFFFF" />
                    <path d="M25 20C25 22.2091 23.2091 24 21 24H20L19 28H16L18 18H21C23.2091 18 25 19.7909 25 20Z" fill="#FFFFFF" fillOpacity="0.5" />
                  </svg>
                </div>
              </label>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
              paymentMethod === 'cod' 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-orange-300'
            }`}
            onClick={() => setPaymentMethod('cod')}
          >
            <div className="flex items-center">
              <input
                type="radio"
                id="cod"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="h-5 w-5 text-orange-500 focus:ring-orange-500"
              />
              <label htmlFor="cod" className="ml-3 flex items-center justify-between cursor-pointer w-full">
                <div>
                  <span className="font-medium text-gray-800 block mb-1">Cash on Delivery</span>
                  <p className="text-sm text-gray-500">Pay with cash when your order arrives</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </label>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 p-5 bg-gray-50 rounded-xl border border-gray-100"
          >
            <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
            
            <div className="space-y-2.5">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{CURRENCY}{cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{CURRENCY}{cartTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>{CURRENCY}{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2.5 border-t border-gray-200 mt-1">
                <span>Total</span>
                <span className="text-orange-600">{CURRENCY}{cartTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              By placing this order, you agree to our <a href="#" className="text-orange-600 hover:underline">Terms of Service</a> and <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>
            </p>
          </motion.div>
        </div>
      </div>
      
      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <div className="flex justify-between">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={prevStep}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            disabled={isSubmitting}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className={`inline-flex items-center px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Place Order
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Step indicators
  const StepIndicator = () => (
    <div className="mb-10">
      <div className="flex items-center justify-center max-w-md mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: index <= activeStep ? 1 : 0 }}
                className={`flex-grow h-1 max-w-[100px] mx-3 origin-left ${
                  index <= activeStep ? 'bg-orange-500' : 'bg-gray-200'
                }`}
              ></motion.div>
            )}
            <div className="flex flex-col items-center">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: 1,
                  backgroundColor: index < activeStep ? '#f97316' : index === activeStep ? '#ffffff' : '#f9fafb',
                  borderColor: index === activeStep ? '#f97316' : index < activeStep ? '#f97316' : '#e5e7eb'
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  index < activeStep ? 'bg-orange-500 text-white border-orange-500' :
                  index === activeStep ? 'border-orange-500 text-orange-500 shadow-md' : 'border-gray-200 text-gray-400'
                }`}
              >
                {index < activeStep ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="font-semibold">{index + 1}</span>
                )}
              </motion.div>
              <span className={`mt-2 text-sm ${
                index === activeStep ? 'text-orange-600 font-medium' : 
                index < activeStep ? 'text-gray-700' : 'text-gray-400'
              }`}>
                {step}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  // Render the active step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <ReviewOrder />;
      case 1:
        return <DeliveryDetails />;
      case 2:
        return <Payment />;
      default:
        return <ReviewOrder />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl pt-30">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Checkout</h1>
      <StepIndicator />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Checkout;