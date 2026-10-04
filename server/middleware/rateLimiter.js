import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../utils/apiResponse.js';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    return ApiResponse.error(
      res,
      429,
      'Too many requests from this IP. Please try again after 15 minutes.'
    );
  }
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    return ApiResponse.error(
      res,
      429,
      'Too many authentication attempts. Please try again after 15 minutes.'
    );
  }
});