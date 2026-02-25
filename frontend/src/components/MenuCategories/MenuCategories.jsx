import React from 'react';
import { menu_list } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../../contexts/MenuContext';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const MenuCategories = () => {
  const navigate = useNavigate();
  const { categories } = useMenu();

  // Get unique category names from context or fall back to static list
  const displayCategories = menu_list.filter(cat => 
    cat.menu_name === 'All' || categories.includes(cat.menu_name)
  );

  const handleCategoryClick = (categoryName) => {
    navigate(`/menu?category=${categoryName}`);
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Explore <span className="text-orange-600">Categories</span>
            </h2>
            <p className="text-gray-500 mt-2 font-medium">Find what you're craving right now</p>
          </motion.div>
          
          <motion.button
            whileHover={{ x: 5 }}
            className="text-orange-600 font-bold flex items-center group text-sm self-start md:self-auto"
            onClick={() => navigate('/menu')}
          >
            View All Menu
            <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Horizontal Scroll Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ScrollArea className="w-full whitespace-nowrap pb-6">
            <div className="flex w-max space-x-4 sm:space-x-6 p-1">
              {displayCategories.map((category, index) => (
                <motion.div 
                  key={index}
                  className="w-[120px] sm:w-[140px] shrink-0 group cursor-pointer"
                  whileHover={{ y: -5 }}
                  onClick={() => handleCategoryClick(category.menu_name)}
                >
                  <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-sm border border-gray-100 group-hover:shadow-xl group-hover:shadow-orange-500/10 group-hover:border-orange-200 transition-all duration-300">
                    <div className="relative aspect-square rounded-full overflow-hidden mb-4 bg-gray-50 border-4 border-gray-50 group-hover:border-orange-50 transition-colors">
                      <img
                        src={category.menu_image}
                        alt={category.menu_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-center font-bold text-gray-800 text-sm sm:text-base group-hover:text-orange-600 transition-colors">
                      {category.menu_name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="h-2.5" />
          </ScrollArea>
        </motion.div>

      </div>
    </section>
  );
};

export default MenuCategories;