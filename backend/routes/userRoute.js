import express from 'express';
import { 
  loginUser, 
  registerUser, 
  getUserProfile, 
  updateUserProfile, 
  addAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress,
  logoutUser,
  verifyToken,
  changePassword
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/register', registerUser);

// Protected routes
router.post('/logout', authMiddleware, logoutUser);
router.get('/verify', authMiddleware, verifyToken);
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.put('/change-password', authMiddleware, changePassword);

// Address routes
router.post('/addresses', authMiddleware, addAddress);
router.put('/addresses/:addressId', authMiddleware, updateAddress);
router.delete('/addresses/:addressId', authMiddleware, deleteAddress);
router.put('/addresses/:addressId/default', authMiddleware, setDefaultAddress);

export default router;