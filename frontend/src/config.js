// API base URL for backend connections
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Currency and financial settings
export const CURRENCY = '₹';
export const CURRENCY_CODE = 'INR';
export const DELIVERY_FEE = 40; // Updated to INR
export const TAX_RATE = 0.05; // 5% GST

// Polling interval for fetching menu data (in milliseconds)
export const DEFAULT_FETCH_INTERVAL = 60000; // 60 seconds
export const ORDER_POLL_INTERVAL = 30000; // 30 seconds for order tracking

// Storage keys
export const CART_KEY = 'hunger_hive_cart';
export const TOKEN_KEY = 'hunger_hive_auth_token';
export const USER_KEY = 'hunger_hive_user';
export const LOCATION_KEY = 'hunger_hive_location';

// Cart settings
export const MAX_CART_ITEMS = 99;
export const MAX_ITEM_QUANTITY = 10;

// Image placeholder fallbacks
export const DEFAULT_FOOD_IMAGE = 'https://via.placeholder.com/300x200?text=Food+Image';
export const DEFAULT_AVATAR = 'https://via.placeholder.com/40x40?text=User';

// Animation durations (in milliseconds)
export const PAGE_TRANSITION_DURATION = 300;
export const MODAL_ANIMATION_DURATION = 200;

// Feature flags
export const ENABLE_LOCATION_SERVICES = import.meta.env.VITE_ENABLE_MAPS !== 'false';
export const ENABLE_PUSH_NOTIFICATIONS = false;
export const ENABLE_ONLINE_PAYMENT = import.meta.env.VITE_ENABLE_PAYMENT !== 'false';

// Delivery settings
export const MAX_DELIVERY_DISTANCE_KM = 15;
export const AVERAGE_DELIVERY_SPEED_KMH = 25;
export const BASE_PREPARATION_TIME_MINS = 15;

// Restaurant location (fallback)
export const RESTAURANT_LOCATION = {
  lat: parseFloat(import.meta.env.VITE_RESTAURANT_LAT) || 19.0760,
  lng: parseFloat(import.meta.env.VITE_RESTAURANT_LNG) || 72.8777,
  name: 'Hunger Hive Kitchen',
  address: 'Mumbai, Maharashtra'
};

// Razorpay configuration
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

// Order status labels
export const ORDER_STATUS_LABELS = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  payment_failed: 'Payment Failed',
};
