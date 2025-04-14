import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 pt-28 pb-20">
      {/* Enhanced Background decoration elements */}
      <div className="absolute top-40 left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob"></div>
      <div className="absolute top-20 right-64 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-8 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-3000"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content - Enhanced */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="space-y-4">
              <motion.span 
                className="inline-block px-4 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-600 rounded-full text-sm font-bold tracking-wide shadow-sm"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                #1 Food Delivery App
              </motion.span>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
                <span className="block">Your Favorite Food</span>
                <span className="block text-gradient bg-gradient-to-r from-orange-600 to-rose-500">Delivered Fresh & Fast</span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              Experience the finest cuisine delivered right to your doorstep. 
              Choose from our wide selection of restaurants and cuisines with no-hassle ordering.
            </p>
            
            {/* Fixed button alignment */}
            <div className="flex items-center flex-wrap gap-5 pt-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  to="/menu" 
                  className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-rose-500 rounded-full hover:shadow-lg hover:shadow-orange-200 transition-all inline-block"
                >
                  Order Now
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  to="/restaurants" 
                  className="px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-full hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100 transition-all flex items-center"
                >
                  <span>View Restaurants</span>
                  <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </motion.div>
            </div>
            
            {/* Enhanced customer section */}
            <motion.div 
              className="flex items-center space-x-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex -space-x-4">
                <div className="w-12 h-12 rounded-full border-2 border-white bg-orange-200 flex items-center justify-center text-orange-600 font-semibold overflow-hidden shadow-md">
                  <img src={assets.food_1} alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-white bg-orange-200 flex items-center justify-center text-orange-600 font-semibold overflow-hidden shadow-md">
                  <img src={assets.food_2} alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-white bg-orange-200 flex items-center justify-center text-orange-600 font-semibold overflow-hidden shadow-md">
                  <img src={assets.food_3} alt="User" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="text-sm">
                <span className="font-bold text-gray-900">8,200+ happy customers</span>
                <div className="flex text-yellow-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Image Content - Enhanced with better visibility for decorations */}
          <motion.div 
            className="relative z-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            {/* Decorative elements behind image - Enhanced */}
            <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-yellow-300 opacity-40 blur-sm"></div>
            <div className="absolute -bottom-16 right-20 w-40 h-40 rounded-full bg-orange-500 opacity-40 blur-md"></div>
            
            {/* Food cards decorations - Enhanced visibility */}
            <motion.div
              className="absolute -top-12 -right-8 bg-white p-4 rounded-xl shadow-xl z-10"
              initial={{ x: 20, y: 20, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <svg className="w-7 h-7 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500">Delivery Time</div>
                  <div className="font-semibold text-gray-900">25-30 min</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="absolute -bottom-8 -left-10 bg-white p-4 rounded-xl shadow-xl z-10"
              initial={{ x: -20, y: 20, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500">Order Success</div>
                  <div className="font-semibold text-gray-900">Confirmed!</div>
                </div>
              </div>
            </motion.div>
            
            {/* Main image with enhanced styling */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <motion.img 
                src={assets.header_img} 
                alt="Featured Food"
                className="w-full h-full object-cover"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                whileHover={{ scale: 1.05 }}
              />
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Enhanced animated elements at the bottom */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-white/80 fill-current">
          <path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,229.3C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      {/* CSS for animations and effects */}
      <style jsx>{`
        .text-gradient {
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;