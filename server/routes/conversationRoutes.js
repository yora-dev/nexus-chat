import express from 'express';
import {
  getOrCreateDirectConversation,
  createGroupConversation,
  getConversations,
  togglePinConversation
} from '../controllers/conversationController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.get('/', getConversations);
router.post('/direct', getOrCreateDirectConversation);
router.post('/group', upload.single('groupImage'), createGroupConversation);
router.patch('/:id/pin', togglePinConversation);

export default router;