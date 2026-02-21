/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls
 */
import api, { endpoints } from './api';

const AuthService = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - { success, user, token, message }
   */
  login: async (email, password) => {
    try {
      const response = await api.post(endpoints.login, { email, password });
      return response.data;
    } catch (error) {
      if (error.isNetworkError) {
        return { success: false, message: error.message };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  },

  /**
   * Register new user
   * @param {Object} userData - { name, email, password, phone }
   * @returns {Promise<Object>} - { success, user, token, message }
   */
  register: async (userData) => {
    try {
      const response = await api.post(endpoints.register, userData);
      return response.data;
    } catch (error) {
      if (error.isNetworkError) {
        return { success: false, message: error.message };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  },

  /**
   * Get user profile
   * @returns {Promise<Object>} - User profile data
   */
  getProfile: async () => {
    try {
      const response = await api.get(endpoints.profile);
      return response.data;
    } catch (error) {
      if (error.isNetworkError) {
        return { success: false, message: error.message };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile.',
      };
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} - Updated user data
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put(endpoints.profile, profileData);
      return response.data;
    } catch (error) {
      if (error.isNetworkError) {
        return { success: false, message: error.message };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile.',
      };
    }
  },

  /**
   * Add new address
   * @param {Object} addressData - Address data
   * @returns {Promise<Object>} - Result with updated addresses
   */
  addAddress: async (addressData) => {
    try {
      const response = await api.post(endpoints.addresses, addressData);
      return response.data;
    } catch (error) {
      if (error.isNetworkError) {
        return { success: false, message: error.message };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add address.',
      };
    }
  },

  /**
   * Update address
   * @param {string} addressId - Address ID
   * @param {Object} addressData - Updated address data
   * @returns {Promise<Object>} - Result with updated addresses
   */
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`${endpoints.addresses}/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      if (error.isNetworkError) {
        return { success: false, message: error.message };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update address.',
      };
    }
  },

  /**
   * Delete address
   * @param {string} addressId - Address ID
   * @returns {Promise<Object>} - Result with updated addresses
   */
  deleteAddress: async (addressId) => {
    try {
      const response = await api.delete(`${endpoints.addresses}/${addressId}`);
      return response.data;
    } catch (error) {
      if (error.isNetworkError) {
        return { success: false, message: error.message };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete address.',
      };
    }
  },

  /**
   * Set default address
   * @param {string} addressId - Address ID
   * @returns {Promise<Object>} - Result with updated addresses
   */
  setDefaultAddress: async (addressId) => {
    try {
      const response = await api.put(`${endpoints.addresses}/${addressId}/default`);
      return response.data;
    } catch (error) {
      if (error.isNetworkError) {
        return { success: false, message: error.message };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to set default address.',
      };
    }
  },
};

export default AuthService;
