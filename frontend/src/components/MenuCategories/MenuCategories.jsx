import React from 'react';
import { menu_list } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useMenu } from '../../contexts/MenuContext';

const MenuCategories = () => {
  const navigate = useNavigate();
  const { categories } = useMenu();

  // Get unique category names from context or fall back to static list
  const displayCategories = menu_list.filter(cat => 
    cat.menu_name === 'All' || categories.includes(cat.menu_name)
  );

  const handleCategoryClick = (categoryName) => {
    // Navigate to the menu page with the selected category
    navigate(`/menu?category=${categoryName}`);
  };

  return (
    <section className="section-spacing">
      <h2 className="text-3xl font-bold text-center mb-12">
        Explore Our <span className="text-orange-500">Menu Categories</span>
      </h2>
      <div className="relative">
        <div className="flex overflow-x-auto space-x-8 pb-8 scrollbar-hide">
          {displayCategories.map((category, index) => (
            <motion.div 
              key={index}
              className="flex-none w-32 group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(category.menu_name)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="relative rounded-full overflow-hidden shadow-lg aspect-square mb-4">
                <img
                  src={category.menu_image}
                  alt={category.menu_name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <h3 className="text-center font-medium group-hover:text-orange-500">
                {category.menu_name}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuCategories;