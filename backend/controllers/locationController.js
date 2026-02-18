import axios from 'axios';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Get distance using Google Distance Matrix API
export const getDistance = async (req, res) => {
  try {
    const { userLat, userLng, restaurantLat, restaurantLng } = req.query;

    // Validate coordinates
    if (!userLat || !userLng || !restaurantLat || !restaurantLng) {
      return res.status(400).json({
        success: false,
        message: 'Missing coordinates',
      });
    }

    // If Google Maps API key is not configured, use Haversine formula
    if (!GOOGLE_MAPS_API_KEY) {
      const distance = calculateHaversineDistance(
        parseFloat(restaurantLat),
        parseFloat(restaurantLng),
        parseFloat(userLat),
        parseFloat(userLng)
      );

      return res.json({
        success: true,
        distance: Math.round(distance * 10) / 10,
        duration: Math.round((distance / 25) * 60), // Assume 25 km/h average speed
        method: 'haversine',
      });
    }

    // Call Google Distance Matrix API
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/distancematrix/json',
      {
        params: {
          origins: `${restaurantLat},${restaurantLng}`,
          destinations: `${userLat},${userLng}`,
          mode: 'driving',
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    const data = response.data;

    if (data.status !== 'OK') {
      throw new Error(`Distance Matrix API error: ${data.status}`);
    }

    const element = data.rows[0].elements[0];

    if (element.status !== 'OK') {
      throw new Error(`Route error: ${element.status}`);
    }

    res.json({
      success: true,
      distance: Math.round((element.distance.value / 1000) * 10) / 10, // km
      duration: Math.round(element.duration.value / 60), // minutes
      distanceText: element.distance.text,
      durationText: element.duration.text,
      method: 'google',
    });
  } catch (error) {
    console.error('Distance calculation error:', error);
    
    // Fallback to Haversine if Google API fails
    const { userLat, userLng, restaurantLat, restaurantLng } = req.query;
    const distance = calculateHaversineDistance(
      parseFloat(restaurantLat),
      parseFloat(restaurantLng),
      parseFloat(userLat),
      parseFloat(userLng)
    );

    res.json({
      success: true,
      distance: Math.round(distance * 10) / 10,
      duration: Math.round((distance / 25) * 60),
      method: 'haversine',
    });
  }
};

// Reverse geocoding - get address from coordinates
export const reverseGeocode = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Missing coordinates',
      });
    }

    if (!GOOGLE_MAPS_API_KEY) {
      return res.json({
        success: false,
        message: 'Geocoding not configured',
      });
    }

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          latlng: `${lat},${lng}`,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    const data = response.data;

    if (data.status !== 'OK' || !data.results.length) {
      return res.json({
        success: false,
        message: 'No address found',
      });
    }

    const result = data.results[0];
    
    // Extract address components
    const addressComponents = {};
    result.address_components.forEach((component) => {
      component.types.forEach((type) => {
        addressComponents[type] = component.long_name;
      });
    });

    res.json({
      success: true,
      address: result.formatted_address,
      components: {
        street: addressComponents.route || '',
        area: addressComponents.sublocality_level_1 || addressComponents.locality || '',
        city: addressComponents.administrative_area_level_2 || '',
        state: addressComponents.administrative_area_level_1 || '',
        country: addressComponents.country || '',
        postalCode: addressComponents.postal_code || '',
      },
      placeId: result.place_id,
    });
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    res.status(500).json({
      success: false,
      message: 'Geocoding failed',
    });
  }
};

// Search for address/place
export const searchAddress = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query required',
      });
    }

    if (!GOOGLE_MAPS_API_KEY) {
      return res.json({
        success: false,
        message: 'Address search not configured',
        results: [],
      });
    }

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      {
        params: {
          query,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    const data = response.data;

    if (data.status !== 'OK') {
      return res.json({
        success: true,
        results: [],
      });
    }

    const results = data.results.slice(0, 5).map((place) => ({
      name: place.name,
      address: place.formatted_address,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      placeId: place.place_id,
    }));

    res.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Address search error:', error);
    res.status(500).json({
      success: false,
      message: 'Address search failed',
      results: [],
    });
  }
};

// Calculate delivery time estimate
export const getDeliveryEstimate = async (req, res) => {
  try {
    const { userLat, userLng } = req.query;
    const restaurantLat = process.env.RESTAURANT_LAT || 19.076;
    const restaurantLng = process.env.RESTAURANT_LNG || 72.8777;

    // Get distance
    let distance;
    let duration;

    if (GOOGLE_MAPS_API_KEY) {
      try {
        const response = await axios.get(
          'https://maps.googleapis.com/maps/api/distancematrix/json',
          {
            params: {
              origins: `${restaurantLat},${restaurantLng}`,
              destinations: `${userLat},${userLng}`,
              mode: 'driving',
              key: GOOGLE_MAPS_API_KEY,
            },
          }
        );

        const element = response.data.rows[0].elements[0];
        if (element.status === 'OK') {
          distance = element.distance.value / 1000;
          duration = element.duration.value / 60;
        }
      } catch (e) {
        // Fall through to Haversine
      }
    }

    if (!distance) {
      distance = calculateHaversineDistance(
        parseFloat(restaurantLat),
        parseFloat(restaurantLng),
        parseFloat(userLat),
        parseFloat(userLng)
      );
      duration = (distance / 25) * 60;
    }

    // Calculate total delivery time
    const preparationTime = 15; // minutes
    const travelTime = Math.ceil(duration);
    const bufferTime = 5;
    const totalTime = preparationTime + travelTime + bufferTime;

    res.json({
      success: true,
      estimate: {
        distance: Math.round(distance * 10) / 10,
        preparationTime,
        travelTime,
        totalTime,
        formattedTime: formatDeliveryTime(totalTime),
      },
    });
  } catch (error) {
    console.error('Delivery estimate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate delivery estimate',
    });
  }
};

// Helper: Calculate Haversine distance
function calculateHaversineDistance(lat1, lng1, lat2, lng2) {
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
  return R * c;
}

// Helper: Format delivery time
function formatDeliveryTime(minutes) {
  if (minutes < 60) {
    return `${minutes}-${minutes + 10} mins`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${mins} mins`;
}
