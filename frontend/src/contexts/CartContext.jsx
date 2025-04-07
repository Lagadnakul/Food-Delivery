import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CART_KEY, DELIVERY_FEE, TAX_RATE } from '../config';

// Create the context
const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [cartTax, setCartTax] = useState(0);
  const [deliveryFee] = useState(DELIVERY_FEE);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem(CART_KEY);
      }
    }
  }, []);

  // Calculate cart totals and save to localStorage whenever cart changes
  useEffect(() => {
    // Calculate cart count
    const newCartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(newCartCount);

    // Calculate subtotal with proper number formatting
    const newSubtotal = parseFloat(
      cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0).toFixed(2)
    );
    setCartSubtotal(newSubtotal);

    // Calculate tax
    const newTax = parseFloat((newSubtotal * TAX_RATE).toFixed(2));
    setCartTax(newTax);

    // Calculate total
    const newTotal = parseFloat((newSubtotal + newTax + deliveryFee).toFixed(2));
    setCartTotal(newTotal);
    
    // Save to localStorage
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems, deliveryFee]);

  // Add to cart with improved comparison - FIX HERE
  const addToCart = (item) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart by ID and category
      const existingItemIndex = prevItems.findIndex(
        cartItem => 
          ((cartItem.id === item.id || cartItem._id === item._id) && 
          cartItem.category === item.category)
      );
      
      let updatedItems;
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        
        toast.success(`Added another ${item.name} to your cart!`, {
          icon: '🛒',
          position: 'bottom-right',
          autoClose: 2000
        });
      } else {
        // Item doesn't exist, add new item
        updatedItems = [...prevItems, { 
          ...item, 
          quantity: 1,
          cartId: `${item._id || item.id}-${item.category}-${Date.now()}` // Unique ID for cart
        }];
        
        toast.success(`${item.name} added to your cart!`, {
          icon: '✅',
          position: 'bottom-right',
          autoClose: 2000
        });
      }
      
      return updatedItems;
    });
    
    // Use setTimeout to defer state update to avoid the error
    setTimeout(() => {
      setIsCartOpen(true);
    }, 0);
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => {
      // Find the item first to show a notification
      const existingItem = prevItems.find(
        item => item.cartId === itemId || item.id === itemId || item._id === itemId
      );
      
      if (existingItem) {
        toast.info(`Removed ${existingItem.name} from your cart`, {
          icon: '🗑️',
          position: 'bottom-right',
          autoClose: 2000
        });
      }
      
      // Update this filter to use the unique cartId when available
      return prevItems.filter(item => 
        !(item.cartId === itemId || item.id === itemId || item._id === itemId)
      );
    });
  };

  // Update item quantity with improved handler
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        (item.cartId === itemId || item.id === itemId || item._id === itemId) 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    toast.info('Cart cleared', {
      icon: '🧹',
      position: 'bottom-right',
      autoClose: 2000
    });
    setIsCartOpen(false);
  };

  // Toggle cart visibility
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartSubtotal,
      cartTax,
      deliveryFee,
      cartTotal,
      isCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};