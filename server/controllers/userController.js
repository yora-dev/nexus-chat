import { User } from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, status } = req.body;
  const updateData = {};

  if (name) updateData.name = name;
  if (bio !== undefined) updateData.bio = bio;
  if (status !== undefined) updateData.status = status;

  if (req.file) {
    updateData.avatar = `/uploads/${req.file.filename}`;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true
  });

  return ApiResponse.success(res, 200, 'Profile updated successfully', { user: updatedUser });
});

export const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length === 0) {
    return ApiResponse.success(res, 200, 'Search query empty', { users: [] });
  }

  const searchRegex = new RegExp(q.trim(), 'i');

  const users = await User.find({
    _id: { $ne: req.user._id },
    isBanned: false,
    $or: [{ username: searchRegex }, { name: searchRegex }, { email: searchRegex }]
  })
    .select('name username email avatar status isOnline lastSeen')
    .limit(20);

  return ApiResponse.success(res, 200, 'Users query matched', { users });
});

export const getUserByUsername = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username.toLowerCase() }).select(
    '-password'
  );

  if (!user) {
    return ApiResponse.error(res, 404, 'User not found');
  }

  return ApiResponse.success(res, 200, 'User profile retrieved', { user });
});