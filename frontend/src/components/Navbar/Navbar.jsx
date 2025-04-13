import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { assets } from '../../assets/assets';
import LoginPopup from '../LoginPopup/LoginPopup';
import { useCart } from '../../contexts/CartContext';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Settings,
  LogOut,
  ChevronDown,
  Heart
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { cartCount, toggleCart } = useCart();

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
    
    // Add scroll event listener
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and dropdown when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      if (mobileMenuOpen) setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setUserDropdownOpen(false);
  };

  const renderUserDropdown = () => {
    if (user) {
      return (
        <div className="relative group">
          <button className="flex items-center space-x-1 focus:outline-none">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-medium">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <ChevronDown size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
          </button>
          
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
            
            <Link to="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
              Profile
            </Link>
            
            <Link to="/dashboard/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
              My Orders
            </Link>
            
            <Link to="/dashboard/addresses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
              My Addresses
            </Link>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button 
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <button
        onClick={() => setIsLoginModalOpen(true)}
        className="flex items-center text-gray-700 hover:text-orange-500 transition-colors"
      >
        <User size={20} />
        <span className="ml-1 font-medium hidden md:inline">Sign In</span>
      </button>
    );
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/restaurants', label: 'Restaurants' },
    { path: '/mobile-app', label: 'Mobile App' },
    { path: '/contact', label: 'Contact Us' }
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-white/95 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center">
              <motion.img 
                src={assets.HH_logo} 
                alt="Hunger Hive" 
                className="h-10 w-auto" 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              />
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: navLinks.indexOf(link) * 0.1 }}
              >
                <Link 
                  to={link.path} 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative group ${
                    (link.path === '/' && location.pathname === '/') || 
                    (link.path !== '/' && location.pathname.startsWith(link.path)) 
                      ? 'text-orange-500' 
                      : 'text-gray-700 hover:text-orange-500'
                  }`}
                >
                  {link.label}
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 transform origin-left transition-transform duration-300 ${
                      (link.path === '/' && location.pathname === '/') || 
                      (link.path !== '/' && location.pathname.startsWith(link.path))
                        ? 'scale-x-100' 
                        : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  ></span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right-side items: Search, Auth, Cart */}
          <div className="flex items-center space-x-3 md:space-x-6">
            {/* Desktop Search Button that expands to input */}
            <div className="hidden md:flex items-center">
              <motion.div
                initial={{ width: 40 }}
                whileHover={{ width: 200 }}
                className="relative overflow-hidden"
              >
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-full border border-gray-200 
                              focus:outline-none focus:border-orange-500 focus:ring-2 
                              focus:ring-orange-200 transition-shadow"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </form>
              </motion.div>
            </div>

            {/* User Authentication */}
            {renderUserDropdown()}
            
            {/* Cart Button */}
            <motion.button 
              onClick={toggleCart}
              className="relative p-2 rounded-full hover:bg-orange-50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Cart"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center 
                            bg-orange-500 text-white text-xs font-bold rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Mobile menu button */}
            <motion.button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 focus:outline-none"
              aria-label="Menu"
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-4 space-y-2 bg-white border-t border-gray-200 mt-2 rounded-b-xl shadow-md">
                {navLinks.map((link) => (
                  <motion.div
                    key={link.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: navLinks.indexOf(link) * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      className={`block px-4 py-2 rounded-lg transition-colors ${
                        (link.path === '/' && location.pathname === '/') || 
                        (link.path !== '/' && location.pathname.startsWith(link.path))
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-orange-500'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile user options */}
                {user ? (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: navLinks.length * 0.05 }}
                  >
                    <div className="flex items-center px-4 py-2 mt-2 border-t border-gray-100">
                      <div className="flex flex-col w-full gap-2">
                        <Link
                          to="/dashboard/profile"
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500 rounded-lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User size={16} className="mr-2" />
                          My Profile
                        </Link>
                        <Link
                          to="/dashboard/orders"
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500 rounded-lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <ShoppingBag size={16} className="mr-2" />
                          My Orders
                        </Link>
                        <Link
                          to="/dashboard/addresses"
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500 rounded-lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <MapPin size={16} className="mr-2" />
                          My Addresses
                        </Link>
                        <button 
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <LogOut size={16} className="mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: navLinks.length * 0.05 }}
                  >
                    <button
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full mt-2 px-4 py-2.5 text-center bg-gradient-to-r from-orange-500 to-orange-600 
                              text-white rounded-lg font-medium shadow-sm hover:from-orange-600 hover:to-orange-700"
                    >
                      Sign In
                    </button>
                  </motion.div>
                )}

                {/* Mobile Search */}
                <motion.form
                  onSubmit={handleSearch}
                  className="mt-3 px-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: (navLinks.length + 1) * 0.05 }}
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for food..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50
                              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </motion.form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Login Popup */}
      <LoginPopup 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </nav>
  );
};

export default Navbar;