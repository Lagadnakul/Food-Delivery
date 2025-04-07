import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion,AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useMenu } from '../contexts/MenuContext';
import { useCart } from '../contexts/CartContext';
const Menu = () => {
  const { foodItems, categories, loading, lastFetched, refreshMenu } = useMenu();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
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
      // Use an imported constant instead of process.env
      return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${item.image}`;
      // If you're using Create React App instead of Vite, use:
      // return `${window.API_URL || 'http://localhost:5000'}/${item.image}`;
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

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        {/* Header section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Our Menu</h1>
          {searchQuery ? (
            <p className="text-gray-600 mt-2">
              Search results for: <span className="font-semibold">{searchQuery}</span>
              <button 
                onClick={() => setSearchQuery('')}
                className="ml-2 text-orange-500 hover:text-orange-700"
              >
                (Clear)
              </button>
            </p>
          ) : (
            <p className="text-gray-600 mt-2">Explore our delicious offerings</p>
          )}
        </div>

        {/* Category section for visual filtering */}
        {!searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-center mb-6">Categories</h2>
            <div className="flex overflow-x-auto pb-4 gap-4 justify-center">
            {categories.map((category, index) => {
  // Get appropriate image for this category
  let categoryImage;
  
  // Match category name to appropriate image
  if (category === 'All') {
    categoryImage = assets.header_img;
  } else if (category === 'Salad') {
    categoryImage = assets.food_1; 
  } else if (category === 'Rolls') {
    categoryImage = assets.food_6;
  } else if (category === 'Deserts') {
    categoryImage = assets.food_12;
  } else if (category === 'Sandwich') {
    categoryImage = assets.food_14;
  } else if (category === 'Cake') {
    categoryImage = assets.food_19;
  } else if (category === 'Pure Veg') {
    categoryImage = assets.food_3;
  } else if (category === 'Pasta') {
    categoryImage = assets.food_26;
  } else if (category === 'Noodels') {
    categoryImage = assets.food_30;
  }
  else {
    // Default fallback - use a food image based on index to ensure variety
    const foodIndex = (index % 32) + 1;
    categoryImage = assets[`food_${foodIndex}`];
  }
  
  return (
    <motion.div
      key={index}
      className="flex-none cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setActiveCategory(category)}
    >
      <div className={`w-28 h-28 rounded-full overflow-hidden mx-auto mb-2 border-2 transition-all ${activeCategory === category ? 'border-orange-500' : 'border-transparent hover:border-orange-500'}`}>
        <img 
          src={categoryImage} 
          alt={category}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-center font-medium">{category}</p>
    </motion.div>
  );
})}
            </div>
          </div>
        )}

        {/* Refresh button */}
        <div className="flex justify-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshMenu}
            className="flex items-center px-4 py-2 bg-white rounded-lg shadow text-gray-700 hover:shadow-md"
            disabled={loading}
          >
            <svg 
              className={`w-5 h-5 mr-2 ${loading ? "animate-spin" : ""}`} 
              fill="none" 
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? "Refreshing..." : "Refresh Menu"}
          </motion.button>
          
          {lastFetched > 0 && (
            <div className="ml-4 text-sm text-gray-500 self-center">
              Last updated: {new Date(lastFetched).toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Category buttons */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full transition-all ${
                activeCategory === category
                  ? 'bg-orange-500 text-white'
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
          <div className="my-6 text-center">   
            <h2 className="text-2xl font-bold text-gray-800">{activeCategory}</h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto mt-2"></div>
          </div>
        )}

        {/* Menu items grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item._id || item.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", damping: 20 }}
                  whileHover={{ y: -5 }}
                  layout
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={determineImageSource(item)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => handleImageError(e, item)}
                    />
                    <div className="absolute top-0 right-0 bg-orange-500 text-white py-1 px-3 text-xs font-bold rounded-bl-lg">
                      ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                        {item.category}
                      </span>
                      <motion.button 
                        className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(item)} 
                      >
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
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <img 
              src={assets.not_found || assets.header_img} 
              alt="No results" 
              className="w-32 h-32 mx-auto opacity-50 mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? `No items match "${searchQuery}" in ${activeCategory === 'All' ? 'any category' : `the ${activeCategory} category`}.`
                : `No items available in the ${activeCategory} category.`}
            </p>
            {(searchQuery || activeCategory !== 'All') && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                View All Items
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;