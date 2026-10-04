import { body } from 'express-validator';

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_.]+$/)
    .withMessage('Username can only contain alphanumeric characters, underscores, and dots'),
  body('email').trim().isEmail().withMessage('Valid email address is required'), // Removed .normalizeEmail()
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

export const loginValidator = [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];