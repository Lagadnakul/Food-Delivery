import api from './api';
import { TOKEN_KEY, USER_KEY } from '../config';

const AuthService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/user/register', userData);
      if (response.data.success) {
        // Store auth data
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem('token', response.data.token); // For backward compatibility
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/user/login', credentials);
      if (response.data.success) {
        // Store auth data
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Login failed' };
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Call logout endpoint if needed (for HTTP-only cookie clearing)
      await api.post('/user/logout').catch(() => {});
    } finally {
      // Clear local storage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('token');
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('user');
      // Dispatch logout event
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get profile' };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/user/profile', profileData);
      if (response.data.success) {
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update profile' };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token');
    const user = localStorage.getItem(USER_KEY) || localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user from local storage
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem(USER_KEY) || localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // Get current token
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token');
  },

  // Verify token validity
  verifyToken: async () => {
    try {
      const response = await api.get('/user/verify');
      return response.data;
    } catch (error) {
      return { success: false, message: 'Token invalid' };
    }
  },

  // Add address
  addAddress: async (addressData) => {
    try {
      const response = await api.post('/user/addresses', addressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to add address' };
    }
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`/user/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update address' };
    }
  },

  // Delete address
  deleteAddress: async (addressId) => {
    try {
      const response = await api.delete(`/user/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to delete address' };
    }
  },

  // Set default address
  setDefaultAddress: async (addressId) => {
    try {
      const response = await api.put(`/user/addresses/${addressId}/default`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to set default address' };
    }
  }
};

export default AuthService;
