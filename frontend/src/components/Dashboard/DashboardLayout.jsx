import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  LogOut, 
  Heart, 
  Home, 
  Menu as MenuIcon, 
  X, 
  ChevronRight
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Close sidebar on route change for mobile
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsMobileSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation links configuration
  const navLinks = [
    { title: 'Profile', path: '/dashboard/profile', icon: User },
    { title: 'Orders', path: '/dashboard/orders', icon: ShoppingBag },
    { title: 'Addresses', path: '/dashboard/addresses', icon: MapPin },
    { title: 'Favorites', path: '/dashboard/favorites', icon: Heart }
  ];
  
  // Handle logout securely
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };
  
  // Get page title based on current path
  const getPageTitle = () => {
    const currentLink = navLinks.find(link => link.path === location.pathname);
    return currentLink ? currentLink.title : 'Dashboard';
  };

  // Get user data from localStorage
  const getUserData = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (error) {
      console.error("Error parsing user data:", error);
      return {};
    }
  };

  const user = getUserData();
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left sidebar - fixed on desktop, sliding on mobile */}
      <aside 
        className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-100 shadow-sm z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand/logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <Link to="/" className="text-xl font-bold text-orange-500">
              Hunger Hive
            </Link>
            <button 
              className="p-1.5 rounded-full hover:bg-gray-100 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* User profile summary */}
          {user && user.name && (
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-5">
            <Link 
              to="/"
              className="flex items-center px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-100 mb-3"
            >
              <Home size={18} className="mr-3" />
              Return to Home
            </Link>

            <div className="h-px bg-gray-100 my-3"></div>

            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                
                return (
                  <Link
                    key={link.title}
                    to={link.path}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-orange-50 text-orange-500 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon size={18} className="mr-3" />
                      <span>{link.title}</span>
                    </div>
                    {isActive && <ChevronRight size={16} className="text-orange-500" />}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-5 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top header bar */}
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-100 lg:hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <button 
              className="p-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <MenuIcon size={20} className="text-gray-700" />
            </button>
            <div className="font-medium">{getPageTitle()}</div>
            <Link to="/" className="text-orange-500">
              <Home size={20} />
            </Link>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs - Desktop only */}
            <div className="hidden lg:flex items-center text-sm text-gray-500 mb-6">
              <Link to="/" className="hover:text-orange-500">Home</Link>
              <ChevronRight size={14} className="mx-2" />
              <Link to="/dashboard" className="hover:text-orange-500">Dashboard</Link>
              {location.pathname !== '/dashboard' && (
                <>
                  <ChevronRight size={14} className="mx-2" />
                  <span className="text-gray-800 font-medium">{getPageTitle()}</span>
                </>
              )}
            </div>
            
            {/* Page content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;