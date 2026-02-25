import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import { UnauthorizedError } from '../utils/errors.js';

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authorization token required');
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    req.user = await userModel.findById(id).select('-password');
    
    if (!req.user) {
      throw new UnauthorizedError('User not found');
    }
    
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return next(error);
    }
    
    console.log('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('Invalid token'));
    }
    
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Token expired'));
    }
    
    next(new UnauthorizedError('Unauthorized'));
  }
};