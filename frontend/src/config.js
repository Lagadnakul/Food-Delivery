// API base URL for backend connections
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  // If we are in the browser, intelligently route to the correct hostname
  if (typeof window !== 'undefined') {
    // If running on a local network IP (e.g. phone or another computer) and not hitting a prod domain
    if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('vercel.app') && !window.location.hostname.includes('render.com')) {
      return `http://${window.location.hostname}:4000`;
    }
  }
  return envUrl || 'http://localhost:4000';
};
export const API_URL = getApiUrl();

// Currency and financial settings
export const CURRENCY = '₹';
export const DELIVERY_FEE = 2.99;
export const TAX_RATE = 0.10; // 10% tax

// Polling interval for fetching menu data (in milliseconds)
export const DEFAULT_FETCH_INTERVAL = 60000; // 60 seconds

// Storage keys
export const CART_KEY = 'hunger_hive_cart';
export const TOKEN_KEY = 'hunger_hive_auth_token';
export const USER_KEY = 'hunger_hive_user';

// Cart settings
export const MAX_CART_ITEMS = 99;

// Image placeholder fallbacks
export const DEFAULT_FOOD_IMAGE = 'https://via.placeholder.com/300x200?text=Food+Image';
export const DEFAULT_AVATAR = 'https://via.placeholder.com/40x40?text=User';

// Animation durations (in milliseconds)
export const PAGE_TRANSITION_DURATION = 300;
export const MODAL_ANIMATION_DURATION = 200;

// Feature flags
export const ENABLE_LOCATION_SERVICES = true;
export const ENABLE_PUSH_NOTIFICATIONS = false;
export const ENABLE_ONLINE_PAYMENT = true;
