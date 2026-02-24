import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    ChevronRight,
    Filter,
    RefreshCw,
    Search,
    ShoppingBag,
    Tag,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useCart } from '../contexts/CartContext';
import { useMenu } from '../contexts/MenuContext';

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
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Header section */}
        <div className="text-center mb-8 pt-6">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Menu
          </motion.h1>
          <motion.p 
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore our delicious offerings
          </motion.p>
        </div>

        {/* Category section - Centered with improved spacing */}
        <div className="mb-10">
          <motion.div
            className="flex flex-wrap justify-center gap-6 md:gap-8 pb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category}
                className="cursor-pointer group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -8 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
              >
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mx-auto mb-3 border-3 transition-all duration-500 ${activeCategory === category
                    ? 'border-orange-500 ring-4 ring-orange-200 shadow-xl shadow-orange-100'
                    : 'border-gray-200 group-hover:border-orange-400 group-hover:shadow-lg'
                  }`}>
                  <img
                    src={getCategoryImage(category, index)}
                    alt={category}
                    className={`w-full h-full object-cover transition-all duration-500 ${activeCategory === category ? 'scale-110' : 'group-hover:scale-110'}`}
                  />
                </div>
                <p className={`text-center font-semibold text-sm transition-all duration-300 ${activeCategory === category ? 'text-orange-600 transform scale-105' : 'text-gray-700 group-hover:text-orange-500'}`}>
                  {category}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Desktop Category buttons - Centered with better styling */}
        <div className="hidden md:flex flex-wrap gap-3 mb-10 justify-center items-center">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full transition-all duration-300 font-medium text-sm ${activeCategory === category
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200 scale-105'
                  : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 shadow-sm hover:shadow-md border border-gray-100'
                }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>        {/* Search and Filter Bar - Fixed below navbar */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for dishes, ingredients..."
                className="w-full pl-11 pr-10 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 hover:bg-white focus:bg-white"
              />
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleSearchClear}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <X size={18} />
                </motion.button>
              )}
            </div>

            <motion.div
              className="md:w-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
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
                        >                          {category}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>

        {/* Search results info */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center text-gray-600 mb-6"
          >
            <Search size={16} className="mr-2" />
            <span>Search results for: <span className="font-semibold text-orange-600">{searchQuery}</span></span>
            <button
              onClick={handleSearchClear}
              className="ml-3 text-orange-500 hover:text-orange-700 flex items-center transition-colors"
            >
              <X size={16} className="mr-1" /> Clear
            </button>
          </motion.div>
        )}

        {/* Category header when filtering */}
        {activeCategory !== 'All' && (
          <motion.div
            className="my-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center">
              <Tag size={20} className="mr-2 text-orange-500" />
              {activeCategory}
            </h2>
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto mt-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        )}

        {/* Refresh button */}
        <div className="flex justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshMenu}
            className="flex items-center px-5 py-2.5 bg-white rounded-xl shadow-md text-gray-700 hover:shadow-lg transition-all duration-300 border border-gray-100"
            disabled={loading}
          >            <RefreshCw size={18} className={`mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh Menu"}
          </motion.button>
        </div>

        {/* Menu items grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw size={40} className="text-orange-500" />
            </motion.div>
            <p className="text-gray-600 font-medium mt-4">Loading delicious meals...</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item._id || item.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  layout
                >
                  <div className="h-48 overflow-hidden relative">
                    <motion.img
                      src={determineImageSource(item)}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => handleImageError(e, item)}
                    />
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-1.5 px-3 text-sm font-bold rounded-full shadow-lg">
                      ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                    </div>

                    {/* Quick add button overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                      <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addToCart(item)}
                        className="bg-white text-orange-500 rounded-full p-3 shadow-xl hover:bg-orange-500 hover:text-white transition-colors duration-300"
                      >
                        <ShoppingBag size={22} />
                      </motion.button>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">{item.name}</h3>
                      <span className="inline-block px-2.5 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-medium border border-orange-100">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xl text-gray-800">
                        ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                      </span>
                      <motion.button
                        className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-medium hover:from-orange-600 hover:to-orange-700 flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(item)}
                      >
                        <ShoppingBag size={16} />
                        Add
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
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