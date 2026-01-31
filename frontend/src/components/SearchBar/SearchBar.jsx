import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { assets } from '../../assets/frontend_assets/assets';

const SearchBar = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState({
    location: false,
    search: false
  });

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!location.trim()) {
      // Subtle animation to indicate location is required
      document.getElementById('location-input').classList.add('animate-shake');
      setTimeout(() => {
        document.getElementById('location-input').classList.remove('animate-shake');
      }, 500);
      return;
    }

    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}&location=${encodeURIComponent(location.trim())}`);
    }
  };

  return (
    <motion.div 
      className="sticky top-16 z-40 bg-white shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSearch} className="space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Location Input */}
            <div className="relative flex-1">
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center transition-all duration-200 ${isFocused.location ? 'text-orange-500' : 'text-gray-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <motion.input
                id="location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setIsFocused({ ...isFocused, location: true })}
                onBlur={() => setIsFocused({ ...isFocused, location: false })}
                placeholder="Enter your delivery location"
                className="w-full pl-12 pr-4 py-3.5 text-gray-700 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all shadow-sm hover:shadow-md"
              />
              {location && (
                <button
                  type="button"
                  onClick={() => setLocation('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Search Input */}
            <div className="relative flex-1">
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center transition-all duration-200 ${isFocused.search ? 'text-orange-500' : 'text-gray-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <motion.input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused({ ...isFocused, search: true })}
                onBlur={() => setIsFocused({ ...isFocused, search: false })}
                placeholder="Search for food or restaurants"
                className="w-full pl-12 pr-4 py-3.5 text-gray-700 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all shadow-sm hover:shadow-md"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Search Button */}
            <motion.button 
              type="submit"
              className="flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Find Food
            </motion.button>
          </div>
          
          {/* Quick filters */}
          <motion.div 
            className="hidden md:flex flex-wrap items-center gap-3 pt-3 text-sm pl-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="text-gray-500">Popular:</span>
            {["Pizza", "Burger", "Chinese", "Italian", "Vegan"].map((filter, index) => (
              <motion.button
                key={filter}
                type="button"
                onClick={() => setSearchQuery(filter)}
                className="px-3 py-1 bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-600 rounded-full text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                {filter}
              </motion.button>
            ))}
          </motion.div>
        </form>
      </div>
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </motion.div>
  );
};

export default SearchBar;