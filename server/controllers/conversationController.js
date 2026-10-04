import { Conversation } from '../models/Conversation.js';
import { User } from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { CONVERSATION_TYPES } from '../config/constants.js';

export const getOrCreateDirectConversation = asyncHandler(async (req, res) => {
  const { participantId } = req.body;

  if (!participantId) {
    return ApiResponse.error(res, 400, 'Participant ID is required');
  }

  const targetUser = await User.findById(participantId);
  if (!targetUser) {
    return ApiResponse.error(res, 404, 'Target participant user does not exist');
  }

  let conversation = await Conversation.findOne({
    type: CONVERSATION_TYPES.DIRECT,
    participants: { $all: [req.user._id, participantId] }
  })
    .populate('participants', 'name username avatar isOnline lastSeen')
    .populate({
      path: 'lastMessage',
      populate: { path: 'sender', select: 'name username' }
    });

  if (!conversation) {
    conversation = await Conversation.create({
      type: CONVERSATION_TYPES.DIRECT,
      participants: [req.user._id, participantId],
      unreadCounts: [
        { user: req.user._id, count: 0 },
        { user: participantId, count: 0 }
      ]
    });

    conversation = await Conversation.findById(conversation._id).populate(
      'participants',
      'name username avatar isOnline lastSeen'
    );
  }

  return ApiResponse.success(res, 200, 'Conversation retrieved', { conversation });
});

export const createGroupConversation = asyncHandler(async (req, res) => {
  const { name, participantIds } = req.body;
  let parsedParticipantIds = [];

  if (Array.isArray(participantIds)) {
    parsedParticipantIds = participantIds;
  } else if (typeof participantIds === 'string' && participantIds.trim()) {
    try {
      parsedParticipantIds = JSON.parse(participantIds);
    } catch (error) {
      return ApiResponse.error(res, 400, 'Invalid participant list format');
    }
  }

  if (!name || parsedParticipantIds.length === 0) {
    return ApiResponse.error(res, 400, 'Group name and at least one member are required');
  }

  const allParticipants = Array.from(new Set([...parsedParticipantIds, req.user._id.toString()]));

  const groupImage = req.file ? `/uploads/${req.file.filename}` : '';

  let group = await Conversation.create({
    type: CONVERSATION_TYPES.GROUP,
    name,
    groupImage,
    participants: allParticipants,
    owner: req.user._id,
    groupAdmins: [req.user._id],
    unreadCounts: allParticipants.map((id) => ({ user: id, count: 0 }))
  });

  group = await Conversation.findById(group._id)
    .populate('participants', 'name username avatar isOnline lastSeen')
    .populate('owner', 'name username avatar')
    .populate('groupAdmins', 'name username avatar');

  return ApiResponse.success(res, 201, 'Group created successfully', { conversation: group });
});

export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
    deletedBy: { $ne: req.user._id }
  })
    .populate('participants', 'name username avatar isOnline lastSeen')
    .populate('owner', 'name username avatar')
    .populate('groupAdmins', 'name username avatar')
    .populate({
      path: 'lastMessage',
      populate: { path: 'sender', select: 'name username' }
    })
    .sort({ updatedAt: -1 });

  return ApiResponse.success(res, 200, 'Conversations retrieved', { conversations });
});

export const togglePinConversation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const conversation = await Conversation.findById(id);

  if (!conversation) return ApiResponse.error(res, 404, 'Conversation not found');

  const isPinned = conversation.pinnedBy.includes(req.user._id);
  if (isPinned) {
    conversation.pinnedBy.pull(req.user._id);
  } else {
    conversation.pinnedBy.push(req.user._id);
  }

  await conversation.save();
  return ApiResponse.success(res, 200, `Conversation ${isPinned ? 'unpinned' : 'pinned'}`);
});