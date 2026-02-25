import axios from 'axios';
import { useState } from 'react';
import { API_URL, TOKEN_KEY, USER_KEY } from '../../config';
import { showToast } from '../../utils/toastUtils';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence ,motion} from 'framer-motion';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

const LoginPopup = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/user/login' : '/user/register';
      const response = await axios.post(`${API_URL}${endpoint}`, formData);

      if (response.data.success) {
        // Save user data and token to localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        localStorage.setItem(TOKEN_KEY, response.data.token);

        isLogin ? showToast.auth.loginSuccess() : showToast.auth.registerSuccess();

        // Notify parent component about successful login
        if (onLoginSuccess) {
          onLoginSuccess(response.data.user);
        }

        // Force a page reload to ensure all contexts pick up the new auth state
        window.location.reload();

        // Close the popup
        onClose();
      } else {
        showToast.error(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Auth error:', error);
      showToast.error(error.response?.data?.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 rounded-2xl border-none">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-white relative">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center">
              {isLogin ? 'Welcome Back' : 'Join Us'}
            </DialogTitle>
            <DialogDescription className="text-center mt-2 text-orange-100">
              {isLogin
                ? 'Sign in to continue to Hunger Hive'
                : 'Create an account for the full experience'}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body Section */}
        <div className="p-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name field (only for register) */}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name-input"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-2">
                    <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      className="mt-1"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email field */}
            <div>
              <Label htmlFor="email" className="text-gray-700">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                className="mt-1"
                required
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                {isLogin && (
                  <a className="text-sm text-orange-600 hover:text-orange-800 transition-colors" href="#">
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={isLogin ? "Your password" : "Create a password (min. 8 characters)"}
                  minLength={isLogin ? undefined : 8}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-6 mt-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold 
              hover:from-orange-600 hover:to-orange-700 hover:shadow-lg outline-none transition-all shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Switch between login/register */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                className="ml-1.5 text-orange-600 hover:text-orange-800 font-medium transition-colors"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPopup;