/**
 * API Service
 * 
 * Centralized API configuration with axios instance
 */
import axios from 'axios';
import { API_URL, TOKEN_KEY } from '../config';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get auth token from localStorage
 */
const getToken = () => {
  return localStorage.getItem('token') || localStorage.getItem(TOKEN_KEY);
};

/**
 * Request interceptor - Add auth token to requests
 */
api.interceptors.request.use(
  (config) => {
    const token = getToken();
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
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject({
        success: false,
        message: 'Network error. Please check your internet connection.',
        isNetworkError: true,
      });
    }

    // Handle authentication errors
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('user');
    }

    // Handle server errors
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
  // Auth
  login: '/user/login',
  register: '/user/register',
  profile: '/user/profile',
  
  // Addresses
  addresses: '/user/addresses',
  
  // Food
  foodList: '/food/list',
  foodAdd: '/food/add',
  foodRemove: '/food/remove',
  
  // Orders
  orders: '/orders',
  orderHistory: '/orders/history',
  
  // Payment
  createPayment: '/payment/create',
  verifyPayment: '/payment/verify',
};

export default api;
