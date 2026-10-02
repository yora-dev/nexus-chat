import { ChatRequest } from '../models/ChatRequest.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const sendChatRequest = asyncHandler(async (req, res) => {
  const { recipientId } = req.body;
  const request = await ChatRequest.create({
    sender: req.user._id,
    recipient: recipientId
  });
  return ApiResponse.success(res, 201, 'Chat request sent', { request });
});