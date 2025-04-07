import { assets } from '../assets/assets';
import { API_URL } from '../Config';

// Helper function to determine the correct image source
export const determineImageSource = (item) => {
  if (typeof item.image === 'string' && item.image.startsWith('http')) {
    return item.image;
  }
  
  if (typeof item.image === 'string' && item.image.includes('/')) {
    return `${API_URL}/${item.image}`;
  }
  
  return item.image;
};

// Helper function to handle image loading errors
export const handleImageError = (e, item) => {
  const itemId = parseInt(item._id || item.id);
  
  if (!isNaN(itemId) && itemId >= 1 && itemId <= 32) {
    e.target.src = assets[`food_${itemId}`];
  } else {
    e.target.src = assets.food_1;
  }
};