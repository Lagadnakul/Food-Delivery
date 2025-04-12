import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';
import LoginPopup from '../LoginPopup/LoginPopup';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Check for user on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem('user');
      }
    }
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // Any additional actions after login
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-4'
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/">
            <motion.img 
              src={assets.HH_logo} 
              alt="Hunger Hive" 
              className="h-10 md:h-12" 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />
          </Link>
        </div>
        
        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`text-gray-700 hover:text-orange-500 font-medium transition-colors ${location.pathname === '/' ? 'text-orange-500' : ''}`}>Home</Link>
          <Link to="/menu" className={`text-gray-700 hover:text-orange-500 font-medium transition-colors ${location.pathname === '/menu' ? 'text-orange-500' : ''}`}>Menu</Link>
          <Link to="/restaurants" className={`text-gray-700 hover:text-orange-500 font-medium transition-colors ${location.pathname.includes('/restaurants') ? 'text-orange-500' : ''}`}>Restaurants</Link>
          <Link to="/contact" className={`text-gray-700 hover:text-orange-500 font-medium transition-colors ${location.pathname === '/contact' ? 'text-orange-500' : ''}`}>Contact</Link>
        </nav>
        
        {/* User Controls */}
        <div className="flex items-center space-x-5">
          {/* Search */}
          <button className="hidden md:flex text-gray-600 hover:text-orange-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {/* Authentication */}
          {user ? (
            <div className="flex items-center">
              <motion.div 
                className="hidden md:flex items-center rounded-full bg-gray-100 pr-2 pl-1 py-1"
                whileHover={{ scale: 1.03 }}
              >
                <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold mr-2">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                <motion.button 
                  onClick={handleLogout}
                  className="ml-3 text-gray-500 hover:text-orange-500"
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </motion.button>
              </motion.div>
              
              {/* Mobile User Icon */}
              <button className="md:hidden flex items-center justify-center w-9 h-9 bg-orange-100 rounded-full text-orange-600 font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </button>
            </div>
          ) : (
            <motion.button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-sm font-medium hover:shadow-md transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          )}
          
          {/* Cart Button */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link to="/cart" className="flex items-center justify-center w-9 h-9 bg-orange-100 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </Link>
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full">3</span>
          </motion.div>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-orange-500 transition-colors"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link 
                to="/" 
                className="block px-4 py-2 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-500 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/menu" 
                className="block px-4 py-2 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-500 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Menu
              </Link>
              <Link 
                to="/restaurants" 
                className="block px-4 py-2 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-500 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Restaurants
              </Link>
              <Link 
                to="/contact" 
                className="block px-4 py-2 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-500 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              {user && (
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-500 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Login Popup */}
      <LoginPopup 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </header>
  );
};

export default Header;