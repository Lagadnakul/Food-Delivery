import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

// Restaurant data
const restaurants = [
  {
    id: 1,
    name: "The Grand Kitchen",
    image: assets.res1,
    rating: "4.8",
    cuisine: "Multi Cuisine Restaurant",
    location: "Downtown LA",
    deliveryTime: "30-40 min"
  },
    {
      id: 2,
      name: "Spice Garden",
      image: assets.res2,
      rating: "4.6",
      cuisine: "Indian Restaurant",
      location: "Beverly Hills",
      deliveryTime: "25-35 min"
    },
    {
      id: 3,
      name: "Ocean Delights",
      image: assets.res3,
      rating: "4.7",
      cuisine: "Seafood Restaurant",
      location: "Marina Beach",
      deliveryTime: "35-45 min"
    },
    {
      id: 4,
      name: "Italian Corner",
      image: assets.res4,
      rating: "4.5",
      cuisine: "Italian Restaurant",
      location: "West Hollywood",
      deliveryTime: "20-30 min"
    },
    {
      id: 5,
      name: "Asian Fusion",
      image: assets.res5,
      rating: "4.9",
      cuisine: "Pan Asian Restaurant",
      location: "Chinatown",
      deliveryTime: "25-35 min"
    },
    {
      id: 6,
      name: "Mediterranean Treats",
      image: assets.res6,
      rating: "4.7",
      cuisine: "Mediterranean Restaurant",
      location: "Santa Monica",
      deliveryTime: "30-40 min"
    }
  ];

  const PopularRestaurants = () => {
    return (
      <section className="section-spacing">
        <h2 className="text-3xl font-bold text-center mb-12">
          Popular <span className="text-orange-500">Restaurants</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map(restaurant => (
            <motion.div
              key={restaurant.id}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all"
            >
              <Link to={`/restaurants/${restaurant.id}`} className="block">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                    <span className="text-sm font-semibold text-orange-500">⭐ {restaurant.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-4">{restaurant.cuisine}</p>
                  
                  <div className="flex justify-between items-center text-gray-500">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">📍</span>
                      <span className="text-sm">{restaurant.location}</span>
                    </div>
                    <span className="text-sm">{restaurant.deliveryTime}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    );
  };
  
  export default PopularRestaurants;