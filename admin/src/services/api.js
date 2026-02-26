/**
 * API Service for Admin Panel
 * Centralized API configuration with axios instance
 */
import axios from 'axios';

// API base URL from environment variable or default
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - Add auth token if needed
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle common response scenarios
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject({
        success: false,
        message: 'Network error. Please check if the server is running.',
        isNetworkError: true,
      });
    }

    if (error.response.status >= 500) {
      console.error('Server error:', error.response.data);
      return Promise.reject({
        success: false,
        message: 'Server error. Please try again later.',
        status: error.response.status,
      });
    }

    return Promise.reject(error);
  }
);

/**
 * API endpoints
 */
export const endpoints = {
  // Food
  foodList: '/food/list',
  foodAdd: '/food/add',
  foodRemove: '/food/remove',
  
  // Orders
  orders: '/orders',
  ordersList: '/orders/list',
  updateOrderStatus: '/orders/status',
};

export default api;
