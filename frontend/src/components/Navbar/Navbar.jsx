import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion ,AnimatePresence } from 'framer-motion';
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
  Menu,
  X
} from 'lucide-react';
import { Button } from '../ui/button';

// Shadcn Primitives
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

import { Badge } from "../ui/badge";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    
    // Add scroll event listener (passive for performance)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/restaurants', label: 'Restaurants' },
    { path: '/mobile-app', label: 'Mobile App' },
    { path: '/contact', label: 'Contact Us' }
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white shadow-sm py-2' 
            : 'bg-white/80 backdrop-blur-lg py-4 border-b border-transparent'
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
            <div className="hidden md:flex items-center space-x-2 lg:space-x-6">
              {navLinks.map((link) => {
                const isActive = (link.path === '/' && location.pathname === '/') || 
                                 (link.path !== '/' && location.pathname.startsWith(link.path));
                
                return (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`text-sm font-medium transition-colors hover:text-orange-500 relative group px-1 py-2 ${
                      isActive ? 'text-orange-500' : 'text-gray-600'
                    }`}
                  >
                    {link.label}
                    {/* Active/Hover Indicator */}
                    <span 
                      className={`absolute -bottom-1 left-0 w-full h-[2px] bg-orange-500 origin-left transition-transform duration-300 ease-out ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Right-side items: Search, Auth, Cart */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              
              {/* Desktop Search */}
              <div className="hidden md:block relative group">
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="absolute left-3 text-gray-400 group-hover:text-orange-500 transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-10 sm:w-20 lg:w-40 xl:w-60 focus:w-60 xl:focus:w-72 bg-gray-50/50 hover:bg-gray-100/80 focus:bg-white pl-9 pr-4 py-2 text-sm rounded-full border border-gray-200 outline-none transition-all duration-300 focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                  />
                </form>
              </div>

              {/* User Authentication (Shadcn DropdownMenu) */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 rounded-full flex items-center gap-2 pl-2 pr-4 hover:bg-orange-50 hover:text-orange-600">
                      <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-xs">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="text-sm font-medium hidden sm:inline-block truncate max-w-[80px]">
                        {user.name?.split(' ')[0]}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => navigate('/dashboard/profile')} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/dashboard/orders')} className="cursor-pointer">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/dashboard/addresses')} className="cursor-pointer">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>Addresses</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setIsLoginModalOpen(true)}
                  variant="ghost"
                  className="font-medium hover:text-orange-600 hover:bg-orange-50 rounded-full"
                >
                  <User className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              )}
              
              {/* Cart Button with Shadcn Badge */}
              <Button 
                onClick={toggleCart}
                variant="outline"
                size="icon"
                aria-label={`Open cart, ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
                className="relative rounded-full border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors bg-white/50"
              >
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge className="h-5 min-w-[20px] px-1.5 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-[10px] rounded-full shadow-sm">
                        {cartCount}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              {/* Mobile Menu (Shadcn Sheet) */}
              <div className="md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle navigation</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-0 bg-white/95 backdrop-blur-xl">
                    <SheetHeader className="text-left pb-6 border-b border-gray-100">
                      <SheetTitle>
                        <img src={assets.HH_logo} alt="Hunger Hive" className="h-8 w-auto" />
                      </SheetTitle>
                      <SheetDescription className="sr-only">
                        Mobile navigation menu for Hunger Hive
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="py-6 space-y-6">
                      {/* Mobile Search */}
                      <form onSubmit={handleSearch} className="mb-8">
                        <div className="relative">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for food..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-medium text-sm"
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                      </form>

                      {/* Mobile Links */}
                      <div className="space-y-2">
                        {navLinks.map((link) => {
                          const isActive = (link.path === '/' && location.pathname === '/') || 
                                           (link.path !== '/' && location.pathname.startsWith(link.path));
                          return (
                            <Link
                              key={link.path}
                              to={link.path}
                              className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                                isActive 
                                  ? 'bg-orange-50 text-orange-600' 
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {link.label}
                            </Link>
                          );
                        })}
                      </div>

                      {/* Mobile Auth/Dashboard Links */}
                      <div className="pt-6 border-t border-gray-100">
                        {user ? (
                          <div className="space-y-2">
                            <div className="px-4 py-2 mb-2">
                              <p className="font-semibold text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <Link
                              to="/dashboard/profile"
                              className="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <User className="h-5 w-5 mr-3 text-gray-400" />
                              My Profile
                            </Link>
                            <Link
                              to="/dashboard/orders"
                              className="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <ShoppingBag className="h-5 w-5 mr-3 text-gray-400" />
                              My Orders
                            </Link>
                            <button 
                              onClick={() => {
                                handleLogout();
                                setMobileMenuOpen(false);
                              }}
                              className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors mt-2"
                            >
                              <LogOut className="h-5 w-5 mr-3" />
                              Sign Out
                            </button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => {
                              setIsLoginModalOpen(true);
                              setMobileMenuOpen(false);
                            }}
                            className="w-full h-12 bg-gray-900 hover:bg-black text-white rounded-xl"
                          >
                            Sign In to Account
                          </Button>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* Spacing to prevent content from hiding under the fixed navbar */}
      <div className="h-20" />

      {/* Login Popup */}
      <LoginPopup 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </>
  );
};

export default Navbar;