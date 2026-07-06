import { body } from 'express-validator';
import { Role } from '../types';

export const registerValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required'),
  body('role').optional().isIn(Object.values(Role)).withMessage('Invalid role'),
];

export const loginValidator = [
  body('uid').notEmpty().withMessage('Firebase UID is required'),
];
