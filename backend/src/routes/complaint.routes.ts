import { Router } from 'express';
import { ComplaintController } from '../controllers/complaint.controller';
import { createComplaintValidator, updateComplaintValidator } from '../validators/complaint.validator';
import { authenticate, authorize } from '../middlewares/auth';
import { upload } from '../middlewares/upload';
import { Role } from '../types';

const router = Router();

// Apply authentication middleware to all complaint routes
router.use(authenticate);

// --- Static / named routes MUST come before dynamic /:id routes ---

router.post(
  '/',
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'voice', maxCount: 1 }]),
  createComplaintValidator,
  ComplaintController.createComplaint
);

// Gemini utility route (POST — must be before PUT /:id)
router.post('/analyze', authorize([Role.ADMIN, Role.OFFICER]), ComplaintController.analyze);

router.get('/', ComplaintController.getComplaints);

// Admin stats — must be before GET /:id so Express does not capture 'dashboard' as an id param
router.get('/dashboard/stats', authorize([Role.ADMIN, Role.OFFICER]), ComplaintController.getDashboardStats);

// Heatmap — must be before GET /:id so Express does not capture 'heatmap' as an id param
router.get('/heatmap', ComplaintController.getHeatmapData);

// --- Dynamic /:id routes come LAST ---

router.get('/:id', ComplaintController.getComplaintById);

// Update/Delete routes restricted to specific roles.
// Admin can update/delete any; Citizen can update their own (ownership check is in service layer).
router.put(
  '/:id',
  authorize([Role.ADMIN, Role.CITIZEN]),
  updateComplaintValidator,
  ComplaintController.updateComplaint
);

router.delete(
  '/:id',
  authorize([Role.ADMIN, Role.OFFICER]),
  ComplaintController.deleteComplaint
);

export default router;
