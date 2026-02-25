/**
 * Authentication Context
 * 
 * Manages user authentication state, login, logout, and registration
 */
import axios from 'axios';
import { createContext, useCallback, useContext, useEffect, useState, useMemo } from 'react';
import { API_URL, TOKEN_KEY, USER_KEY } from '../config';
import { showToast } from '../utils/toastUtils';

// Create the context
const AuthContext = createContext(null);

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Save auth data to localStorage
   */
  const saveAuthData = useCallback((authToken, userData) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }, []);

  /**
   * Clear auth data from localStorage
   */
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('user');
    localStorage.removeItem(USER_KEY);
  }, []);

  /**
   * Initialize auth state from localStorage
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token') || localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem('user') || localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('user');
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/user/login`, {
        email,
        password
      });

      if (response.data.success) {
        const { token: authToken, user: userData } = response.data;
        
        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);
        saveAuthData(authToken, userData);
        
        showToast.success(`Welcome back, ${userData.name}!`);
        return { success: true, user: userData };
      } else {
        showToast.error(response.data.message || 'Login failed');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      showToast.error(message);
      return { success: false, message };
    }
  }, [saveAuthData]);

  /**
   * Register user
   */
  const register = useCallback(async (name, email, password, phone = '') => {
    try {
      const response = await axios.post(`${API_URL}/user/register`, {
        name,
        email,
        password,
        phone
      });

      if (response.data.success) {
        const { token: authToken, user: userData } = response.data;
        
        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);
        saveAuthData(authToken, userData);
        
        showToast.success(`Welcome to Hunger Hive, ${userData.name}!`);
        return { success: true, user: userData };
      } else {
        showToast.error(response.data.message || 'Registration failed');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      showToast.error(message);
      return { success: false, message };
    }
  }, [saveAuthData]);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    clearAuthData();
    showToast.success('Logged out successfully');
  }, [clearAuthData]);

  /**
   * Get user profile
   */
  const getProfile = useCallback(async () => {
    if (!token) return null;

    try {
      const response = await axios.get(`${API_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUser(response.data.user);
        saveAuthData(token, response.data.user);
        return response.data.user;
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        logout();
      }
      return null;
    }
  }, [token, saveAuthData, logout]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (profileData) => {
    if (!token) return { success: false, message: 'Not authenticated' };

    try {
      const response = await axios.put(`${API_URL}/user/profile`, profileData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUser(response.data.user);
        saveAuthData(token, response.data.user);
        showToast.success('Profile updated successfully');
        return { success: true, user: response.data.user };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      showToast.error(message);
      return { success: false, message };
    }
  }, [token, saveAuthData]);

  /**
   * Get axios config with auth headers
   */
  const getAuthHeaders = useCallback(() => {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
  }, [token]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    getProfile,
    updateProfile,
    getAuthHeaders
  }), [
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    getProfile,
    updateProfile,
    getAuthHeaders
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


