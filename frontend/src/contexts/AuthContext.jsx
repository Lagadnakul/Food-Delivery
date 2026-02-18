import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AuthService from '../services/authService';
import { showToast } from '../utils/toastUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        const token = AuthService.getToken();

        if (currentUser && token) {
          // Verify token is still valid
          const result = await AuthService.verifyToken();
          if (result.success) {
            setUser(result.user);
            setIsAuthenticated(true);
          } else {
            // Token invalid, clear storage
            await AuthService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for unauthorized events
    const handleUnauthorized = () => {
      setUser(null);
      setIsAuthenticated(false);
      showToast.auth.needLogin();
    };

    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      const result = await AuthService.login(credentials);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        showToast.auth.loginSuccess();
        return { success: true, user: result.user };
      } else {
        showToast.error(result.message || 'Login failed');
        return { success: false, message: result.message };
      }
    } catch (error) {
      const message = error.message || 'Login failed';
      showToast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      const result = await AuthService.register(userData);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        showToast.auth.registerSuccess();
        return { success: true, user: result.user };
      } else {
        showToast.error(result.message || 'Registration failed');
        return { success: false, message: result.message };
      }
    } catch (error) {
      const message = error.message || 'Registration failed';
      showToast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
      showToast.auth.logoutSuccess();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    try {
      const result = await AuthService.updateProfile(profileData);
      
      if (result.success) {
        setUser(result.user);
        showToast.success('Profile updated successfully');
        return { success: true, user: result.user };
      } else {
        showToast.error(result.message || 'Update failed');
        return { success: false, message: result.message };
      }
    } catch (error) {
      const message = error.message || 'Update failed';
      showToast.error(message);
      return { success: false, message };
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const result = await AuthService.getProfile();
      if (result.success) {
        setUser(result.user);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
