import React from 'react';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Tag, 
  CreditCard, 
  Bell, 
  MapPin, 
  Utensils, 
  Heart, 
  Star, 
  ChevronRight 
} from 'lucide-react';

const MobileApp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 py-20">
      <div className="container-padding">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center md:space-x-16 mb-32">
          {/* Left Content */}
          <div className="md:w-1/2 mb-16 md:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-block px-4 py-1.5 bg-orange-100 rounded-full text-orange-600 font-medium mb-6">
                Available now on iOS & Android
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                Order Delicious Food <span className="text-orange-500">Anywhere, Anytime</span>
              </h1>
              <p className="text-gray-600 text-xl mb-8 leading-relaxed">
                Experience the next level of food delivery with our feature-packed mobile app. Order from your favorite restaurants, track delivery in real-time, and enjoy exclusive mobile-only offers.
              </p>
              
              <div className="flex flex-wrap gap-5 mb-8">
                <motion.a 
                  href="#" 
                  className="transform transition-transform duration-300 hover:scale-105 shadow-lg rounded-xl"
                  whileHover={{ y: -5 }}
                >
                  <img src={assets.app_store} alt="Download on App Store" className="h-14" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="transform transition-transform duration-300 hover:scale-105 shadow-lg rounded-xl"
                  whileHover={{ y: -5 }}
                >
                  <img src={assets.play_store} alt="Get it on Google Play" className="h-14" />
                </motion.a>
              </div>
              
              <div className="flex items-center space-x-4 text-gray-500">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center">
                    <Star className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center">
                    <Star className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center">
                    <Star className="w-4 h-4 text-orange-500" />
                  </div>
                </div>
                <span className="text-sm">
                  <span className="font-semibold">4.8/5</span> from over 1,000+ reviews
                </span>
              </div>
            </motion.div>
          </div>
          
          {/* Right Content - Phone Mockup */}
          <div className="md:w-1/2 flex justify-center relative">
            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-orange-200 opacity-20 blur-xl"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-rose-300 opacity-20 blur-xl"></div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Phone frame */}
              <div className="w-72 h-[580px] bg-gray-900 rounded-[50px] p-3 shadow-2xl relative overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-6 bg-gray-900 rounded-b-xl z-10"></div>
                
                {/* Phone screen */}
                <div className="w-full h-full bg-white rounded-[44px] overflow-hidden">
                  {/* App UI */}
                  <div className="h-full flex flex-col">
                    {/* Status bar */}
                    <div className="h-7 bg-orange-500 flex items-center justify-between px-5">
                      <div className="text-xs font-bold text-white">9:41</div>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* App header */}
                    <div className="px-5 py-4 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Current Location</p>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-orange-500" />
                            <p className="font-medium text-sm ml-1">Los Angeles, CA</p>
                          </div>
                        </div>
                        <div className="relative">
                          <Bell className="w-6 h-6 text-gray-700" />
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></span>
                        </div>
                      </div>
                      
                      {/* Search bar */}
                      <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center">
                        <div className="w-4 h-4 text-gray-400">🔍</div>
                        <p className="text-xs text-gray-400 ml-2">Search for restaurants or foods</p>
                      </div>
                    </div>
                    
                    {/* Recommended Section */}
                    <div className="px-5 py-3">
                      <div className="flex justify-between items-center mb-3">
                        <p className="font-semibold text-sm">Recommended</p>
                        <div className="flex items-center text-orange-500 text-xs">
                          <p>See all</p>
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </div>
                      </div>
                      
                      {/* Card */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3">
                        <div className="h-24 bg-gray-200 relative">
                          <img 
                            src={assets.food_1} 
                            alt="Food" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                            <Heart className="w-3 h-3 text-orange-500" />
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="flex justify-between mb-1">
                            <p className="font-medium text-xs">Veggie Salad Bowl</p>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              <p className="text-xs font-medium ml-1">4.9</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <p className="text-xs text-gray-400 ml-1">15-25 min</p>
                            </div>
                            <p className="text-xs font-bold text-orange-500">$12.99</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Another card (partial) */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="h-24 bg-gray-200 relative">
                          <img 
                            src={assets.food_12} 
                            alt="Food" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                            <Heart className="w-3 h-3 text-gray-300" />
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="flex justify-between mb-1">
                            <p className="font-medium text-xs">Sweet Dessert</p>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              <p className="text-xs font-medium ml-1">4.7</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tab bar */}
                    <div className="mt-auto border-t border-gray-100 px-6 py-3 flex justify-between">
                      <div className="flex flex-col items-center">
                        <Utensils className="w-5 h-5 text-orange-500" />
                        <p className="text-[10px] mt-1 text-orange-500">Menu</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <Heart className="w-5 h-5 text-gray-400" />
                        <p className="text-[10px] mt-1 text-gray-400">Favorites</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <p className="text-[10px] mt-1 text-gray-400">Orders</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                        </div>
                        <p className="text-[10px] mt-1 text-gray-400">Profile</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="py-12 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <div className="inline-block px-4 py-1.5 bg-orange-100 rounded-full text-orange-600 font-medium mb-4">
              App Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One App
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Our mobile app is designed to make food ordering a seamless experience. Here are some key features that make Hunger Hive the best choice for food delivery.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -m-16 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 relative">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Real-time Tracking</h3>
              <p className="text-gray-600">
                Track your order in real-time from the restaurant to your doorstep. Know exactly when your food will arrive.
              </p>
              <div className="mt-6 flex items-center text-orange-500 font-medium">
                <span className="text-sm">Learn more</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -m-16 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 relative">
                <Tag className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Exclusive Offers</h3>
              <p className="text-gray-600">
                Get access to mobile-only deals, special promotions, and personalized recommendations based on your preferences.
              </p>
              <div className="mt-6 flex items-center text-orange-500 font-medium">
                <span className="text-sm">Learn more</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -m-16 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 relative">
                <CreditCard className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Seamless Payments</h3>
              <p className="text-gray-600">
                Choose from multiple payment options including credit cards, digital wallets, and cash on delivery with secure payment processing.
              </p>
              <div className="mt-6 flex items-center text-orange-500 font-medium">
                <span className="text-sm">Learn more</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl overflow-hidden shadow-xl"
        >
          <div className="px-8 py-16 md:p-16 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Download the App & Get Started Today
              </h2>
              <p className="text-orange-100 text-lg mb-8">
                Join thousands of satisfied users who have transformed their food ordering experience. Download now and get 20% off your first order!
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.a 
                  href="#" 
                  className="transform transition-transform duration-300 hover:scale-105"
                  whileHover={{ y: -5 }}
                >
                  <img src={assets.app_store} alt="Download on App Store" className="h-14" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="transform transition-transform duration-300 hover:scale-105"
                  whileHover={{ y: -5 }}
                >
                  <img src={assets.play_store} alt="Get it on Google Play" className="h-14" />
                </motion.a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <div className="w-64 h-64 md:w-72 md:h-72 relative">
                <img 
                  src={assets.food_14} 
                  alt="Food Preview" 
                  className="w-full h-full object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  </div>
                  <p className="text-sm font-bold text-gray-800 mt-1">Amazing App!</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MobileApp;