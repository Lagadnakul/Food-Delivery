/**
 * Fix Leaflet default marker icon issue in Vite/Webpack bundlers
 * 
 * Leaflet's default marker icons break in bundlers because the icon paths
 * are resolved incorrectly. This utility fixes the icon URLs by importing
 * them directly as ES modules.
 */
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Delete the default icon prototype
delete L.Icon.Default.prototype._getIconUrl;

// Merge new icon options with proper paths
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

/**
 * Creates a custom marker icon with specified color
 * @param {string} color - The color of the marker (red, blue, green, orange, etc.)
 * @returns {L.Icon} - A Leaflet Icon object
 */
export const createCustomIcon = (color = 'blue') => {
  const colorMap = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#22c55e',
    orange: '#f97316',
    purple: '#a855f7',
    yellow: '#eab308',
  };

  const markerColor = colorMap[color] || color;

  // Create SVG marker icon
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="32" height="48">
      <path fill="${markerColor}" stroke="#ffffff" stroke-width="1.5" d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z"/>
      <circle fill="#ffffff" cx="12" cy="12" r="5"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker-icon',
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -48],
  });
};

/**
 * Creates a restaurant marker icon
 * @returns {L.DivIcon} - A Leaflet DivIcon for restaurants
 */
export const createRestaurantIcon = () => {
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 50" width="40" height="50">
      <path fill="#ef4444" stroke="#ffffff" stroke-width="2" d="M20 0C8.954 0 0 8.954 0 20c0 15 20 30 20 30s20-15 20-30c0-11.046-8.954-20-20-20z"/>
      <g transform="translate(10, 8)" fill="#ffffff">
        <path d="M4 0v10h2V6h4v4h2V0H4zm2 4V2h4v2H6z"/>
        <path d="M0 12h20v2H0z"/>
        <path d="M8 14h4v6H8z"/>
      </g>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'restaurant-marker-icon',
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });
};

/**
 * Creates a user location marker icon
 * @returns {L.DivIcon} - A Leaflet DivIcon for user location
 */
export const createUserIcon = () => {
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
      <circle fill="#3b82f6" fill-opacity="0.2" cx="20" cy="20" r="20"/>
      <circle fill="#3b82f6" fill-opacity="0.4" cx="20" cy="20" r="12"/>
      <circle fill="#3b82f6" stroke="#ffffff" stroke-width="3" cx="20" cy="20" r="8"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'user-marker-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

export default { createCustomIcon, createRestaurantIcon, createUserIcon };
