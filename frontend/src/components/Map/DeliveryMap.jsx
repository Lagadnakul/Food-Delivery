import React, { useEffect, useRef, useState } from 'react';
import LocationService from '../../services/locationService';
import LoadingSpinner from '../UI/LoadingSpinner';

const DeliveryMap = ({
  userLocation,
  restaurantLocation,
  showRoute = true,
  height = '300px',
  onDistanceCalculated,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        setLoading(true);
        await LocationService.loadGoogleMapsScript();

        const defaultCenter = restaurantLocation || LocationService.getRestaurantLocation();

        // Initialize map
        const map = new window.google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: 14,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        mapInstanceRef.current = map;

        // Add restaurant marker
        new window.google.maps.Marker({
          position: defaultCenter,
          map,
          title: 'Restaurant',
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
            scaledSize: new window.google.maps.Size(40, 40),
          },
        });

        // Add user marker if location available
        if (userLocation) {
          new window.google.maps.Marker({
            position: userLocation,
            map,
            title: 'Your Location',
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(40, 40),
            },
          });

          // Fit bounds to show both markers
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(defaultCenter);
          bounds.extend(userLocation);
          map.fitBounds(bounds);

          // Draw route if enabled
          if (showRoute) {
            const directionsService = new window.google.maps.DirectionsService();
            const directionsRenderer = new window.google.maps.DirectionsRenderer({
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#f97316',
                strokeWeight: 4,
              },
            });
            directionsRenderer.setMap(map);

            directionsService.route(
              {
                origin: defaultCenter,
                destination: userLocation,
                travelMode: window.google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === 'OK') {
                  directionsRenderer.setDirections(result);
                  
                  // Get distance and duration
                  const route = result.routes[0].legs[0];
                  const info = {
                    distance: route.distance.text,
                    duration: route.duration.text,
                    distanceValue: route.distance.value / 1000,
                    durationValue: Math.ceil(route.duration.value / 60),
                  };
                  setDeliveryInfo(info);
                  
                  if (onDistanceCalculated) {
                    onDistanceCalculated(info);
                  }
                }
              }
            );
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Map initialization error:', err);
        setError(err.message || 'Failed to load map');
        setLoading(false);
      }
    };

    initMap();
  }, [userLocation, restaurantLocation, showRoute, onDistanceCalculated]);

  if (error) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ height }}
      >
        <div className="text-center p-4">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden" style={{ height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <LoadingSpinner message="Loading map..." />
        </div>
      )}
      
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Delivery info overlay */}
      {deliveryInfo && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
              <span className="font-medium text-gray-700">
                {deliveryInfo.distance}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium text-gray-700">
                ~{deliveryInfo.duration}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryMap;
