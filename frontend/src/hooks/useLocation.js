/**
 * Custom hook for handling user geolocation
 * 
 * Features:
 * - Live location detection using navigator.geolocation
 * - Permission handling
 * - Loading and error states
 * - Cleanup to prevent memory leaks
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Geolocation error messages mapped to user-friendly strings
 */
const ERROR_MESSAGES = {
  PERMISSION_DENIED: 'Location permission was denied. Please enable location access in your browser settings.',
  POSITION_UNAVAILABLE: 'Location information is unavailable. Please try again.',
  TIMEOUT: 'Location request timed out. Please try again.',
  NOT_SUPPORTED: 'Geolocation is not supported by your browser.',
  UNKNOWN: 'An unknown error occurred while getting your location.',
};

/**
 * Default geolocation options
 */
const DEFAULT_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000, // 10 seconds
  maximumAge: 60000, // 1 minute cache
};

/**
 * Custom hook to get user's current location
 * @param {Object} options - Geolocation options
 * @param {boolean} options.enableHighAccuracy - Use GPS for better accuracy
 * @param {number} options.timeout - Maximum time to wait for location
 * @param {number} options.maximumAge - Maximum age of cached location
 * @param {boolean} options.watch - Whether to watch for location changes
 * @returns {Object} - { location, loading, error, getLocation, clearError }
 */
export const useLocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  
  // Ref to store watch ID for cleanup
  const watchIdRef = useRef(null);
  // Ref to track component mount status
  const isMountedRef = useRef(true);

  const mergedOptions = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);

  /**
   * Maps geolocation error code to user-friendly message
   * @param {GeolocationPositionError} geoError - The geolocation error
   * @returns {string} - User-friendly error message
   */
  const getErrorMessage = useCallback((geoError) => {
    switch (geoError.code) {
      case geoError.PERMISSION_DENIED:
        return ERROR_MESSAGES.PERMISSION_DENIED;
      case geoError.POSITION_UNAVAILABLE:
        return ERROR_MESSAGES.POSITION_UNAVAILABLE;
      case geoError.TIMEOUT:
        return ERROR_MESSAGES.TIMEOUT;
      default:
        return ERROR_MESSAGES.UNKNOWN;
    }
  }, []);

  /**
   * Success callback for geolocation
   * @param {GeolocationPosition} position - The position object
   */
  const handleSuccess = useCallback((position) => {
    if (!isMountedRef.current) return;

    const { latitude, longitude, accuracy, altitude, heading, speed } = position.coords;

    setLocation({
      lat: latitude,
      lng: longitude,
      accuracy,
      altitude,
      heading,
      speed,
      timestamp: position.timestamp,
    });
    setLoading(false);
    setError(null);
  }, []);

  /**
   * Error callback for geolocation
   * @param {GeolocationPositionError} geoError - The error object
   */
  const handleError = useCallback((geoError) => {
    if (!isMountedRef.current) return;

    setError(getErrorMessage(geoError));
    setLoading(false);
  }, [getErrorMessage]);

  /**
   * Get user's current location (one-time)
   */
  const getLocation = useCallback(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError(ERROR_MESSAGES.NOT_SUPPORTED);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      mergedOptions
    );
  }, [handleSuccess, handleError, mergedOptions]);

  /**
   * Start watching user's location
   */
  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError(ERROR_MESSAGES.NOT_SUPPORTED);
      return;
    }

    // Clear any existing watch
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    setLoading(true);
    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      mergedOptions
    );
  }, [handleSuccess, handleError, mergedOptions]);

  /**
   * Stop watching user's location
   */
  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  /**
   * Clear the error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Check and update permission status
   */
  const checkPermission = useCallback(async () => {
    if (!navigator.permissions) {
      return null;
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setPermissionStatus(result.state);

      // Listen for permission changes
      result.addEventListener('change', () => {
        if (isMountedRef.current) {
          setPermissionStatus(result.state);
        }
      });

      return result.state;
    } catch (err) {
      console.warn('Permission API not fully supported:', err);
      return null;
    }
  }, []);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      stopWatching();
    };
  }, [stopWatching]);

  return {
    location,
    loading,
    error,
    permissionStatus,
    getLocation,
    startWatching,
    stopWatching,
    clearError,
    isSupported: !!navigator.geolocation,
  };
};

export default useLocation;
