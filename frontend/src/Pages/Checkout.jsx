import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CURRENCY } from '../config';
import { assets } from '../assets/assets';
import axios from 'axios';
import { API_URL } from '../config';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
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

  const steps = ['Review Order', 'Delivery Details', 'Payment'];

  const nextStep = () => {
    setActiveStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setActiveStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Format the order data for the API with explicit number conversions
      const orderData = {
        customer: {
          name: deliveryDetails.name,
          phone: deliveryDetails.phone,
          address: deliveryDetails.address,
          instructions: deliveryDetails.instructions || ''
        },
        items: cartItems.map(item => ({
          productId: String(item._id || item.id), // Ensure productId is a string
          name: item.name,
          price: Number(parseFloat(item.price).toFixed(2)),
          quantity: Number(item.quantity),
          // Use a relative path for the image or a complete URL
          image: item.image.replace(/^\/src\/assets\//, '') // Remove the src prefix if it exists
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
      
      console.log('Submitting order data:', JSON.stringify(orderData));
      
      // Make API call to create order
      const response = await axios.post(`${API_URL}/orders`, orderData);
      console.log('Order response:', response.data);
      
      // Clear the cart after successful order
      clearCart();
      
      // Navigate to the order confirmation page with the correct ID path
      const orderId = response.data._id || (response.data.data && response.data.data._id);
      if (orderId) {
        navigate(`/order-confirmation/${orderId}`, { 
          state: { orderDetails: response.data.data || response.data } 
        });
        toast.success('Order placed successfully!');
      } else {
        console.error('No order ID in response:', response.data);
        toast.error('Order created but could not redirect to confirmation page.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        // Log the details array if it exists
        if (error.response.data && error.response.data.details) {
          console.error('Validation details:', error.response.data.details);
        }
        toast.error(`Order failed: ${error.response.data.message || 'Please check your details and try again.'}`);
      } else {
        toast.error('There was an error placing your order. Please try again.');
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
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <h2 className="text-xl font-bold">Review Your Order</h2>
      </div>

      <div className="p-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <motion.div 
              className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <svg className="w-12 h-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add some delicious items to your cart first!</p>
            <Link 
              to="/menu"
              className="px-6 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto max-h-96">
              {cartItems.map(item => (
                <motion.div 
                  key={item.cartId || item._id || item.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex border-b border-gray-100 py-4 relative"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
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
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <div className="text-gray-600">
                        {CURRENCY}{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-500 mr-4">Qty: {item.quantity}</span>
                      <div className="flex space-x-2">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateQuantity(item.cartId || item._id || item.id, item.quantity - 1)}
                          className="text-sm text-orange-500 hover:text-orange-700"
                        >
                          Remove
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateQuantity(item.cartId || item._id || item.id, item.quantity + 1)}
                          className="text-sm text-orange-500 hover:text-orange-700"
                        >
                          Add
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 space-y-2">
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
              <div className="flex justify-between font-bold text-gray-800 pt-2 border-t">
                <span>Total</span>
                <span>{CURRENCY}{cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-end">
          <Link 
            to="/menu"
            className="px-4 py-2 mr-4 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Back to Menu
          </Link>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextStep}
            disabled={cartItems.length === 0}
            className={`px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 ${
              cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Continue to Delivery
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Step 2: Delivery Details Form
  const DeliveryDetails = () => {
    // Form submission handler
    const handleSubmit = (e) => {
      e.preventDefault();
      nextStep();
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <h2 className="text-xl font-bold">Delivery Details</h2>
        </div>

        <div className="p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="form-name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="form-name"
                name="name"
                value={deliveryDetails.name}
                onChange={(e) => setDeliveryDetails({...deliveryDetails, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="form-phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="form-phone"
                name="phone"
                value={deliveryDetails.phone}
                onChange={(e) => setDeliveryDetails({...deliveryDetails, phone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="form-address" className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <textarea
                id="form-address"
                name="address"
                rows="3"
                value={deliveryDetails.address}
                onChange={(e) => setDeliveryDetails({...deliveryDetails, address: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                required
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="form-instructions" className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Instructions (Optional)
              </label>
              <textarea
                id="form-instructions"
                name="instructions"
                rows="2"
                value={deliveryDetails.instructions}
                onChange={(e) => setDeliveryDetails({...deliveryDetails, instructions: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              ></textarea>
            </div>
          
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <motion.button 
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Back to Order
                </motion.button>
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!deliveryDetails.name || !deliveryDetails.phone || !deliveryDetails.address}
                  className={`px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 ${
                    !deliveryDetails.name || !deliveryDetails.phone || !deliveryDetails.address 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                  }`}
                >
                  Continue to Payment
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
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <h2 className="text-xl font-bold">Payment Method</h2>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
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
              <label htmlFor="card" className="ml-3 flex items-center cursor-pointer w-full">
                <span className="font-medium text-gray-700 mr-3">Credit/Debit Card</span>
                <div className="flex space-x-2">
                  <span className="text-blue-600">
                    <svg className="h-6 w-8" viewBox="0 0 48 48" fill="none">
                      <rect x="4" y="8" width="40" height="32" rx="4" fill="#1A1F71" />
                      <path d="M19 30L22 18H26L23 30H19Z" fill="#FFFFFF" />
                      <path d="M33 18L29.5 25.5L29 24L27 18H23L28 30H32L39 18H33Z" fill="#FFFFFF" />
                      <path d="M10.5 18L9 30H13L14.5 18H10.5Z" fill="#FFFFFF" />
                      <path d="M16 23.5C16 21 14 19 11 19L7 23.5C7 26 9 28 12 28L16 23.5Z" fill="#FFFFFF" />
                    </svg>
                  </span>
                  <span className="text-red-600">
                    <svg className="h-6 w-8" viewBox="0 0 48 48" fill="none">
                      <rect x="4" y="8" width="40" height="32" rx="4" fill="#EB001B" />
                      <circle cx="24" cy="24" r="8" fill="#FFFFFF" />
                      <circle cx="24" cy="24" r="8" fill="#F79E1B" fillOpacity="0.8" />
                    </svg>
                  </span>
                </div>
              </label>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
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
              <label htmlFor="paypal" className="ml-3 cursor-pointer w-full">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 mr-3">PayPal</span>
                  <svg className="h-6 w-8" viewBox="0 0 48 48" fill="none">
                    <rect x="4" y="8" width="40" height="32" rx="4" fill="#003087" />
                    <path d="M16 18C16 16.8954 16.8954 16 18 16H21C23.2091 16 25 17.7909 25 20C25 22.2091 23.2091 24 21 24H18C16.8954 24 16 23.1046 16 22V18Z" fill="#FFFFFF" />
                    <path d="M25 20C25 22.2091 23.2091 24 21 24H20L19 28H16L18 18H21C23.2091 18 25 19.7909 25 20Z" fill="#FFFFFF" fillOpacity="0.5" />
                    <path d="M23 22C23 20.8954 23.8954 20 25 20H28C30.2091 20 32 21.7909 32 24C32 26.2091 30.2091 28 28 28H25C23.8954 28 23 27.1046 23 26V22Z" fill="#FFFFFF" />
                    <path d="M32 24C32 26.2091 30.2091 28 28 28H27L26 32H23L25 22H28C30.2091 22 32 23.7909 32 24Z" fill="#FFFFFF" fillOpacity="0.5" />
                  </svg>
                </div>
              </label>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
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
              <label htmlFor="cod" className="ml-3 cursor-pointer w-full">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 mr-3">Cash on Delivery</span>
                  <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
            className="mt-8 p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex justify-between mb-2">
              <span className="font-medium">Total Payment</span>
              <span className="font-bold text-orange-600">{CURRENCY}{cartTotal.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500">By proceeding, you agree to our Terms of Service and Privacy Policy</p>
          </motion.div>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={prevStep}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
            disabled={isSubmitting}
          >
            Back to Delivery
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className={`px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : 'Place Order'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Step indicators
  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: index <= activeStep ? 1 : 0 }}
                className={`flex-grow h-1 max-w-[100px] mx-2 origin-left ${
                  index <= activeStep ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              ></motion.div>
            )}
            <div className="flex flex-col items-center">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: 1,
                  backgroundColor: index < activeStep ? '#f97316' : '#ffffff',
                  borderColor: index === activeStep ? '#f97316' : index < activeStep ? '#f97316' : '#d1d5db'
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  index < activeStep ? 'bg-orange-500 text-white border-orange-500' :
                  index === activeStep ? 'border-orange-500 text-orange-500' : 'border-gray-300 text-gray-400'
                }`}
              >
                {index < activeStep ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </motion.div>
              <span className={`mt-2 text-sm ${
                index === activeStep ? 'text-orange-600 font-medium' : 'text-gray-500'
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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>
      <StepIndicator />
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderStepContent()}
      </motion.div>
    </div>
  );
};

export default Checkout;