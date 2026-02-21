/**
 * Location Service
 * 
 * Handles location-related API calls and geolocation utilities
 */
import api from './api';

const LocationService = {
  /**
   * Get nearby restaurants based on coordinates
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {number} radius - Search radius in km
   * @returns {Promise<Object>} - Nearby restaurants
   */
  getNearbyRestaurants: async (lat, lng, radius = 10) => {
    try {
      const response = await api.get(`/location/restaurants?lat=${lat}&lng=${lng}&radius=${radius}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby restaurants:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch nearby restaurants',
        data: []
      };
    }
  },

  /**
   * Validate if an address/location is serviceable
   * @param {Object} locationData - { address, lat, lng }
   * @returns {Promise<Object>} - Validation result
   */
  validateLocation: async (locationData) => {
    try {
      const response = await api.post('/location/validate', locationData);
      return response.data;
    } catch (error) {
      console.error('Error validating location:', error);
      return {
        success: false,
        serviceable: true, // Default to serviceable on error
        message: 'Could not validate location'
      };
    }
  },

  /**
   * Get current position using browser geolocation
   * @returns {Promise<Object>} - { lat, lng } or error
   */
  getCurrentPosition: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({
          success: false,
          message: 'Geolocation is not supported by your browser'
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            success: true,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          let message = 'Could not get your location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location permission denied. Please enable location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out.';
              break;
          }
          reject({ success: false, message });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  },

  /**
   * Calculate distance between two points (Haversine formula)
   * @param {number} lat1 - First point latitude
   * @param {number} lng1 - First point longitude
   * @param {number} lat2 - Second point latitude
   * @param {number} lng2 - Second point longitude
   * @returns {number} - Distance in kilometers
   */
  calculateDistance: (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  /**
   * Format distance for display
   * @param {number} distanceKm - Distance in km
   * @returns {string} - Formatted distance
   */
  formatDistance: (distanceKm) => {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm.toFixed(1)} km`;
  },

  /**
   * Calculate estimated delivery time
   * @param {number} distanceKm - Distance in km
   * @param {number} avgSpeedKmh - Average speed in km/h
   * @returns {number} - Estimated time in minutes
   */
  calculateETA: (distanceKm, avgSpeedKmh = 25) => {
    const travelTime = (distanceKm / avgSpeedKmh) * 60;
    const prepTime = distanceKm < 3 ? 10 : 15;
    return Math.ceil(travelTime + prepTime);
  }
};

export default LocationService;
