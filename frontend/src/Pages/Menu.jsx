import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useMenu } from '../contexts/MenuContext';
import { useCart } from '../contexts/CartContext';
import {
  Search,
  RefreshCw,
  Clock,
  Tag,
  ShoppingBag,
  Filter,
  X,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const Menu = () => {
  const { foodItems, categories, loading, lastFetched, refreshMenu } = useMenu();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const { addToCart } = useCart();

  // Get URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    if (categoryParam && categories.includes(categoryParam)) {
      setActiveCategory(categoryParam);
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams, categories]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (activeCategory !== 'All') {
      params.set('category', activeCategory);
    }

    if (searchQuery) {
      params.set('search', searchQuery);
    }

    setSearchParams(params, { replace: true });
  }, [activeCategory, searchQuery, setSearchParams]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  // Filter items based on search and category
  const filteredItems = foodItems.filter(item => {
    const matchesSearch = searchQuery
      ? (item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Helper function to determine the correct image source
  const determineImageSource = (item) => {
    if (typeof item.image === 'string' && item.image.startsWith('http')) {
      return item.image;
    }

    if (typeof item.image === 'string' && item.image.includes('/')) {
      return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${item.image}`;
    }

    return item.image;
  };

  // Helper function to handle image loading errors
  const handleImageError = (e, item) => {
    const itemId = parseInt(item._id || item.id);

    if (!isNaN(itemId) && itemId >= 1 && itemId <= 32) {
      e.target.src = assets[`food_${itemId}`];
    } else {
      e.target.src = assets.food_1;
    }
  };

  // Helper function to get category images
  const getCategoryImage = (category, index) => {
    // Match category name to appropriate image
    if (category === 'All') return assets.header_img;
    else if (category === 'Salad') return assets.food_1;
    else if (category === 'Rolls') return assets.food_6;
    else if (category === 'Deserts') return assets.food_12;
    else if (category === 'Sandwich') return assets.food_14;
    else if (category === 'Cake') return assets.food_19;
    else if (category === 'Pure Veg') return assets.food_3;
    else if (category === 'Pasta') return assets.food_26;
    else if (category === 'Noodels') return assets.food_30;
    else {
      // Default fallback - use a food image based on index to ensure variety
      const foodIndex = (index % 32) + 1;
      return assets[`food_${foodIndex}`];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-8 sticky top-16 z-30">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for dishes, ingredients..."
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={handleSearchClear}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="md:w-48">
              <button
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className="w-full md:w-auto px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
              >
                <Filter size={18} />
                <span>Filter</span>
              </button>

              {/* Mobile filter dropdown */}
              <AnimatePresence>
                {isFilterMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden absolute left-0 right-0 bg-white mt-2 p-4 rounded-xl shadow-lg z-20 mx-4"
                  >
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setActiveCategory(category);
                            setIsFilterMenuOpen(false);
                          }}
                          className={`px-4 py-2 rounded-full transition-all ${activeCategory === category
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Header section */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Menu
          </motion.h1>

          {searchQuery ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center text-gray-600 mt-2"
            >
              <Search size={16} className="mr-1" />
              Search results for: <span className="font-semibold mx-1">{searchQuery}</span>
              <button
                onClick={handleSearchClear}
                className="ml-2 text-orange-500 hover:text-orange-700 flex items-center"
              >
                <X size={16} className="mr-1" /> Clear
              </button>
            </motion.div>
          ) : (
            <p className="text-gray-600 mt-2">Explore our delicious offerings</p>
          )}

          {/* Last updated info */}
          {lastFetched > 0 && (
            <div className="flex justify-center-safe text-xs text-gray-500 mt-2 ">
              <Clock size={12} className="mr-1" />
              Last updated: {new Date(lastFetched).toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Category section for visual filtering */}
        <div className="mb-12 ">
          <motion.div
            className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category}
                className="flex-none cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
              >
                <div className={`w-24 h-24 rounded-full overflow-hidden mx-auto mb-2 border-2 transition-all ${activeCategory === category
                    ? 'border-orange-500 ring-4 ring-orange-100'
                    : 'border-transparent hover:border-orange-500'
                  }`}>
                  <img
                    src={getCategoryImage(category, index)}
                    alt={category}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-center font-medium text-sm">{category}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Desktop Category buttons */}
        <div className="hidden md:flex flex-wrap gap-2 mb-8 justify-center items-center">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full transition-all justify-center-safe ${activeCategory === category
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Category header when filtering */}
        {activeCategory !== 'All' && (
          <motion.div
            className="my-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center">
              <Tag size={20} className="mr-2 text-orange-500" />
              {activeCategory}
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto mt-2 rounded-full"></div>
          </motion.div>
        )}

        {/* Refresh button */}
        <div className="flex justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshMenu}
            className="flex items-center px-4 py-2 bg-white rounded-lg shadow text-gray-700 hover:shadow-md transition-all"
            disabled={loading}
          >
            <RefreshCw size={18} className={`mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh Menu"}
          </motion.button>
        </div>

        {/* Menu items grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <RefreshCw size={40} className="text-orange-500 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading delicious meals...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item._id || item.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", damping: 20 }}
                  whileHover={{ y: -5 }}
                  layout
                >
                  <div className="h-48 overflow-hidden relative group">
                    <img
                      src={determineImageSource(item)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => handleImageError(e, item)}
                    />
                    <div className="absolute top-0 right-0 bg-orange-500 text-white py-1 px-3 text-xs font-bold rounded-bl-lg">
                      ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                    </div>

                    {/* Quick add button on hover */}
                    <div className="absolute inset-0 backdrop-blur-xs bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addToCart(item)}
                        className="bg-white text-orange-500 rounded-full p-3 shadow-lg"
                      >
                        <ShoppingBag size={20} />
                      </motion.button>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <span className="inline-block px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">
                        ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                      </span>
                      <motion.button
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 flex items-center gap-1 shadow-sm hover:shadow transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(item)}
                      >
                        <ShoppingBag size={16} />
                        Add to Cart
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* No results found */}
        {!loading && filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-xl shadow-sm max-w-lg mx-auto"
          >
            <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-orange-500" />
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">No items found</h3>
            <p className="text-gray-600 px-6">
              {searchQuery
                ? `No items match "${searchQuery}" in ${activeCategory === 'All' ? 'any category' : `the ${activeCategory} category`}.`
                : `No items available in the ${activeCategory} category.`}
            </p>

            {(searchQuery || activeCategory !== 'All') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2 mx-auto"
              >
                View All Items
                <ChevronRight size={16} />
              </motion.button>
            )}
          </motion.div>
        )}
      </div>

      {/* Custom scrollbar styling */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Menu;