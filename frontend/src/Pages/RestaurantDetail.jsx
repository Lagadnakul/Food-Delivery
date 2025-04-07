import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// eslint-disable-next-line
import { motion, AnimatePresence } from 'framer-motion';
import { assets, restaurant_list, food_list } from '../assets/assets';
import { useCart } from '../contexts/CartContext';
import { CURRENCY } from '../config';
import axios from 'axios';
import { API_URL } from '../config';

const RestaurantDetail = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
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
  
  // Filter items based on active category
  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

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
      <div className="min-h-screen pt-24 flex justify-center items-start">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Restaurant Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find the restaurant you're looking for.</p>
          <a 
            href="/" 
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        {/* Restaurant Hero Banner */}
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
            onError={(e) => {e.target.src = assets.res1}}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-orange-500 px-2 py-1 rounded-full text-sm font-semibold">
                ⭐ {restaurant.rating}
              </span>
              <span>{restaurant.distance}</span>
              <span>•</span>
              <span>{restaurant.delivery_time}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {restaurant.categories?.map((category, idx) => (
                <span key={idx} className="bg-white/20 px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Category buttons */}
        {menuItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Menu Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    activeCategory === category
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menu items grid */}
        {menuItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item._id || item.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", damping: 20 }}
                  layout
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => handleImageError(e, item)}
                    />
                    <div className="absolute top-0 right-0 bg-orange-500 text-white py-1 px-3 text-xs font-bold rounded-bl-lg">
                      {CURRENCY}{typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
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
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <img 
              src={assets.not_found || assets.header_img} 
              alt="No menu" 
              className="w-32 h-32 mx-auto opacity-50 mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Menu Available</h3>
            <p className="text-gray-500">
              This restaurant's menu is currently not available.
            </p>
            <a 
              href="/restaurants" 
              className="mt-4 inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              View All Restaurants
            </a>
          </div>
        )}
        
        {filteredItems.length === 0 && menuItems.length > 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <img 
              src={assets.not_found || assets.header_img} 
              alt="No results" 
              className="w-32 h-32 mx-auto opacity-50 mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Items Found</h3>
            <p className="text-gray-500">
              No menu items available in the {activeCategory} category.
            </p>
            {activeCategory !== 'All' && (
              <button 
                onClick={() => setActiveCategory('All')}
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

export default RestaurantDetail;