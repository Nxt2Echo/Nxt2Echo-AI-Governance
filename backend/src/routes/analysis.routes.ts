import { Router } from 'express';
import { AnalysisController } from '../controllers/analysis.controller';
// import { authenticate } from '../middlewares/auth'; // Optional: Use if we want to restrict this to authenticated users

const router = Router();

// Endpoint to check AI engine status
router.get('/', AnalysisController.getAnalysisStatus);

// Endpoint to trigger comprehensive AI analysis
router.post('/analyze', AnalysisController.analyzeComplaint);

export default router;
