import api from './api';

/**
 * Admin food item service.
 * All endpoints match backend routes in /backend/routes/foodRoute.js
 *   GET  /food/list
 *   POST /food/add     (multipart/form-data — includes image file)
 *   POST /food/remove  (body: { id })
 */

/**
 * Fetch all food items from the database.
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const listFood = async () => {
  const response = await api.get('/food/list');
  return response.data;
};

/**
 * Add a new food item with an image upload.
 * @param {FormData} formData — must include: name, description, category, price, image (File)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const addFood = async (formData) => {
  const response = await api.post('/food/add', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Remove a food item by ID.
 * @param {string} id — MongoDB _id of the food document
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const removeFood = async (id) => {
  const response = await api.post('/food/remove', { id });
  return response.data;
};
