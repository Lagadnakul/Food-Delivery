import express from 'express';
import {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import * as userService from '../services/userService.js';

const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/register', registerUser);

// ─── Admin Login ────────────────────────────────────────────────────────────
// Returns a token only if the user has isAdmin: true
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const { user, token } = await userService.loginUser(email, password);

    if (!user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied. Not an admin account.' });
    }

    res.json({
      success: true,
      token,
      admin: { name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message || 'Invalid credentials' });
  }
});

// Protected routes
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

// Address routes
router.post('/addresses', authMiddleware, addAddress);
router.put('/addresses/:addressId', authMiddleware, updateAddress);
router.delete('/addresses/:addressId', authMiddleware, deleteAddress);
router.put('/addresses/:addressId/default', authMiddleware, setDefaultAddress);

export default router;