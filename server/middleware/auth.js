import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ROLES } from '../config/constants.js';

export const protect = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return ApiResponse.error(res, 401, 'Access denied. Authentication token missing.');
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return ApiResponse.error(res, 401, 'User associated with this token no longer exists.');
    }

    if (user.isBanned) {
      return ApiResponse.error(res, 403, 'Your account has been suspended by an administrator.');
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.error(res, 401, 'Invalid or expired authentication token.');
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return ApiResponse.error(res, 403, 'Permission denied. Insufficient role privileges.');
    }
    next();
  };
};

export const adminOnly = authorize(ROLES.ADMIN);