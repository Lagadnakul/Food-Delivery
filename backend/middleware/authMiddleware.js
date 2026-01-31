import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authorization token required' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    req.user = await userModel.findById(id).select('-password');
    
    if (!req.user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    next();
  } catch (error) {
    console.log('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    res.status(401).json({ 
      success: false, 
      message: 'Unauthorized' 
    });
  }
};