// API base URL for backend connections
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Polling interval for fetching menu data (in milliseconds)
export const DEFAULT_FETCH_INTERVAL = 60000; // 60 seconds

// App configuration
export const APP_NAME = 'Hunger Hive';
export const CURRENCY = '$';
export const TAX_RATE = 0.1; // 10%
export const DELIVERY_FEE = 2.99;
export const FREE_DELIVERY_THRESHOLD = 30;

// Image placeholder fallbacks
export const DEFAULT_FOOD_IMAGE = 'https://via.placeholder.com/300x200?text=Food+Image';
export const DEFAULT_AVATAR = 'https://via.placeholder.com/40x40?text=User';

// Authentication
export const TOKEN_KEY = 'hunger_hive_auth_token';
export const USER_KEY = 'hunger_hive_user';

// Cart settings
export const CART_KEY = 'hunger_hive_cart';
export const MAX_CART_ITEMS = 99;


// Animation durations (in milliseconds)
export const PAGE_TRANSITION_DURATION = 300;
export const MODAL_ANIMATION_DURATION = 200;

// Feature flags
export const ENABLE_LOCATION_SERVICES = true;
export const ENABLE_PUSH_NOTIFICATIONS = false;
export const ENABLE_ONLINE_PAYMENT = true;

