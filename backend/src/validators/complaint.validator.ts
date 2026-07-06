import { body } from 'express-validator';
import { Category } from '../types';

export const createComplaintValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(Object.values(Category)).withMessage('Invalid category'),
  body('severity').notEmpty().withMessage('Severity is required'),
  body('latitude').isNumeric().withMessage('Valid latitude is required'),
  body('longitude').isNumeric().withMessage('Valid longitude is required'),
  body('ward').notEmpty().withMessage('Ward is required'),
  body('address').notEmpty().withMessage('Address is required'),
];

export const updateComplaintValidator = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('category').optional().isIn(Object.values(Category)).withMessage('Invalid category'),
  body('severity').optional().notEmpty().withMessage('Severity cannot be empty'),
  body('latitude').optional().isNumeric().withMessage('Valid latitude is required'),
  body('longitude').optional().isNumeric().withMessage('Valid longitude is required'),
  body('ward').optional().notEmpty().withMessage('Ward cannot be empty'),
  body('address').optional().notEmpty().withMessage('Address cannot be empty'),
  body('status').optional().notEmpty().withMessage('Status cannot be empty'),
];
