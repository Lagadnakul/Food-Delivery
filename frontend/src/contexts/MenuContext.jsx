import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { food_list } from '../assets/assets';
import { API_URL } from '../config';
import { useCart } from './CartContext';

// Define the constant locally if it's not exported from config.js
const DEFAULT_FETCH_INTERVAL = 60000; // 60 seconds

// Create context
const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(0);
  // We'll reference useCart in the component that uses addToCart
  // This avoids circular dependency issues

  // Function to fetch food items from the API
  const fetchFoodItems = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    
    try {
      const response = await axios.get(`${API_URL}/food/list`);
      
      if (response.data.success && response.data.data.length > 0) {
        // Format the data for consistent display
        const formattedData = response.data.data.map(item => ({
          ...item,
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
        }));
        
        setFoodItems(formattedData);
        setLastFetched(Date.now());
        
        // Extract unique categories from the data
        const uniqueCategories = ['All', ...new Set(formattedData.map(item => item.category))];
        setCategories(uniqueCategories);
      } else {
        // If API returns no data, fall back to local data
        setFoodItems(food_list);
        const uniqueCategories = ['All', ...new Set(food_list.map(item => item.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
      // If API call fails, fall back to local data
      setFoodItems(food_list);
      const uniqueCategories = ['All', ...new Set(food_list.map(item => item.category))];
      setCategories(uniqueCategories);
      
      if (showLoading) {
        toast.error("Couldn't connect to server, showing sample data");
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  // Fetch data on initial load and set up polling
  useEffect(() => {
    fetchFoodItems();
    
    // Poll for updates at regular intervals
    const intervalId = setInterval(() => {
      fetchFoodItems(false); // Don't show loading state for background refreshes
    }, DEFAULT_FETCH_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [fetchFoodItems]);

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  };

  // Provide the menu data and functions to children
  return (
    <MenuContext.Provider value={{ 
      foodItems, 
      categories, 
      loading, 
      lastFetched,
      isAuthenticated,
      refreshMenu: () => fetchFoodItems(true)
    }}>
      {children}
    </MenuContext.Provider>
  );
};

// Custom hook for using the menu context
export const useMenu = () => useContext(MenuContext);