import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { assets, restaurant_list, food_list } from '../assets/assets';
import { useCart } from '../contexts/CartContext';
import { CURRENCY } from '../config';
import axios from 'axios';
import { API_URL } from '../config';
import { 
  Star, 
  MapPin, 
  Clock, 
  ChevronLeft, 
  ShoppingBag, 
  Tag, 
  ChevronRight, 
  Search,
  Loader,
  Heart,
  Share2,
  Phone,
  AlertCircle
} from 'lucide-react';

const RestaurantDetail = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();
  
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      setLoading(true);
      try {
        // First try to fetch from API
        try {
          const response = await axios.get(`${API_URL}/restaurants/${restaurantId}`);
          if (response.data.success) {
            setRestaurant(response.data.data);
            setMenuItems(response.data.data.menu || []);
          } else {
            throw new Error("API returned no data");
          }
        } catch (apiError) {
          // Fallback to static data if API fails
          console.log("Falling back to static data", apiError);
          const foundRestaurant = restaurant_list.find(r => r.id.toString() === restaurantId);
          
          if (foundRestaurant) {
            setRestaurant(foundRestaurant);
            // For demo purposes, assign random food items to this restaurant
            const restaurantFoods = food_list.filter((food, idx) => 
              idx % restaurant_list.length === (foundRestaurant.id - 1) % restaurant_list.length || 
              Math.random() > 0.7 // Add some random foods to ensure variety
            );
            setMenuItems(restaurantFoods);
          }
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurantDetails();
  }, [restaurantId]);

  // Get unique categories from menu items
  const categories = menuItems.length > 0 
    ? ['All', ...new Set(menuItems.map(item => item.category))]
    : ['All'];
  
  // Filter items based on search and category
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle image errors with fallback
  const handleImageError = (e, item) => {
    const itemId = parseInt(item._id || item.id);
    if (!isNaN(itemId) && itemId >= 1 && itemId <= 32) {
      e.target.src = assets[`food_${itemId}`];
    } else {
      e.target.src = assets.food_1;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex flex-col justify-center items-center">
        <Loader size={40} className="text-orange-500 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading restaurant details...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="w-24 h-24 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Restaurant Not Found</h1>
          <p className="text-gray-600 mb-8">We couldn't find the restaurant you're looking for.</p>
          <Link 
            to="/restaurants" 
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all inline-flex items-center"
          >
            <ChevronLeft size={18} className="mr-2" />
            Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        {/* Back to restaurants button */}
        <Link 
          to="/restaurants"
          className="inline-flex items-center mb-6 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow text-gray-700 font-medium transition-all"
        >
          <ChevronLeft size={18} className="mr-1" />
          All Restaurants
        </Link>
        
        {/* Restaurant Hero Banner */}
        <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden mb-8 shadow-xl">
          <motion.img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
            onError={(e) => {e.target.src = assets.res1}}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
          {/* Floating action buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <motion.button 
              className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart size={18} />
            </motion.button>
            <motion.button 
              className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 size={18} />
            </motion.button>
          </div>
          
          {/* Restaurant info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{restaurant.name}</h1>
            <div className="flex flex-wrap gap-4 items-center mb-3 text-white/90">
              <div className="flex items-center">
                <Star size={16} className="fill-yellow-500 text-yellow-500 mr-1" />
                <span className="font-semibold mr-2">{restaurant.rating}</span>
                <span className="text-sm opacity-75">(200+ reviews)</span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                <span>{restaurant.distance}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{restaurant.delivery_time}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {restaurant.categories?.map((category, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white"
                >
                  {category}
                </span>
              ))}
            </div>
            
            {/* Contact button */}
            <motion.button 
              className="mt-5 inline-flex items-center px-5 py-2.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone size={16} className="mr-2" />
              Contact Restaurant
            </motion.button>
          </div>
        </div>

        {/* Search and Filter Section */}
        {menuItems.length > 0 && (
          <div className="mb-8 bg-white p-5 rounded-2xl shadow-sm">
            <div className="flex flex-col md:flex-row gap-5">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search menu items..."
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Category buttons */}
        {menuItems.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Tag size={18} className="mr-2 text-orange-500" />
                Menu Categories
              </h2>
              {filteredItems.length > 0 && (
                <span className="text-sm text-gray-500">{filteredItems.length} items</span>
              )}
            </div>
            
            <div className="flex overflow-x-auto pb-2 hide-scrollbar">
              <div className="flex gap-2 flex-nowrap">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                      activeCategory === category
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
            </div>
          </div>
        )}

        {/* Menu items grid */}
        {menuItems.length > 0 ? (
          <>
            {filteredItems.length > 0 ? (
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
                      layout
                    >
                      <div className="h-48 overflow-hidden relative group">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => handleImageError(e, item)}
                        />
                        <div className="absolute top-0 right-0 bg-orange-500 text-white py-1 px-3 text-xs font-bold rounded-bl-lg">
                          {CURRENCY}{typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                        </div>
                        
                        {/* Quick add button on hover */}
                        <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center px-2.5 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-medium">
                            {item.category}
                          </span>
                          <motion.button 
                            className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm hover:bg-orange-600 shadow-sm hover:shadow transition-all flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addToCart(item)} 
                          >
                            <ShoppingBag size={14} className="mr-1.5" />
                            Add to Cart
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                className="text-center py-16 bg-white rounded-2xl shadow-sm max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={36} className="text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">No Items Found</h3>
                <p className="text-gray-600 mb-8 px-6">
                  {searchQuery 
                    ? `No items match "${searchQuery}" in ${activeCategory === 'All' ? 'any category' : `the ${activeCategory} category`}.`
                    : `No items available in the ${activeCategory} category.`}
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all inline-flex items-center shadow-md"
                >
                  View All Items
                  <ChevronRight size={18} className="ml-1" />
                </motion.button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div 
            className="text-center py-16 bg-white rounded-2xl shadow-xl max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-orange-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Menu Available</h3>
            <p className="text-gray-600 mb-8 px-6">
              This restaurant's menu is currently not available.
            </p>
            <Link 
              to="/restaurants" 
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all inline-flex items-center"
            >
              <ChevronLeft size={18} className="mr-1.5" />
              View All Restaurants
            </Link>
          </motion.div>
        )}

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
    </div>
  );
};

export default RestaurantDetail;