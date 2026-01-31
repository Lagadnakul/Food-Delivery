import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  Settings,
  LogOut
} from 'lucide-react';

const Dashboard = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const navItems = [
    { 
      path: '/dashboard/profile', 
      name: 'My Profile', 
      icon: <User size={18} /> 
    },
    { 
      path: '/dashboard/orders', 
      name: 'My Orders', 
      icon: <ShoppingBag size={18} /> 
    },
    { 
      path: '/dashboard/addresses', 
      name: 'My Addresses', 
      icon: <MapPin size={18} /> 
    },
    { 
      path: '/dashboard/favorites', 
      name: 'Favorites', 
      icon: <Heart size={18} /> 
    },
    { 
      path: '/dashboard/settings', 
      name: 'Account Settings', 
      icon: <Settings size={18} /> 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4 w-full">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">My Account</h2>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                          currentPath === item.path
                            ? 'bg-orange-50 text-orange-600'
                            : 'hover:bg-gray-50 text-gray-700 hover:text-orange-500'
                        }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                  
                  <li className="pt-4 mt-4 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} className="mr-3" />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <Outlet />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;