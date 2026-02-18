import api from './api';

// Restaurant default location from environment
const RESTAURANT_LOCATION = {
  lat: parseFloat(import.meta.env.VITE_RESTAURANT_LAT) || 19.0760,
  lng: parseFloat(import.meta.env.VITE_RESTAURANT_LNG) || 72.8777,
};

// Average delivery speed in km/h
const AVERAGE_DELIVERY_SPEED = 25;

const LocationService = {
  // Get user's current location
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({ message: 'Geolocation is not supported by your browser' });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          let message = 'Unable to retrieve your location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out';
              break;
          }
          reject({ message, code: error.code });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // Cache for 1 minute
        }
      );
    });
  },

  // Watch user's location (real-time tracking)
  watchLocation: (callback, errorCallback) => {
    if (!navigator.geolocation) {
      errorCallback({ message: 'Geolocation is not supported' });
      return null;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        callback({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        errorCallback({ message: 'Location tracking error', code: error.code });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    return watchId;
  },

  // Stop watching location
  stopWatchingLocation: (watchId) => {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  },

  // Get restaurant location
  getRestaurantLocation: () => {
    return RESTAURANT_LOCATION;
  },

  // Calculate distance using Haversine formula (client-side fallback)
  calculateDistanceHaversine: (lat1, lng1, lat2, lng2) => {
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
    return R * c; // Distance in km
  },

  // Get distance from restaurant to user using Google Distance Matrix API (via backend)
  getDistanceFromRestaurant: async (userLat, userLng) => {
    try {
      const response = await api.get('/location/distance', {
        params: {
          userLat,
          userLng,
          restaurantLat: RESTAURANT_LOCATION.lat,
          restaurantLng: RESTAURANT_LOCATION.lng,
        },
      });
      return response.data;
    } catch (error) {
      // Fallback to Haversine calculation
      const distance = LocationService.calculateDistanceHaversine(
        RESTAURANT_LOCATION.lat,
        RESTAURANT_LOCATION.lng,
        userLat,
        userLng
      );
      return {
        success: true,
        distance: Math.round(distance * 10) / 10,
        duration: Math.round((distance / AVERAGE_DELIVERY_SPEED) * 60),
        method: 'haversine',
      };
    }
  },

  // Estimate delivery time based on distance
  estimateDeliveryTime: (distanceKm) => {
    // Base preparation time (minutes)
    const preparationTime = 15;
    // Travel time based on average speed
    const travelTime = (distanceKm / AVERAGE_DELIVERY_SPEED) * 60;
    // Buffer time for traffic, finding address, etc.
    const bufferTime = 5;
    
    const totalMinutes = Math.ceil(preparationTime + travelTime + bufferTime);
    
    return {
      preparationTime,
      travelTime: Math.ceil(travelTime),
      totalMinutes,
      formattedTime: LocationService.formatDeliveryTime(totalMinutes),
    };
  },

  // Format delivery time for display
  formatDeliveryTime: (minutes) => {
    if (minutes < 60) {
      return `${minutes}-${minutes + 10} mins`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours} hr`;
    }
    return `${hours} hr ${mins} mins`;
  },

  // Get address from coordinates (reverse geocoding via backend)
  getAddressFromCoordinates: async (lat, lng) => {
    try {
      const response = await api.get('/location/reverse-geocode', {
        params: { lat, lng },
      });
      return response.data;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return { success: false, message: 'Unable to get address' };
    }
  },

  // Search for address/place
  searchAddress: async (query) => {
    try {
      const response = await api.get('/location/search', {
        params: { query },
      });
      return response.data;
    } catch (error) {
      console.error('Address search error:', error);
      return { success: false, results: [] };
    }
  },

  // Check if delivery is available to location
  isDeliveryAvailable: async (lat, lng) => {
    const MAX_DELIVERY_DISTANCE = 15; // km
    
    try {
      const result = await LocationService.getDistanceFromRestaurant(lat, lng);
      const distance = result.distance || 0;
      
      return {
        available: distance <= MAX_DELIVERY_DISTANCE,
        distance,
        maxDistance: MAX_DELIVERY_DISTANCE,
        message: distance <= MAX_DELIVERY_DISTANCE 
          ? 'Delivery available' 
          : `Sorry, we don't deliver to locations more than ${MAX_DELIVERY_DISTANCE}km away`,
      };
    } catch (error) {
      return {
        available: false,
        message: 'Unable to check delivery availability',
      };
    }
  },

  // Load Google Maps script
  loadGoogleMapsScript: () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
        return;
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        reject({ message: 'Google Maps API key not configured' });
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google.maps);
      script.onerror = () => reject({ message: 'Failed to load Google Maps' });
      document.head.appendChild(script);
    });
  },
};

export default LocationService;
