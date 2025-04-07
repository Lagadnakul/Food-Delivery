import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';

const CartButton = () => {
  const { toggleCart, cartCount, cartTotal } = useCart();

  return (
    <motion.button
      className="relative group p-2 flex items-center"
      onClick={toggleCart}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Shopping cart"
    >
      <div className="relative mr-1">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-gray-700 group-hover:text-orange-500 transition-colors" 
          fill="none"
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
          />
        </svg>
        
        {cartCount > 0 && (
          <motion.div 
            className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 15 
            }}
            key={cartCount}
          >
            {cartCount}
          </motion.div>
        )}
      </div>
      
      {cartTotal > 0 && (
        <div className="hidden md:block text-sm font-medium text-gray-700 group-hover:text-orange-500 transition-colors">
          ${cartTotal.toFixed(2)}
        </div>
      )}
    </motion.button>
  );
};

export default CartButton;