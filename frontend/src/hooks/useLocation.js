import { useState, useEffect, useCallback } from 'react';
import LocationService from '../services/locationService';
import { LOCATION_KEY } from '../config';

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem(LOCATION_KEY);
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        setLocation(parsed);
        setAddress(parsed.address || '');
      } catch (e) {
        localStorage.removeItem(LOCATION_KEY);
      }
    }
  }, []);

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const coords = await LocationService.getCurrentLocation();
      
      // Get address
      const addressResult = await LocationService.getAddressFromCoordinates(
        coords.lat,
        coords.lng
      );

      // Get delivery info
      const distanceResult = await LocationService.getDistanceFromRestaurant(
        coords.lat,
        coords.lng
      );

      const deliveryEstimate = LocationService.estimateDeliveryTime(
        distanceResult.distance
      );

      const locationData = {
        lat: coords.lat,
        lng: coords.lng,
        address: addressResult.success ? addressResult.address : 'Location detected',
      };

      setLocation(locationData);
      setAddress(locationData.address);
      setDeliveryInfo({
        distance: distanceResult.distance,
        ...deliveryEstimate,
      });

      // Save to localStorage
      localStorage.setItem(LOCATION_KEY, JSON.stringify(locationData));

      return locationData;
    } catch (err) {
      setError(err.message || 'Failed to get location');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Set location manually
  const setManualLocation = useCallback(async (lat, lng, addressStr) => {
    try {
      setLoading(true);
      setError(null);

      // Get delivery info
      const distanceResult = await LocationService.getDistanceFromRestaurant(lat, lng);
      const deliveryEstimate = LocationService.estimateDeliveryTime(distanceResult.distance);

      const locationData = {
        lat,
        lng,
        address: addressStr,
      };

      setLocation(locationData);
      setAddress(addressStr);
      setDeliveryInfo({
        distance: distanceResult.distance,
        ...deliveryEstimate,
      });

      localStorage.setItem(LOCATION_KEY, JSON.stringify(locationData));

      return locationData;
    } catch (err) {
      setError(err.message || 'Failed to set location');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear location
  const clearLocation = useCallback(() => {
    setLocation(null);
    setAddress('');
    setDeliveryInfo(null);
    localStorage.removeItem(LOCATION_KEY);
  }, []);

  return {
    location,
    address,
    loading,
    error,
    deliveryInfo,
    getCurrentLocation,
    setManualLocation,
    clearLocation,
  };
};

export default useLocation;
