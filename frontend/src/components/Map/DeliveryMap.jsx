/**
 * DeliveryMap Component
 * 
 * A specialized map component for showing delivery tracking
 * with real-time updates, route visualization, and ETA
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { MapPin, Navigation, Clock, Package, RefreshCw, Loader2, Truck } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

import { createRestaurantIcon, createUserIcon, createCustomIcon } from '../../utils/fixLeafletIcon';
import { calculateDeliveryInfo } from '../../utils/calculateDistance';

const DEFAULT_ZOOM = 14;

/**
 * Component to automatically fit map bounds to show all markers
 */
const AutoFitBounds = ({ positions }) => {
  const map = useMap();

  useEffect(() => {
    if (positions.length >= 2) {
      const bounds = positions.map(pos => [pos.lat, pos.lng]);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    }
  }, [positions, map]);

  return null;
};

/**
 * Animate map to center
 */
const AnimateToCenter = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], map.getZoom(), {
        duration: 1,
      });
    }
  }, [center, map]);

  return null;
};

/**
 * DeliveryMap Component Props
 * @param {Object} restaurantPosition - Restaurant coordinates { lat, lng }
 * @param {string} restaurantName - Restaurant name
 * @param {Object} userPosition - User/delivery coordinates { lat, lng }
 * @param {Object} driverPosition - Driver's current position { lat, lng }
 * @param {string} orderStatus - Current order status
 * @param {string} height - Map height
 * @param {boolean} showRoute - Whether to show route polyline
 * @param {Function} onRefresh - Callback to refresh positions
 */
const DeliveryMap = ({
  restaurantPosition,
  restaurantName = 'Restaurant',
  userPosition,
  driverPosition = null,
  orderStatus = 'preparing',
  height = '350px',
  showRoute = true,
  onRefresh = null,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Create marker icons
  const restaurantIcon = useMemo(() => createRestaurantIcon(), []);
  const userIcon = useMemo(() => createUserIcon(), []);
  const driverIcon = useMemo(() => createCustomIcon('green'), []);

  // Calculate delivery info
  const deliveryInfo = useMemo(() => {
    const from = driverPosition || restaurantPosition;
    if (from && userPosition) {
      return calculateDeliveryInfo(from, userPosition);
    }
    return null;
  }, [restaurantPosition, userPosition, driverPosition]);

  // Get positions for bounds fitting
  const allPositions = useMemo(() => {
    const positions = [];
    if (restaurantPosition) positions.push(restaurantPosition);
    if (userPosition) positions.push(userPosition);
    if (driverPosition) positions.push(driverPosition);
    return positions;
  }, [restaurantPosition, userPosition, driverPosition]);

  // Route polyline positions
  const routePositions = useMemo(() => {
    if (!showRoute) return [];
    
    const positions = [];
    if (restaurantPosition) {
      positions.push([restaurantPosition.lat, restaurantPosition.lng]);
    }
    if (driverPosition) {
      positions.push([driverPosition.lat, driverPosition.lng]);
    }
    if (userPosition) {
      positions.push([userPosition.lat, userPosition.lng]);
    }
    return positions;
  }, [restaurantPosition, userPosition, driverPosition, showRoute]);

  // Map center
  const mapCenter = useMemo(() => {
    if (driverPosition) return driverPosition;
    if (restaurantPosition) return restaurantPosition;
    if (userPosition) return userPosition;
    return { lat: 20.5937, lng: 78.9629 };
  }, [restaurantPosition, userPosition, driverPosition]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  }, [onRefresh]);

  // Status info
  const statusInfo = useMemo(() => {
    const statusMap = {
      pending: { label: 'Order Pending', color: 'text-yellow-600', bg: 'bg-yellow-100' },
      confirmed: { label: 'Order Confirmed', color: 'text-blue-600', bg: 'bg-blue-100' },
      preparing: { label: 'Preparing', color: 'text-orange-600', bg: 'bg-orange-100' },
      ready: { label: 'Ready for Pickup', color: 'text-purple-600', bg: 'bg-purple-100' },
      'out-for-delivery': { label: 'Out for Delivery', color: 'text-green-600', bg: 'bg-green-100' },
      delivered: { label: 'Delivered', color: 'text-green-700', bg: 'bg-green-200' },
    };
    return statusMap[orderStatus] || statusMap.pending;
  }, [orderStatus]);

  return (
    <div className="flex flex-col gap-4">
      {/* Map */}
      <div 
        className="relative w-full rounded-xl overflow-hidden shadow-lg border border-gray-200"
        style={{ height }}
      >
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <AutoFitBounds positions={allPositions} />

          {/* Restaurant Marker */}
          {restaurantPosition && (
            <Marker 
              position={[restaurantPosition.lat, restaurantPosition.lng]}
              icon={restaurantIcon}
            >
              <Popup>
                <div className="text-center p-1">
                  <span className="font-semibold text-gray-800">{restaurantName}</span>
                  <br />
                  <span className="text-xs text-gray-500">Pickup Location</span>
                </div>
              </Popup>
            </Marker>
          )}

          {/* User/Delivery Marker */}
          {userPosition && (
            <Marker 
              position={[userPosition.lat, userPosition.lng]}
              icon={userIcon}
            >
              <Popup>
                <div className="text-center p-1">
                  <span className="font-semibold text-gray-800">Delivery Address</span>
                  <br />
                  <span className="text-xs text-gray-500">Your Location</span>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Driver Marker */}
          {driverPosition && (
            <Marker 
              position={[driverPosition.lat, driverPosition.lng]}
              icon={driverIcon}
            >
              <Popup>
                <div className="text-center p-1">
                  <span className="font-semibold text-gray-800">Delivery Partner</span>
                  <br />
                  <span className="text-xs text-green-600">On the way</span>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Route Polyline */}
          {routePositions.length >= 2 && (
            <Polyline
              positions={routePositions}
              color="#f97316"
              weight={4}
              opacity={0.7}
              dashArray="8, 12"
            />
          )}
        </MapContainer>

        {/* Status Badge */}
        <div className={`absolute top-4 left-4 z-[1000] ${statusInfo.bg} px-3 py-1.5 rounded-full shadow-md`}>
          <span className={`text-sm font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Refresh Button */}
        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="absolute top-4 right-4 z-[1000] bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Delivery Info Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Status */}
        <div className={`${statusInfo.bg} rounded-xl p-3 flex items-center gap-3`}>
          <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
            <Package className={`w-5 h-5 ${statusInfo.color}`} />
          </div>
          <div>
            <p className="text-xs text-gray-600">Status</p>
            <p className={`text-sm font-semibold ${statusInfo.color}`}>{statusInfo.label}</p>
          </div>
        </div>

        {/* Distance */}
        <div className="bg-orange-50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-gray-600">Distance</p>
            <p className="text-sm font-semibold text-gray-800">
              {deliveryInfo?.distanceFormatted || '--'}
            </p>
          </div>
        </div>

        {/* ETA */}
        <div className="bg-green-50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-600">Est. Delivery</p>
            <p className="text-sm font-semibold text-gray-800">
              {deliveryInfo?.etaFormatted || '--'}
            </p>
          </div>
        </div>

        {/* Driver */}
        <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Truck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-600">Driver</p>
            <p className="text-sm font-semibold text-gray-800">
              {driverPosition ? 'Assigned' : 'Pending'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;
