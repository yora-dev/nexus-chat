import express from 'express';
import { updateProfile, searchUsers, getUserByUsername } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.put('/profile', upload.single('avatar'), updateProfile);
router.get('/search', searchUsers);
router.get('/:username', getUserByUsername);

export default router;