import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { assets, restaurant_list, food_list } from '../assets/assets';
import { useCart } from '../contexts/CartContext';
import { CURRENCY } from '../config';
import axios from 'axios';
import { API_URL } from '../config';

const RestaurantsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter restaurants based on search query
  const filteredRestaurants = restaurant_list.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.categories.some(category => 
      category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Our Restaurants</h1>
          <p className="text-gray-600 mt-2">
            Discover amazing restaurants with delicious food options
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <img src={assets.search_icon} alt="" className="h-5 w-5" />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map(restaurant => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg"
            >
              <Link to={`/restaurants/${restaurant.id}`} className="block">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    onError={(e) => {e.target.src = assets.res1}}
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                    <span className="text-sm font-semibold text-orange-500">⭐ {restaurant.rating}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {restaurant.categories.map((category, idx) => (
                      <span 
                        key={idx} 
                        className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-gray-500">
                    <span className="text-sm">{restaurant.distance}</span>
                    <span className="text-sm">{restaurant.delivery_time}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* No Results */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Restaurants Found</h3>
            <p className="text-gray-500">
              We couldn't find any restaurants matching "{searchQuery}".
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;