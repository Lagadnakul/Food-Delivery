import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { assets, restaurant_list } from '../assets/assets';
import { 
  Search, 
  X, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  ChevronDown, 
  TrendingUp,
  Check
} from 'lucide-react';

const RestaurantsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [filterOpen, setFilterOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  // Get unique categories from restaurants
  const allCategories = ['All', ...new Set(restaurant_list.flatMap(restaurant => restaurant.categories))];
  
  // Filter restaurants based on search query and category
  const filteredRestaurants = restaurant_list.filter(restaurant => {
    const matchesSearch = searchQuery === '' || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.categories.some(category => category.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || 
      restaurant.categories.includes(selectedCategory);
      
    return matchesSearch && matchesCategory;
  });
  
  // Sort restaurants
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'distance') {
      return parseFloat(a.distance) - parseFloat(b.distance);
    } else if (sortBy === 'delivery') {
      const timeA = a.delivery_time.split('-')[0];
      const timeB = b.delivery_time.split('-')[0];
      return parseInt(timeA) - parseInt(timeB);
    }
    // Default: popular (no change to original order)
    return 0;
  });

  // Animation effect once on page load
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header with animated banner */}
        <div className="relative rounded-3xl overflow-hidden mb-12 bg-gradient-to-r from-orange-500 to-orange-600 shadow-xl">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <img 
              src={assets.header_img} 
              alt="Restaurant Banner" 
              className="w-full h-full object-cover opacity-30"
            />
          </div>
          
          <div className="relative py-16 px-8 text-center text-white z-10">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Discover Amazing Restaurants
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-white/90 max-w-2xl mx-auto"
            >
              Find the perfect restaurant for your cravings with our curated selection of top-rated dining options
            </motion.p>
          </div>
        </div>
        
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
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurants or cuisines..."
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            <div className="md:w-auto">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="w-full md:w-auto px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Filter size={18} />
                <span>Filters</span>
                <ChevronDown size={16} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Filters panel */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-100"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {allCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            selectedCategory === category
                              ? 'bg-orange-500 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Sort By</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSortBy('popular')}
                        className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${
                          sortBy === 'popular'
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <TrendingUp size={14} />
                        Popular
                      </button>
                      <button
                        onClick={() => setSortBy('rating')}
                        className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${
                          sortBy === 'rating'
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Star size={14} />
                        Top Rated
                      </button>
                      <button
                        onClick={() => setSortBy('distance')}
                        className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${
                          sortBy === 'distance'
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <MapPin size={14} />
                        Nearest
                      </button>
                      <button
                        onClick={() => setSortBy('delivery')}
                        className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${
                          sortBy === 'delivery'
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Clock size={14} />
                        Fastest Delivery
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Results summary */}
        {loaded && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'Restaurant' : 'Restaurants'} 
              {selectedCategory !== 'All' && <span> in <span className="text-orange-500">{selectedCategory}</span></span>}
            </h2>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-sm text-orange-500 hover:text-orange-700 flex items-center"
              >
                <X size={14} className="mr-1" />
                Clear Filters
              </button>
            )}
          </div>
        )}
        
        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {sortedRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: loaded ? 0 : index * 0.1 }}
                layout
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
              >
                <Link to={`/restaurants/${restaurant.id}`} className="block">
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {e.target.src = assets.res1}}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md flex items-center">
                      <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="font-semibold text-gray-800">{restaurant.rating}</span>
                    </div>
                    {sortBy === 'delivery' && index === 0 && (
                      <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                        <Clock size={12} className="mr-1" />
                        Fastest Delivery
                      </div>
                    )}
                    {selectedCategory !== 'All' && restaurant.categories.includes(selectedCategory) && (
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-orange-600 flex items-center">
                        <Check size={12} className="mr-1" />
                        {selectedCategory}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-500 transition-colors mb-2">{restaurant.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {restaurant.categories.slice(0, 3).map((category, idx) => (
                        <span 
                          key={idx} 
                          className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full text-xs font-medium"
                        >
                          {category}
                        </span>
                      ))}
                      {restaurant.categories.length > 3 && (
                        <span className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">
                          +{restaurant.categories.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center text-gray-500 border-t border-gray-100 pt-4">
                      <div className="flex items-center">
                        <MapPin size={15} className="text-gray-400 mr-1" />
                        <span className="text-sm">{restaurant.distance}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={15} className="text-gray-400 mr-1" />
                        <span className="text-sm">{restaurant.delivery_time}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {/* No Results */}
        {filteredRestaurants.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-6 bg-white rounded-2xl shadow-md max-w-lg mx-auto mt-8"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-orange-50 rounded-full flex items-center justify-center">
              <Search size={40} className="text-orange-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">No Restaurants Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any restaurants matching "{searchQuery}"
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all inline-flex items-center"
            >
              <X size={16} className="mr-2" />
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;