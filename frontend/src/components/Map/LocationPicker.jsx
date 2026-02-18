import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LocationService from '../../services/locationService';
import LoadingSpinner from '../UI/LoadingSpinner';
import Button from '../UI/Button';

const LocationPicker = ({ onLocationSelect, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [deliveryCheck, setDeliveryCheck] = useState(null);

  // Get current location
  const handleGetCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const location = await LocationService.getCurrentLocation();
      
      // Get address from coordinates
      const addressResult = await LocationService.getAddressFromCoordinates(
        location.lat,
        location.lng
      );

      // Check delivery availability
      const deliveryResult = await LocationService.isDeliveryAvailable(
        location.lat,
        location.lng
      );

      setSelectedLocation(location);
      setAddress(addressResult.success ? addressResult.address : 'Location detected');
      setDeliveryCheck(deliveryResult);
    } catch (err) {
      setError(err.message || 'Failed to get location');
    } finally {
      setLoading(false);
    }
  }, []);

  // Search for address
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const result = await LocationService.searchAddress(searchQuery);
      setSearchResults(result.results || []);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Select search result
  const handleSelectResult = useCallback(async (result) => {
    try {
      setLoading(true);

      // Check delivery availability
      const deliveryResult = await LocationService.isDeliveryAvailable(
        result.location.lat,
        result.location.lng
      );

      setSelectedLocation(result.location);
      setAddress(result.address);
      setDeliveryCheck(deliveryResult);
      setSearchResults([]);
    } catch (err) {
      setError('Failed to select location');
    } finally {
      setLoading(false);
    }
  }, []);

  // Confirm selection
  const handleConfirm = useCallback(() => {
    if (selectedLocation && deliveryCheck?.available) {
      onLocationSelect({
        ...selectedLocation,
        address,
      });
      onClose();
    }
  }, [selectedLocation, address, deliveryCheck, onLocationSelect, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Select Delivery Location</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Current Location Button */}
            <button
              onClick={handleGetCurrentLocation}
              disabled={loading}
              className="w-full flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">Use Current Location</p>
                <p className="text-sm text-gray-500">Detect my location automatically</p>
              </div>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for your address..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                onClick={handleSearch}
                disabled={loading || !searchQuery.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 disabled:bg-gray-300"
              >
                Search
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="max-h-48 overflow-y-auto space-y-2 border rounded-xl p-2">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectResult(result)}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <p className="font-medium text-gray-800 text-sm">{result.name}</p>
                    <p className="text-xs text-gray-500 truncate">{result.address}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="py-4">
                <LoadingSpinner message="Please wait..." />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Selected Location */}
            {selectedLocation && !loading && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{address}</p>
                    {deliveryCheck && (
                      <p className={`text-xs mt-1 ${deliveryCheck.available ? 'text-green-600' : 'text-red-600'}`}>
                        {deliveryCheck.available 
                          ? `✓ Delivery available (${deliveryCheck.distance} km)`
                          : deliveryCheck.message
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <Button
              onClick={handleConfirm}
              disabled={!selectedLocation || !deliveryCheck?.available}
              fullWidth
              size="lg"
            >
              Confirm Location
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LocationPicker;
