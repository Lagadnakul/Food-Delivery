/**
 * Food Service for Admin Panel
 * Handles all food-related API calls
 */
import axios from 'axios';
import api, { API_URL, endpoints } from './api';

/**
 * Get all food items
 */
export const getAllFood = async () => {
  try {
    const response = await api.get(endpoints.foodList);
    return response.data;
  } catch (error) {
    console.error('Error fetching food list:', error);
    throw error;
  }
};

/**
 * Add a new food item
 * @param {FormData} formData - Form data containing food details and image
 */
export const addFood = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}${endpoints.foodAdd}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 15000,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding food:', error);
    throw error;
  }
};

/**
 * Remove a food item
 * @param {string} id - Food item ID
 */
export const removeFood = async (id) => {
  try {
    const response = await api.post(endpoints.foodRemove, { id });
    return response.data;
  } catch (error) {
    console.error('Error removing food:', error);
    throw error;
  }
};

export default {
  getAllFood,
  addFood,
  removeFood,
};
