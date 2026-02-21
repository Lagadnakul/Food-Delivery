/**
 * Reusable Map Component for Food Delivery
 * 
 * Features:
 * - OpenStreetMap integration via Leaflet
 * - Restaurant marker
 * - User live location marker
 * - Polyline between restaurant and user
 * - Distance and ETA display
 * - Responsive design
 * - Proper error handling
 */
import 'leaflet/dist/leaflet.css';
import { AlertCircle, Clock, Loader2, MapPin, Navigation, RefreshCw } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';

// Import utilities
import { useLocation } from '../../hooks/useLocation';
import { calculateDeliveryInfo } from '../../utils/calculateDistance';
import { createRestaurantIcon, createUserIcon } from '../../utils/fixLeafletIcon';

// Default coordinates (center of India as fallback)
const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };
const DEFAULT_ZOOM = 13;

/**
 * Component to update map view when center changes
 */
const MapViewUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  
  return null;
};

/**
 * Component to fit bounds when both markers are visible
 */
const FitBounds = ({ restaurantPosition, userPosition }) => {
  const map = useMap();
  
  useEffect(() => {
    if (restaurantPosition && userPosition) {
      const bounds = [
        [restaurantPosition.lat, restaurantPosition.lng],
        [userPosition.lat, userPosition.lng],
      ];
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [restaurantPosition, userPosition, map]);
  
  return null;
};

/**
 * Main Map Component
 * 
 * @param {Object} props
 * @param {Object} props.restaurantPosition - Restaurant coordinates { lat, lng }
 * @param {string} props.restaurantName - Name of the restaurant
 * @param {Object} props.userPosition - Optional user coordinates { lat, lng }
 * @param {boolean} props.showUserLocation - Whether to detect and show user location
 * @param {boolean} props.showPolyline - Whether to show line between points
 * @param {boolean} props.showDeliveryInfo - Whether to show distance/ETA info box
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.height - Map height (default: '400px')
 * @param {number} props.zoom - Initial zoom level
 */
const MapComponent = ({
  restaurantPosition,
  restaurantName = 'Restaurant',
  userPosition: providedUserPosition = null,
  showUserLocation = true,
  showPolyline = true,
  showDeliveryInfo = true,
  className = '',
  height = '400px',
  zoom = DEFAULT_ZOOM,
}) => {
  // Use the geolocation hook
  const {
    location: detectedLocation,
    loading: locationLoading,
    error: locationError,
    getLocation,
    clearError,
    isSupported,
  } = useLocation();

  // Determine the user position to use
  const userPosition = useMemo(() => {
    if (providedUserPosition) {
      return providedUserPosition;
    }
    if (detectedLocation) {
      return { lat: detectedLocation.lat, lng: detectedLocation.lng };
    }
    return null;
  }, [providedUserPosition, detectedLocation]);

  // Calculate delivery info
  const deliveryInfo = useMemo(() => {
    if (restaurantPosition && userPosition) {
      return calculateDeliveryInfo(restaurantPosition, userPosition);
    }
    return null;
  }, [restaurantPosition, userPosition]);

  // Determine map center
  const mapCenter = useMemo(() => {
    if (restaurantPosition) {
      return restaurantPosition;
    }
    if (userPosition) {
      return userPosition;
    }
    return DEFAULT_CENTER;
  }, [restaurantPosition, userPosition]);

  // Create marker icons
  const restaurantIcon = useMemo(() => createRestaurantIcon(), []);
  const userIcon = useMemo(() => createUserIcon(), []);

  // Polyline positions
  const polylinePositions = useMemo(() => {
    if (restaurantPosition && userPosition) {
      return [
        [restaurantPosition.lat, restaurantPosition.lng],
        [userPosition.lat, userPosition.lng],
      ];
    }
    return [];
  }, [restaurantPosition, userPosition]);

  // Auto-detect location on mount if enabled
  useEffect(() => {
    if (showUserLocation && !providedUserPosition && isSupported) {
      getLocation();
    }
  }, [showUserLocation, providedUserPosition, isSupported, getLocation]);

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Map Container */}
      <div 
        className="relative w-full rounded-xl overflow-hidden shadow-lg border border-gray-200"
        style={{ height }}
      >
        {/* Loading Overlay */}
        {locationLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-[1000] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-gray-600">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <span className="text-sm font-medium">Detecting your location...</span>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {locationError && (
          <div className="absolute top-4 left-4 right-4 z-[1000] bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{locationError}</p>
              <button
                onClick={() => {
                  clearError();
                  getLocation();
                }}
                className="mt-2 text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Try again
              </button>
            </div>
          </div>
        )}

        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={zoom}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          {/* OpenStreetMap Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Map view updater */}
          <MapViewUpdater center={mapCenter} zoom={zoom} />

          {/* Fit bounds when both markers present */}
          {restaurantPosition && userPosition && (
            <FitBounds 
              restaurantPosition={restaurantPosition} 
              userPosition={userPosition} 
            />
          )}

          {/* Restaurant Marker */}
          {restaurantPosition && (
            <Marker 
              position={[restaurantPosition.lat, restaurantPosition.lng]}
              icon={restaurantIcon}
            >
              <Popup>
                <div className="text-center">
                  <span className="font-semibold text-gray-800">{restaurantName}</span>
                  <br />
                  <span className="text-xs text-gray-500">Restaurant Location</span>
                </div>
              </Popup>
            </Marker>
          )}

          {/* User Location Marker */}
          {userPosition && (
            <Marker 
              position={[userPosition.lat, userPosition.lng]}
              icon={userIcon}
            >
              <Popup>
                <div className="text-center">
                  <span className="font-semibold text-gray-800">Your Location</span>
                  <br />
                  <span className="text-xs text-gray-500">Delivery Address</span>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Polyline between restaurant and user */}
          {showPolyline && polylinePositions.length === 2 && (
            <Polyline
              positions={polylinePositions}
              color="#f97316"
              weight={3}
              opacity={0.8}
              dashArray="10, 10"
            />
          )}
        </MapContainer>
      </div>

      {/* Delivery Info Box */}
      {showDeliveryInfo && (
        <div className="mt-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Distance */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Distance</p>
                <p className="text-lg font-bold text-gray-800">
                  {deliveryInfo ? deliveryInfo.distanceFormatted : '--'}
                </p>
              </div>
            </div>

            {/* ETA */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Delivery Time</p>
                <p className="text-lg font-bold text-gray-800">
                  {deliveryInfo ? deliveryInfo.etaFormatted : '--'}
                </p>
              </div>
            </div>

            {/* User Location Status */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                userPosition ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Navigation className={`w-5 h-5 ${
                  userPosition ? 'text-blue-600' : 'text-gray-400'
                }`} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Your Location</p>
                <p className={`text-sm font-medium ${
                  userPosition ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {locationLoading ? 'Detecting...' : userPosition ? 'Detected' : 'Not available'}
                </p>
              </div>
            </div>

            {/* Refresh Location Button */}
            <div className="flex items-center">
              <button
                onClick={getLocation}
                disabled={locationLoading}
                className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                {locationLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Update Location
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
