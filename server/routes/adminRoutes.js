import express from 'express';
import { getAdminStats, toggleUserBan } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.patch('/users/:userId/ban', toggleUserBan);

export default router;