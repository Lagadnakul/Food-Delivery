import { createContext, useContext, useEffect, useState } from 'react';
import { CART_KEY, DELIVERY_FEE, TAX_RATE } from '../config';
import { showToast } from '../utils/toastUtils';

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
  // Track login dialog visibility
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // Track pending item (item user tried to add while not logged in)
  const [pendingItem, setPendingItem] = useState(null);

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

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  };

  // Add to cart with auth check
  const addToCart = (item) => {
    if (!isAuthenticated()) {
      showToast.auth.needLogin();
      setPendingItem(item);
      setIsLoginModalOpen(true);
      return;
    }
    
    setCartItems(prevItems => {
      // Check if item already exists in cart by ID
      const existingItemIndex = prevItems.findIndex(
        cartItem => 
          (cartItem.id && item.id && cartItem.id === item.id) || 
          (cartItem._id && item._id && cartItem._id === item._id)
      );
      
      let updatedItems;
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        
      } else {
        // Item doesn't exist, add new item
        updatedItems = [...prevItems, { 
          ...item, 
          quantity: 1,
          cartId: `${item._id || item.id}-${Date.now()}` // Unique ID for cart
        }];
        
      }
      
      return updatedItems;
    });
    
    // Use setTimeout to defer state update
    setTimeout(() => {
      setIsCartOpen(true);
    }, 0);
  };

  // Function to handle successful login
  const handleLoginSuccess = () => {
    // Close the login modal
    setIsLoginModalOpen(false);

    // If there was a pending item, add it now
    if (pendingItem) {
      setTimeout(() => {
        addToCart(pendingItem);
        setPendingItem(null);
      }, 500); // Small delay for better UX
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    if (!isAuthenticated()) {
      showToast.auth.needLogin();
      setIsLoginModalOpen(true);
      return;
    }

    setCartItems(prevItems => {
      // Find the item first to show a notification
      const existingItem = prevItems.find(
        item => item.cartId === itemId || item.id === itemId || item._id === itemId
      );
      
      if (existingItem) {
        showToast.cart.removed(existingItem.name);
      }
      
      return prevItems.filter(item => 
        !(item.cartId === itemId || item.id === itemId || item._id === itemId)
      );
    });
  };

  // Update item quantity with improved handler
  const updateQuantity = (itemId, newQuantity) => {
    if (!isAuthenticated()) {
      showToast.auth.needLogin();
      setIsLoginModalOpen(true);
      return;
    }

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
    if (!isAuthenticated()) {
      showToast.auth.needLogin();
      setIsLoginModalOpen(true);
      return;
    }

    setCartItems([]);
    showToast.info('Cart cleared');
    setIsCartOpen(false);
  };

  // Toggle cart visibility
  const toggleCart = () => {
    if (!isAuthenticated() && !isCartOpen) {
      showToast.auth.needLogin();
      setIsLoginModalOpen(true);
      return;
    }

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
      isLoginModalOpen,
      setIsLoginModalOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      setIsCartOpen,
      handleLoginSuccess
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