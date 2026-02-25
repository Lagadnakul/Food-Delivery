import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-24 min-h-[90vh] flex items-center">
      {/* Abstract Background Elements (Tailwind Native, No Custom CSS) */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-orange-50 blur-[100px] opacity-70 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-rose-50 blur-[100px] opacity-70 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Text Content (Left Side - 7 cols) */}
          <motion.div 
            className="lg:col-span-7 space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Badge variant="secondary" className="px-4 py-1.5 bg-orange-100 text-orange-700 hover:bg-orange-200 border-none font-semibold text-sm rounded-full tracking-wide">
                  🚀 #1 Fastest Delivery App
                </Badge>
              </motion.div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 leading-[1.1]">
                Your Favorite Food
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-rose-500 to-pink-500 drop-shadow-sm">
                  Delivered Fresh
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 max-w-xl leading-relaxed font-medium">
                Experience the finest cuisine delivered right to your doorstep. 
                Choose from thousands of restaurants with zero-hassle ordering.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link to="/menu" className="w-full sm:w-auto">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto px-8 h-14 text-base font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-500/30 rounded-full transition-all hover:-translate-y-1"
                >
                  Order Now
                </Button>
              </Link>
              <Link to="/restaurants" className="w-full sm:w-auto">
                <Button 
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 h-14 text-base font-bold text-gray-700 border-2 border-gray-200 hover:border-orange-200 hover:bg-orange-50 rounded-full transition-all group"
                >
                  View Menu
                  <svg className="w-5 h-5 ml-2 text-gray-400 group-hover:text-orange-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              </Link>
            </div>
            
            {/* Customer Proof Mini-Bento */}
            <motion.div 
              className="flex items-center gap-4 pt-8 border-t border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex -space-x-3">
                {[assets.food_1, assets.food_2, assets.food_3].map((img, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-[3px] border-white bg-orange-100 overflow-hidden shadow-sm">
                    <img src={img} alt="Customer" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex text-yellow-500 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-800 mt-0.5">8,200+ Happy Customers</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Visual Content (Right Side - 5 cols Bento Grid) */}
          <motion.div 
            className="lg:col-span-5 relative mt-10 lg:mt-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Main Image Block */}
            <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-orange-900/10 border-8 border-white group">
              <img 
                src={assets.header_img} 
                alt="Delicious featured meal"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent pointer-events-none" />
              
              {/* Overlay Text */}
              <div className="absolute bottom-8 left-8 right-8">
                <span className="bg-white/90 backdrop-blur-md text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                  Featured
                </span>
                <h3 className="text-white font-bold text-2xl drop-shadow-md">Spicy Noodles Bowl</h3>
              </div>
            </div>

            {/* Floating Bento Cards */}
            <motion.div
              className="absolute -left-6 sm:-left-12 top-10 sm:top-20 bg-white/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-xl border border-white/50 z-20 flex items-center gap-3 sm:gap-4 pointer-events-none"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <span className="text-xl sm:text-2xl">⚡</span>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Delivery</div>
                <div className="font-extrabold text-gray-900 text-sm sm:text-base">Under 30 Min</div>
              </div>
            </motion.div>
            
            <motion.div
              className="absolute -right-6 sm:-right-8 bottom-24 sm:bottom-32 bg-white/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-xl border border-white/50 z-20 flex items-center gap-3 sm:gap-4 pointer-events-none"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <span className="text-xl sm:text-2xl">🔥</span>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Hot & Fresh</div>
                <div className="font-extrabold text-gray-900 text-sm sm:text-base">100% Quality</div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;