import { toast } from 'sonner';

// Unified toast utility API — backed by Sonner
export const showToast = {
  success: (message) => toast.success(message),

  error: (message) => toast.error(message),

  warning: (message) => toast.warning(message),

  info: (message) => toast.info(message),

  // Cart-specific toasts
  cart: {
    added: (itemName) => toast.success(`${itemName} added to cart!`, {
      icon: '🛒',
    }),

    removed: (itemName) => toast(`${itemName} removed from cart`, {
      icon: '🗑️',
    }),
  },

  // Auth-specific toasts
  auth: {
    loginSuccess: () => toast.success('Welcome back!', { icon: '👋' }),

    registerSuccess: () => toast.success('Account created successfully!', { icon: '✨' }),

    logoutSuccess: () => toast('You have been logged out', { icon: '👋' }),

    needLogin: () => toast.info('Please sign in to continue', { icon: '🔒' }),
  },

  // Order-specific toasts
  order: {
    placed: () => toast.success('Your order has been placed successfully!', { icon: '🍔' }),

    failed: (message = 'Order could not be placed') => toast.error(message, { icon: '😞' }),
  },

  // Flexible custom toast
  custom: (message, icon = '🔔', type = 'default') => {
    switch (type) {
      case 'success': return toast.success(message, { icon });
      case 'error':   return toast.error(message, { icon });
      case 'warning': return toast.warning(message, { icon });
      case 'info':    return toast.info(message, { icon });
      default:        return toast(message, { icon });
    }
  },
};