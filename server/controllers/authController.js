import { User } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return ApiResponse.error(res, 400, 'An account with this email address already exists.');
  }

  const existingUsername = await User.findOne({ username: username.toLowerCase() });
  if (existingUsername) {
    return ApiResponse.error(res, 400, 'This username is already taken.');
  }

  const user = await User.create({
    name,
    username: username.toLowerCase(),
    email,
    password
  });

  const token = generateToken(user._id, user.role);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return ApiResponse.success(res, 201, 'Account registered successfully', {
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      bio: user.bio,
      status: user.status
    },
    token
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return ApiResponse.error(res, 401, 'Invalid email or password credentials.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return ApiResponse.error(res, 401, 'Invalid email or password credentials.');
  }

  if (user.isBanned) {
    return ApiResponse.error(res, 403, 'Account suspended. Contact platform administrator.');
  }

  user.isOnline = true;
  await user.save();

  const token = generateToken(user._id, user.role);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return ApiResponse.success(res, 200, 'Logged in successfully', {
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      bio: user.bio,
      status: user.status
    },
    token
  });
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { isOnline: false, lastSeen: new Date() });
  }

  res.clearCookie('token');
  return ApiResponse.success(res, 200, 'Logged out successfully');
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return ApiResponse.success(res, 200, 'Authenticated user profile retrieved', { user });
});