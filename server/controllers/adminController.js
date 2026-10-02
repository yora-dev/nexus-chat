import { User } from '../models/User.js';
import { Message } from '../models/Message.js';
import { Conversation } from '../models/Conversation.js';
import { Report } from '../models/Report.js';
import { AuditLog } from '../models/AuditLog.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isOnline: true });
  const totalMessages = await Message.countDocuments();
  const totalConversations = await Conversation.countDocuments();
  const pendingReports = await Report.countDocuments({ status: 'pending' });

  return ApiResponse.success(res, 200, 'Admin metrics loaded', {
    stats: { totalUsers, activeUsers, totalMessages, totalConversations, pendingReports }
  });
});

export const toggleUserBan = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) return ApiResponse.error(res, 404, 'User not found');

  user.isBanned = !user.isBanned;
  await user.save();

  await AuditLog.create({
    admin: req.user._id,
    action: user.isBanned ? 'BAN_USER' : 'UNBAN_USER',
    targetUser: userId
  });

  return ApiResponse.success(
    res,
    200,
    `User ${user.username} has been ${user.isBanned ? 'banned' : 'unbanned'}.`
  );
});