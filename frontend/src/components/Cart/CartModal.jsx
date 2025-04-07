import React from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { CURRENCY } from '../../config';
import { useCart } from '../../contexts/CartContext';

const CartModal = () => {
  const { 
    cartItems, 
    cartSubtotal,
    cartTax,
    deliveryFee,
    cartTotal,
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart,
    clearCart 
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <motion.div 
    className="fixed inset-0 z-50 flex justify-end overflow-hidden"
    initial={{ opacity: 0, backgroundColor: "rgba(0, 0, 0, 0)" }}
    animate={{ opacity: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    exit={{ opacity: 0, backgroundColor: "rgba(0, 0, 0, 0)" }}
    onClick={() => setIsCartOpen(false)}
  >
      <motion.div 
        className="bg-white w-full max-w-md h-full shadow-xl flex flex-col"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-xl font-bold">Your Cart</h2>
            <span className="ml-2 bg-white text-orange-500 text-xs px-2 py-1 rounded-full font-bold">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-white hover:text-gray-200 focus:outline-none transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8 bg-gray-50">
            <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-16 h-16 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 text-center mb-8 max-w-xs">
              Looks like you haven't added any delicious items to your cart yet.
            </p>
            <Link
              to="/menu"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
              onClick={() => setIsCartOpen(false)}
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto px-4 pt-4 pb-2 bg-gray-50">
              <AnimatePresence initial={false}>
                {cartItems.map(item => (
                  <motion.div 
                    key={item.cartId || item._id || item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0, padding: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl mb-3 shadow-sm overflow-hidden"
                  >
                    <div className="flex p-3">
                      {/* Food Image */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
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
                      
                      {/* Food Details */}
                      <div className="flex-grow ml-4">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(item.cartId || item._id || item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </motion.button>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs">
                            {item.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                            <motion.button 
                              whileTap={{ scale: 0.9 }}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700"
                              onClick={() => updateQuantity(item.cartId || item._id || item.id, item.quantity - 1)}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </motion.button>
                            <span className="w-8 text-center font-medium text-gray-800">
                              {item.quantity}
                            </span>
                            <motion.button 
                              whileTap={{ scale: 0.9 }}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700"
                              onClick={() => updateQuantity(item.cartId || item._id || item.id, item.quantity + 1)}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </motion.button>
                          </div>
                          
                          {/* Item Price */}
                          <div className="text-right">
                            <span className="font-semibold text-gray-900">
                              {CURRENCY}{(item.price * item.quantity).toFixed(2)}
                            </span>
                            {item.quantity > 1 && (
                              <div className="text-xs text-gray-500">
                                {CURRENCY}{item.price.toFixed(2)} each
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Checkout Section */}
            <div className="border-t border-gray-200 bg-white p-4">
              {/* Order Summary */}
              <div className="mb-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{CURRENCY}{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{CURRENCY}{cartTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">{CURRENCY}{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 border-t border-gray-200 mt-2 text-lg font-bold">
                  <span>Total</span>
                  <span>{CURRENCY}{cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearCart}
                  className="px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Cart
                </motion.button>
                <Link 
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-colors flex items-center justify-center shadow-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CartModal;