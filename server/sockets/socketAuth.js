import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

export const socketAuth = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication token required for Socket connection.'));
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user || user.isBanned) {
      return next(new Error('Unauthorized socket connection. User banned or missing.'));
    }

    socket.user = user;
    next();
  } catch (err) {
    return next(new Error('Invalid socket authentication credentials.'));
  }
};