import React, { useState } from 'react';
import { Heart } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const FavoritesPage = () => {
  const [favorites] = useState([]);

  return (
    <div>
      <div className="border-b border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-800">My Favorites</h1>
        <p className="text-gray-600 mt-1">Items you've marked as favorites</p>
      </div>
      
      <div className="p-6">
        {favorites.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 p-10 rounded-xl text-center"
          >
            <Heart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Favorites Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't added any items to your favorites yet.
              Browse our menu and click the heart icon to save your favorites!
            </p>
            <button
              onClick={() => window.location.href = '/menu'}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 inline-flex items-center"
            >
              Browse Menu
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;