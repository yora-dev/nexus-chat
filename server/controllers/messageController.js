import { Message } from '../models/Message.js';
import { Conversation } from '../models/Conversation.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { MESSAGE_TYPES } from '../config/constants.js';

export const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, content, replyTo, mentions } = req.body;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return ApiResponse.error(res, 404, 'Target conversation not found');
  }

  if (!conversation.participants.includes(req.user._id)) {
    return ApiResponse.error(res, 403, 'Forbidden. You are not a member of this chat.');
  }

  const attachments = req.files
    ? req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        fileType: file.mimetype,
        fileName: file.originalname,
        fileSize: file.size
      }))
    : [];

  let messageType = MESSAGE_TYPES.TEXT;
  if (attachments.length > 0) {
    messageType = attachments[0].fileType.startsWith('image/')
      ? MESSAGE_TYPES.IMAGE
      : MESSAGE_TYPES.FILE;
  }

  let message = await Message.create({
    conversation: conversationId,
    sender: req.user._id,
    content: content || '',
    messageType,
    attachments,
    replyTo: replyTo || null,
    mentions: mentions ? JSON.parse(mentions) : [],
    deliveredTo: [req.user._id],
    readBy: [req.user._id]
  });

  message = await Message.findById(message._id)
    .populate('sender', 'name username avatar')
    .populate({
      path: 'replyTo',
      populate: { path: 'sender', select: 'name username' }
    });

  conversation.lastMessage = message._id;
  await conversation.save();

  // Socket Emit via Req App instance
  const io = req.app.get('io');
  if (io) {
    io.to(`conversation:${conversationId}`).emit('message:new', message);
  }

  return ApiResponse.success(res, 201, 'Message sent successfully', { message });
});

export const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const messages = await Message.find({
    conversation: conversationId,
    deletedFor: { $ne: req.user._id }
  })
    .populate('sender', 'name username avatar')
    .populate({
      path: 'replyTo',
      populate: { path: 'sender', select: 'name username' }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return ApiResponse.success(res, 200, 'Messages retrieved', {
    messages: messages.reverse(),
    page,
    hasMore: messages.length === limit
  });
});

export const toggleReaction = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { emoji } = req.body;

  const message = await Message.findById(messageId);
  if (!message) return ApiResponse.error(res, 404, 'Message not found');

  const existingIndex = message.reactions.findIndex(
    (r) => r.user.toString() === req.user._id.toString() && r.emoji === emoji
  );

  if (existingIndex > -1) {
    message.reactions.splice(existingIndex, 1);
  } else {
    message.reactions.push({ user: req.user._id, emoji });
  }

  await message.save();

  const io = req.app.get('io');
  if (io) {
    io.to(`conversation:${message.conversation}`).emit('message:reaction', {
      messageId: message._id,
      reactions: message.reactions
    });
  }

  return ApiResponse.success(res, 200, 'Reaction updated', { reactions: message.reactions });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { deleteForEveryone } = req.body;

  const message = await Message.findById(messageId);
  if (!message) return ApiResponse.error(res, 404, 'Message not found');

  if (deleteForEveryone) {
    if (message.sender.toString() !== req.user._id.toString()) {
      return ApiResponse.error(res, 403, 'You can only delete your own messages for everyone');
    }
    message.isDeletedForEveryone = true;
    message.content = 'This message was deleted';
    message.attachments = [];
    await message.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`conversation:${message.conversation}`).emit('message:delete', {
        messageId: message._id,
        isDeletedForEveryone: true
      });
    }
  } else {
    message.deletedFor.push(req.user._id);
    await message.save();
  }

  return ApiResponse.success(res, 200, 'Message deleted');
});