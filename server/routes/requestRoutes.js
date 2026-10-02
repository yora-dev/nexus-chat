import express from 'express';
import { sendChatRequest } from '../controllers/requestController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.post('/', sendChatRequest);

export default router;