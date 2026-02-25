import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence ,motion} from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { CURRENCY } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import AuthService from '../services/authService';
import OrderService from '../services/orderService';
import { showToast } from '../utils/toastUtils';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedAddressId] = useState(null);
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

  // Handle delivery details input change - using callback to prevent re-renders
  const handleDeliveryChange = useCallback((field, value) => {
    setDeliveryDetails(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Load user data from AuthContext
  useEffect(() => {
    if (user) {
      setDeliveryDetails(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

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
    
    // Check if user is authenticated - check both context and localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      showToast.error('Please login to place an order');
      navigate('/');
      return;
    }
    
    // Validate required fields
    if (!deliveryDetails.name || !deliveryDetails.phone || !deliveryDetails.address) {
      showToast.error('Please fill in all delivery details');
      return;
    }

    if (cartItems.length === 0) {
      showToast.error('Your cart is empty');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const saveAddressCheckbox = document.getElementById('save-address');
      
      // If user wants to save address and they aren't using a saved address already
      if (saveAddressCheckbox && saveAddressCheckbox.checked && !selectedAddressId) {
        try {
          await AuthService.addAddress({
            name: deliveryDetails.name,
            phone: deliveryDetails.phone,
            address: deliveryDetails.address,
            label: 'home',
            isDefault: false
          });
        } catch (err) {
          console.error("Error saving address:", err);
          // Continue with order even if saving address fails
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
          image: item.image ? item.image.replace(/^\/src\/assets\//, '') : ''
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
      
      // Make API call to create order using OrderService
      const response = await OrderService.placeOrder(orderData);
      
      if (response.success) {
        // Clear the cart after successful order
        clearCart();
        
        // Navigate to the order confirmation page
        const orderId = response._id || (response.data && response.data._id);
        if (orderId) {
          navigate(`/order-confirmation/${orderId}`, { 
            state: { orderDetails: response.data || response } 
          });
          showToast.order.placed();
        } else {
          showToast.success('Order placed successfully!');
          navigate('/');
        }
      } else {
        // Handle API error response
        showToast.order.failed(response.message || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      if (error.response) {
        showToast.order.failed(error.response.data?.message || 'Please check your details and try again.');
      } else if (error.message) {
        showToast.error(error.message);
      } else {
        showToast.error('Connection error. Please check your internet and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1: Review Order Items
  const renderReviewOrder = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card className="shadow-lg overflow-hidden border-0">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <p className="text-orange-100 mt-1">Review your items before checkout</p>
        </div>

        <CardContent className="p-6">
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
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg pt-2 mt-1">
                  <span>Total</span>
                  <span className="text-orange-600">{CURRENCY}{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between">
          <Button 
            variant="outline"
            className="h-12 px-6 rounded-xl font-medium"
            asChild
          >
            <Link to="/menu">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Menu
            </Link>
          </Button>

          <Button 
            onClick={nextStep}
            disabled={cartItems.length === 0}
            className={`h-12 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all ${
              cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Continue
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </div>
      </Card>
    </motion.div>
  );

  // Step 2: Delivery Details Form
  const renderDeliveryDetails = () => {
    const handleSubmit = (e) => {
      e.preventDefault();
      nextStep();
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Card className="shadow-lg overflow-hidden border-0">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <h2 className="text-2xl font-bold">Delivery Details</h2>
            <p className="text-orange-100 mt-1">Tell us where to deliver your order</p>
          </div>

          <CardContent className="p-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="form-name">Full Name</Label>
                  <Input
                    id="form-name"
                    name="name"
                    value={deliveryDetails.name}
                    onChange={(e) => handleDeliveryChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className="h-12"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="form-phone">Phone Number</Label>
                  <Input
                    type="tel"
                    id="form-phone"
                    name="phone"
                    value={deliveryDetails.phone}
                    onChange={(e) => handleDeliveryChange('phone', e.target.value)}
                    placeholder="Your contact number"
                    className="h-12"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="form-address">Delivery Address</Label>
                  <Textarea
                    id="form-address"
                    name="address"
                    rows="3"
                    value={deliveryDetails.address}
                    onChange={(e) => handleDeliveryChange('address', e.target.value)}
                    placeholder="Enter your full address"
                    className="resize-none"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="form-instructions">Delivery Instructions <span className="text-gray-400 font-normal">(Optional)</span></Label>
                  <Textarea
                    id="form-instructions"
                    name="instructions"
                    rows="2"
                    value={deliveryDetails.instructions}
                    onChange={(e) => handleDeliveryChange('instructions', e.target.value)}
                    placeholder="Any special instructions for delivery"
                    className="resize-none"
                  />
                </div>
              </div>
            
              <div className="flex items-center space-x-2 mt-4 pt-2">
                <input
                  id="save-address"
                  type="checkbox"
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <Label htmlFor="save-address" className="font-normal cursor-pointer">
                  Save this address for future orders
                </Label>
              </div>
            
              <div className="pt-6 border-t border-gray-100 mt-6 md:flex md:justify-between items-center space-y-3 md:space-y-0">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="h-12 px-6 rounded-xl w-full md:w-auto font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </Button>
                <Button 
                  type="submit"
                  disabled={!deliveryDetails.name || !deliveryDetails.phone || !deliveryDetails.address}
                  className={`h-12 px-6 bg-gradient-to-r w-full md:w-auto from-orange-500 to-orange-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all ${
                    !deliveryDetails.name || !deliveryDetails.phone || !deliveryDetails.address 
                      ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Continue
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Step 3: Payment Options
  const renderPayment = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card className="shadow-lg overflow-hidden border-0">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <h2 className="text-2xl font-bold">Payment Method</h2>
          <p className="text-orange-100 mt-1">Choose how you want to pay</p>
        </div>

        <CardContent className="p-6">
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
            <div className={`flex items-center space-x-3 border-2 rounded-xl p-5 cursor-pointer transition-all ${
              paymentMethod === 'card' 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-orange-300'
            }`}>
              <RadioGroupItem value="card" id="card" className="text-orange-500 focus:ring-orange-500" />
              <Label htmlFor="card" className="flex-1 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-medium text-gray-800 block text-base mb-0.5">Credit/Debit Card</span>
                  <p className="text-sm text-gray-500 font-normal">Pay securely with your card</p>
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
              </Label>
            </div>
            
            <div className={`flex items-center space-x-3 border-2 rounded-xl p-5 cursor-pointer transition-all ${
              paymentMethod === 'paypal' 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-orange-300'
            }`}>
              <RadioGroupItem value="paypal" id="paypal" className="text-orange-500 focus:ring-orange-500" />
              <Label htmlFor="paypal" className="flex-1 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-medium text-gray-800 block text-base mb-0.5">PayPal</span>
                  <p className="text-sm text-gray-500 font-normal">Fast and secure payment with PayPal</p>
                </div>
                <div className="h-8 w-11 rounded shadow-sm overflow-hidden border border-gray-200">
                  <svg viewBox="0 0 48 48" className="h-full w-full">
                    <rect x="4" y="8" width="40" height="32" rx="4" fill="#003087" />
                    <path d="M16 18C16 16.8954 16.8954 16 18 16H21C23.2091 16 25 17.7909 25 20C25 22.2091 23.2091 24 21 24H18C16.8954 24 16 23.1046 16 22V18Z" fill="#FFFFFF" />
                    <path d="M25 20C25 22.2091 23.2091 24 21 24H20L19 28H16L18 18H21C23.2091 18 25 19.7909 25 20Z" fill="#FFFFFF" fillOpacity="0.5" />
                  </svg>
                </div>
              </Label>
            </div>
            
            <div className={`flex items-center space-x-3 border-2 rounded-xl p-5 cursor-pointer transition-all ${
              paymentMethod === 'cod' 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-orange-300'
            }`}>
              <RadioGroupItem value="cod" id="cod" className="text-orange-500 focus:ring-orange-500" />
              <Label htmlFor="cod" className="flex-1 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-medium text-gray-800 block text-base mb-0.5">Cash on Delivery</span>
                  <p className="text-sm text-gray-500 font-normal">Pay with cash when your order arrives</p>
                </div>
                <div className="h-8 w-11 rounded flex items-center justify-center bg-gray-100 border border-gray-200">
                  <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </Label>
            </div>
          </RadioGroup>
          
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
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg pt-2 mt-1">
                <span>Total</span>
                <span className="text-orange-600">{CURRENCY}{cartTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              By placing this order, you agree to our <a href="#" className="text-orange-600 hover:underline">Terms of Service</a> and <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>
            </p>
          </motion.div>
        </CardContent>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col-reverse md:flex-row md:justify-between gap-3 md:gap-0 mt-auto">
          <Button 
            variant="outline"
            onClick={prevStep}
            className="h-12 px-6 rounded-xl font-medium w-full md:w-auto"
            disabled={isSubmitting}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Button>

          <Button 
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className={`h-12 px-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all w-full md:w-auto ${
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
          </Button>
        </div>
      </Card>
    </motion.div>
  );

  // Step indicators
  const renderStepIndicator = () => (
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

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl pt-30">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Checkout</h1>
      {renderStepIndicator()}
      
      {/* Step 0: Review Order */}
      <div style={{ display: activeStep === 0 ? 'block' : 'none' }}>
        {renderReviewOrder()}
      </div>
      
      {/* Step 1: Delivery Details */}
      <div style={{ display: activeStep === 1 ? 'block' : 'none' }}>
        {renderDeliveryDetails()}
      </div>
      
      {/* Step 2: Payment */}
      <div style={{ display: activeStep === 2 ? 'block' : 'none' }}>
        {renderPayment()}
      </div>
    </div>
  );
};

export default Checkout;