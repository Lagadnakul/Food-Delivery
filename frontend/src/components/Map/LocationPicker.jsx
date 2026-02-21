/**
 * LocationPicker Component
 * 
 * An interactive map component for selecting delivery location
 * by clicking on the map or using current location
 */
import 'leaflet/dist/leaflet.css';
import { Check, Loader2, MapPin, Navigation, Search, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

import { useLocation } from '../../hooks/useLocation';
import { createCustomIcon } from '../../utils/fixLeafletIcon';

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };
const DEFAULT_ZOOM = 13;

/**
 * Component to handle map click events
 */
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    },
  });
  return null;
};

/**
 * Component to animate to location
 */
const FlyToLocation = ({ position, zoom = 16 }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], zoom, { duration: 1 });
    }
  }, [position, zoom, map]);

  return null;
};

/**
 * LocationPicker Props
 * @param {Object} initialPosition - Initial marker position { lat, lng }
 * @param {Function} onLocationChange - Callback when location changes
 * @param {Function} onConfirm - Callback when location is confirmed
 * @param {string} height - Map height
 * @param {boolean} showSearch - Show search input (placeholder - needs geocoding API)
 * @param {string} confirmButtonText - Text for confirm button
 */
const LocationPicker = ({
  initialPosition = null,
  onLocationChange = null,
  onConfirm = null,
  height = '400px',
  showSearch = false,
  confirmButtonText = 'Confirm Location',
}) => {
  const [selectedPosition, setSelectedPosition] = useState(initialPosition);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Use location hook for current location detection
  const {
    location: currentLocation,
    loading: locationLoading,
    error: locationError,
    getLocation,
    isSupported,
  } = useLocation();

  // Create marker icon
  const markerIcon = useMemo(() => createCustomIcon('red'), []);

  // Map center
  const mapCenter = useMemo(() => {
    if (selectedPosition) return selectedPosition;
    if (initialPosition) return initialPosition;
    return DEFAULT_CENTER;
  }, [selectedPosition, initialPosition]);

  // Handle location selection
  const handleLocationSelect = useCallback((position) => {
    setSelectedPosition(position);
    if (onLocationChange) {
      onLocationChange(position);
    }
  }, [onLocationChange]);

  // Use current location
  const handleUseCurrentLocation = useCallback(() => {
    if (isSupported) {
      getLocation();
    }
  }, [isSupported, getLocation]);

  // Update selected position when current location is detected
  useEffect(() => {
    if (currentLocation && !selectedPosition) {
      const position = { lat: currentLocation.lat, lng: currentLocation.lng };
      handleLocationSelect(position);
    }
  }, [currentLocation, selectedPosition, handleLocationSelect]);

  // Handle confirm
  const handleConfirm = useCallback(() => {
    if (selectedPosition && onConfirm) {
      onConfirm(selectedPosition);
    }
  }, [selectedPosition, onConfirm]);

  // Clear selection
  const handleClear = useCallback(() => {
    setSelectedPosition(null);
    if (onLocationChange) {
      onLocationChange(null);
    }
  }, [onLocationChange]);

  // Handle search (placeholder - would need geocoding API)
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Note: In production, integrate with a geocoding API like Nominatim or Google Geocoding
    // For now, this is a placeholder
    setTimeout(() => {
      setIsSearching(false);
      // Show message that search requires geocoding API
      alert('Search requires a geocoding API integration. Click on the map or use current location.');
    }, 500);
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between bg-gray-50 p-3 rounded-xl">
        {/* Search Input */}
        {showSearch && (
          <div className="flex-1 min-w-[200px] flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for address..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
          </div>
        )}

        {/* Current Location Button */}
        <button
          onClick={handleUseCurrentLocation}
          disabled={locationLoading || !isSupported}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
        >
          {locationLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          {locationLoading ? 'Detecting...' : 'Use My Location'}
        </button>

        {/* Clear Button */}
        {selectedPosition && (
          <button
            onClick={handleClear}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear selection"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Location Error */}
      {locationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {locationError}
        </div>
      )}

      {/* Map Container */}
      <div 
        className="relative w-full rounded-xl overflow-hidden shadow-lg border border-gray-200"
        style={{ height }}
      >
        {/* Instruction Overlay */}
        {!selectedPosition && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              Click on the map to select location
            </span>
          </div>
        )}

        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={true}
          className="w-full h-full cursor-crosshair"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onLocationSelect={handleLocationSelect} />

          {selectedPosition && (
            <>
              <FlyToLocation position={selectedPosition} />
              <Marker 
                position={[selectedPosition.lat, selectedPosition.lng]}
                icon={markerIcon}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const { lat, lng } = e.target.getLatLng();
                    handleLocationSelect({ lat, lng });
                  },
                }}
              />
            </>
          )}
        </MapContainer>
      </div>

      {/* Selected Location Info */}
      {selectedPosition && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Selected Coordinates</p>
                <p className="text-sm font-mono text-gray-700">
                  {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
                </p>
              </div>
            </div>

            {onConfirm && (
              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
              >
                <Check className="w-4 h-4" />
                {confirmButtonText}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
