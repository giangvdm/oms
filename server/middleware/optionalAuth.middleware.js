import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const optionalAuth = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-passwordHash');
      
      // Continue even if user not found (this is optional auth)
    } catch (error) {
      console.log('Optional auth token invalid:', error.message);
      // Continue without setting req.user
    }
  }

  // Always call next() regardless of whether auth succeeded
  next();
};