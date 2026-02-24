import { motion } from 'framer-motion';
import { Clock, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const PopularRestaurants = () => {
    return (
      <section className="section-spacing">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Popular <span className="text-orange-500">Restaurants</span>
          </h2>
          <p className="text-gray-600">Discover the best restaurants near you</p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {restaurants.map((restaurant) => (
            <motion.div
              key={restaurant.id}
              variants={cardVariants}
              whileHover={{ y: -12, scale: 1.02 }}
              className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500"
            >
              <Link to={`/restaurants/${restaurant.id}`} className="block">
                <div className="relative h-52 overflow-hidden">
                  <motion.img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Rating badge */}
                  <motion.div 
                    className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-gray-800">{restaurant.rating}</span>
                  </motion.div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-orange-500 transition-colors duration-300">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">{restaurant.cuisine}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 group-hover:text-orange-500 transition-colors duration-300">
                      <MapPin size={16} className="mr-1.5 text-orange-400" />
                      <span className="text-sm">{restaurant.location}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock size={16} className="mr-1.5 text-green-500" />
                      <span className="text-sm font-medium">{restaurant.deliveryTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    );
  };
  
  export default PopularRestaurants;