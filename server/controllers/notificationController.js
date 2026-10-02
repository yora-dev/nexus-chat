import { Notification } from '../models/Notification.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate('sender', 'name username avatar')
    .sort({ createdAt: -1 })
    .limit(30);

  return ApiResponse.success(res, 200, 'Notifications retrieved', { notifications });
});