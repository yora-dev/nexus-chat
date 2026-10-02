import express from 'express';
import {
  sendMessage,
  getMessages,
  toggleReaction,
  deleteMessage
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.get('/:conversationId', getMessages);
router.post('/', upload.array('attachments', 5), sendMessage);
router.post('/:messageId/reaction', toggleReaction);
router.delete('/:messageId', deleteMessage);

export default router;