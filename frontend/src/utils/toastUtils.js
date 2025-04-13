import { toast } from 'react-toastify';
import '../styles/toast.css';

// Toast configuration with emojis for better user experience
export const showToast = {
  success: (message) => {
    return toast.success(message, {
      icon: "🎉",
      style: {
        borderLeft: '5px solid #10b981',
      }
    });
  },
  
  error: (message) => {
    return toast.error(message, {
      icon: "❌",
      style: {
        borderLeft: '5px solid #ef4444',
      }
    });
  },
  
  warning: (message) => {
    return toast.warning(message, {
      icon: "⚠️",
      style: {
        borderLeft: '5px solid #f59e0b',
      }
    });
  },
  
  info: (message) => {
    return toast.info(message, {
      icon: "ℹ️",
      style: {
        borderLeft: '5px solid #3b82f6',
      }
    });
  },
  
  // Special toast types for better user engagement
  cart: {
    added: (itemName) => {
      return toast.success(`${itemName} added to cart!`, {
        icon: "🛒",
        style: {
          borderLeft: '5px solid #10b981',
        }
      });
    },
    
    removed: (itemName) => {
      return toast.info(`${itemName} removed from cart`, {
        icon: "🗑️",
        style: {
          borderLeft: '5px solid #3b82f6',
        }
      });
    }
  },
  
  auth: {
    loginSuccess: () => {
      return toast.success('Welcome back!', {
        icon: "👋",
        style: {
          borderLeft: '5px solid #10b981',
        }
      });
    },
    
    registerSuccess: () => {
      return toast.success('Account created successfully!', {
        icon: "✨",
        style: {
          borderLeft: '5px solid #10b981',
        }
      });
    },
    
    logoutSuccess: () => {
      return toast.info('You have been logged out', {
        icon: "👋",
        style: {
          borderLeft: '5px solid #3b82f6',
        }
      });
    },
    
    needLogin: () => {
      return toast.info('Please sign in to continue', {
        icon: "🔒",
        style: {
          borderLeft: '5px solid #3b82f6',
        }
      });
    }
  },
  
  order: {
    placed: () => {
      return toast.success('Your order has been placed successfully!', {
        icon: "🍔",
        style: {
          borderLeft: '5px solid #10b981',
        }
      });
    },
    
    failed: (message = 'Order could not be placed') => {
      return toast.error(message, {
        icon: "😞",
        style: {
          borderLeft: '5px solid #ef4444',
        }
      });
    }
  },
  
  // Customizable toast
  custom: (message, icon = "🔔", type = "default") => {
    const toastConfig = {
      icon: icon,
    };
    
    switch(type) {
      case 'success':
        return toast.success(message, toastConfig);
      case 'error':
        return toast.error(message, toastConfig);
      case 'warning':
        return toast.warning(message, toastConfig);
      case 'info':
        return toast.info(message, toastConfig);
      default:
        return toast(message, toastConfig);
    }
  }
};