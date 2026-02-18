import axios from 'axios';
import { TOKEN_KEY } from '../config';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for HTTP-only token support
});

// Request interceptor - add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle different error scenarios
    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - token expired or invalid
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Optionally redirect to login or trigger auth modal
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          console.error('API Error:', response.data?.message || 'Unknown error');
      }
    } else if (error.request) {
      // Network error
      console.error('Network error - no response received');
      window.dispatchEvent(new CustomEvent('api:network-error'));
    }
    
    return Promise.reject(error);
  }
);

export default api;
