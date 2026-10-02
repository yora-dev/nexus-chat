import { ApiResponse } from '../utils/apiResponse.js';

export class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (process.env.NODE_ENV === 'development') {
    console.error('[Error Stack Trace]:', err);
  }

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with ID: ${err.value}`;
    return ApiResponse.error(res, 404, message);
  }

  // Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for field: '${field}'. Please use another value.`;
    return ApiResponse.error(res, 400, message);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => val.message);
    return ApiResponse.error(res, 400, 'Validation Error', errors);
  }

  // JWT Authentication Errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.error(res, 401, 'Invalid authentication token');
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.error(res, 401, 'Authentication token has expired');
  }

  return ApiResponse.error(
    res,
    error.statusCode || 500,
    error.message || 'Internal Server Error'
  );
};