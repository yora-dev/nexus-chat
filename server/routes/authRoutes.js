import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerValidator, loginValidator } from '../validators/authValidator.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authRateLimiter, registerValidator, validate, register);
router.post('/login', authRateLimiter, loginValidator, validate, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;