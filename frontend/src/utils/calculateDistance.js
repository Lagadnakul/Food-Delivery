/**
 * Distance and ETA Calculator Utilities
 * 
 * Uses the Haversine formula to calculate the great-circle distance
 * between two points on Earth given their latitude and longitude.
 */

/**
 * Earth's radius in kilometers
 */
const EARTH_RADIUS_KM = 6371;

/**
 * Average delivery speed in km/h for ETA calculations
 */
const AVERAGE_DELIVERY_SPEED_KMH = 25;

/**
 * Converts degrees to radians
 * @param {number} degrees - The angle in degrees
 * @returns {number} - The angle in radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Calculates the distance between two geographic coordinates using Haversine formula
 * 
 * The Haversine formula determines the great-circle distance between two points
 * on a sphere given their longitudes and latitudes.
 * 
 * @param {number} lat1 - Latitude of the first point
 * @param {number} lon1 - Longitude of the first point
 * @param {number} lat2 - Latitude of the second point
 * @param {number} lon2 - Longitude of the second point
 * @returns {number} - Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Validate inputs
  if (!isValidCoordinate(lat1, lon1) || !isValidCoordinate(lat2, lon2)) {
    console.error('Invalid coordinates provided to calculateDistance');
    return null;
  }

  // Convert coordinates to radians
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const radLat1 = toRadians(lat1);
  const radLat2 = toRadians(lat2);

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  const distance = EARTH_RADIUS_KM * c;

  return distance;
};

/**
 * Validates if the given coordinates are valid
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {boolean} - True if coordinates are valid
 */
export const isValidCoordinate = (lat, lon) => {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    !isNaN(lat) &&
    !isNaN(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
};

/**
 * Formats distance for display
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} - Formatted distance string
 */
export const formatDistance = (distanceKm) => {
  if (distanceKm === null || distanceKm === undefined) {
    return 'N/A';
  }

  if (distanceKm < 1) {
    // Convert to meters for distances less than 1km
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }

  // Round to 1 decimal place for km
  return `${distanceKm.toFixed(1)} km`;
};

/**
 * Calculates estimated time of arrival (ETA) based on distance
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} speedKmh - Average speed in km/h (default: 25 km/h)
 * @returns {number|null} - ETA in minutes, or null if invalid
 */
export const calculateETA = (distanceKm, speedKmh = AVERAGE_DELIVERY_SPEED_KMH) => {
  if (distanceKm === null || distanceKm === undefined || speedKmh <= 0) {
    return null;
  }

  // Time = Distance / Speed (in hours), then convert to minutes
  const timeHours = distanceKm / speedKmh;
  const timeMinutes = Math.ceil(timeHours * 60);

  // Add preparation time (5-10 minutes depending on distance)
  const prepTime = distanceKm < 3 ? 10 : 15;

  return timeMinutes + prepTime;
};

/**
 * Formats ETA for display
 * @param {number} etaMinutes - ETA in minutes
 * @returns {string} - Formatted ETA string
 */
export const formatETA = (etaMinutes) => {
  if (etaMinutes === null || etaMinutes === undefined) {
    return 'N/A';
  }

  if (etaMinutes < 60) {
    return `${etaMinutes} min`;
  }

  const hours = Math.floor(etaMinutes / 60);
  const minutes = etaMinutes % 60;

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
};

/**
 * Calculates both distance and ETA in one function
 * @param {Object} from - Origin coordinates { lat, lng }
 * @param {Object} to - Destination coordinates { lat, lng }
 * @returns {Object} - { distance, distanceFormatted, eta, etaFormatted }
 */
export const calculateDeliveryInfo = (from, to) => {
  if (!from || !to) {
    return {
      distance: null,
      distanceFormatted: 'N/A',
      eta: null,
      etaFormatted: 'N/A',
    };
  }

  const distance = calculateDistance(from.lat, from.lng, to.lat, to.lng);
  const eta = calculateETA(distance);

  return {
    distance,
    distanceFormatted: formatDistance(distance),
    eta,
    etaFormatted: formatETA(eta),
  };
};

export default {
  calculateDistance,
  calculateETA,
  calculateDeliveryInfo,
  formatDistance,
  formatETA,
  isValidCoordinate,
};
