import express from 'express';
import {
  getDistance,
  reverseGeocode,
  searchAddress,
  getDeliveryEstimate,
} from '../controllers/locationController.js';

const router = express.Router();

// Get distance between restaurant and user
router.get('/distance', getDistance);

// Reverse geocoding - get address from coordinates
router.get('/reverse-geocode', reverseGeocode);

// Search for address/place
router.get('/search', searchAddress);

// Get delivery time estimate
router.get('/estimate', getDeliveryEstimate);

export default router;
