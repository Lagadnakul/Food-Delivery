import api from './api';

const FoodService = {
  // Get all food items
  getAll: async () => {
    try {
      const response = await api.get('/food/list');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch food items' };
    }
  },

  // Get single food item
  getById: async (id) => {
    try {
      const response = await api.get(`/food/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch food item' };
    }
  },

  // Add new food item
  add: async (foodData) => {
    try {
      const response = await api.post('/food/add', foodData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to add food item' };
    }
  },

  // Update food item
  update: async (id, foodData) => {
    try {
      const response = await api.put(`/food/${id}`, foodData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update food item' };
    }
  },

  // Delete food item
  delete: async (id) => {
    try {
      const response = await api.delete(`/food/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to delete food item' };
    }
  },

  // Toggle availability
  toggleAvailability: async (id) => {
    try {
      const response = await api.patch(`/food/${id}/availability`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to toggle availability' };
    }
  },
};

export default FoodService;
