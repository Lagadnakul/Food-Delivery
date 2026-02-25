import { Clock, MapPin, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

// Shadcn UI components
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';

// Restaurant data
const restaurants = [
  {
    id: 1,
    name: "The Grand Kitchen",
    image: assets.res1,
    rating: "4.8",
    cuisine: "Multi Cuisine",
    location: "Downtown LA",
    deliveryTime: "30-40 min",
    trending: true
  },
  {
    id: 2,
    name: "Spice Garden",
    image: assets.res2,
    rating: "4.6",
    cuisine: "Indian",
    location: "Beverly Hills",
    deliveryTime: "25-35 min"
  },
  {
    id: 3,
    name: "Ocean Delights",
    image: assets.res3,
    rating: "4.7",
    cuisine: "Seafood",
    location: "Marina Beach",
    deliveryTime: "35-45 min"
  },
  {
    id: 4,
    name: "Italian Corner",
    image: assets.res4,
    rating: "4.5",
    cuisine: "Italian",
    location: "West Hollywood",
    deliveryTime: "20-30 min",
    trending: true
  },
  {
    id: 5,
    name: "Asian Fusion",
    image: assets.res5,
    rating: "4.9",
    cuisine: "Pan Asian",
    location: "Chinatown",
    deliveryTime: "25-35 min"
  },
  {
    id: 6,
    name: "Mediterranean Treats",
    image: assets.res6,
    rating: "4.7",
    cuisine: "Mediterranean",
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const PopularRestaurants = () => {
  return (
    <section className="py-16 md:py-24 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Trending <span className="text-orange-600">Restaurants</span>
            </h2>
            <p className="text-gray-500 mt-2 font-medium">Top-rated spots delivering to you right now</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              to="/restaurants" 
              className="inline-flex items-center text-orange-600 font-bold hover:text-orange-700 transition-colors group"
            >
              See all restaurants
              <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
        
        {/* Restaurant Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {restaurants.map((restaurant) => (
            <motion.div
              key={restaurant.id}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="h-full"
            >
              <Link to={`/restaurants/${restaurant.id}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-2xl">
                <Card className="h-full overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white group rounded-2xl">
                  {/* Image Header with Badges */}
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    
                    {/* Top left badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <Badge className="bg-white/95 text-gray-900 hover:bg-white border-0 font-bold px-2.5 py-1">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                        {restaurant.rating}
                      </Badge>
                      {restaurant.trending && (
                        <Badge className="bg-rose-500 hover:bg-rose-600 text-white border-0 font-bold px-2.5 py-1 shadow-sm">
                          🔥 Trending
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                        {restaurant.name}
                      </h3>
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-4">{restaurant.cuisine}</p>
                    
                    {/* Visual Divider */}
                    <div className="w-full h-px bg-gray-100 mb-4" />
                    
                    {/* Meta Info */}
                    <div className="flex justify-between items-center text-sm font-medium">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                        <span className="truncate max-w-[120px]">{restaurant.location}</span>
                      </div>
                      <div className="flex items-center text-gray-900 bg-orange-50 px-2.5 py-1 rounded-full">
                        <Clock className="w-4 h-4 mr-1.5 text-orange-500" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PopularRestaurants;