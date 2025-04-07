import React from 'react';
import { assets } from '../assets/assets';


const MobileApp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-16">
      <div className="container-padding">
        {/* Main Section */}
        <div className="flex flex-col md:flex-row items-center md:space-x-12 mb-20">
          {/* Left Content */}
          <div className="md:w-1/2 mb-10 md:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Get Our <span className="text-orange-500">Mobile App</span> Today!
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Discover the easiest way to order your favorite meals. Download our app and enjoy exclusive offers, faster ordering, and real-time delivery tracking.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a href="#" className="transform hover:scale-105 transition-transform">
                  <img src={assets.app_store} alt="Download on App Store" className="h-14" />
                </a>
                <a href="#" className="transform hover:scale-105 transition-transform">
                  <img src={assets.play_store} alt="Get it on Google Play" className="h-14" />
                </a>
              </div>
            </motion.div>
          </div>
          
          {/* Right Content - Phone Mockup */}
          <div className="md:w-1/2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              {/* Add your mobile app screenshot or mockup here */}
              <div className="w-64 h-[500px] bg-black rounded-[40px] p-3 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-2xl"></div>
                <div className="w-full h-full bg-orange-100 rounded-[32px] overflow-hidden">
                  <img 
                    src={assets.header_img} 
                    alt="Mobile App Screenshot" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12">App Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-5 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Fast Delivery</h3>
              <p className="text-gray-600 text-center">Track your order in real-time. Know exactly when your food will arrive.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-5 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Exclusive Offers</h3>
              <p className="text-gray-600 text-center">Get mobile-only special discounts and personalized recommendations.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-5 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Easy Payment</h3>
              <p className="text-gray-600 text-center">Multiple payment options including cards, wallets and cash on delivery.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileApp;