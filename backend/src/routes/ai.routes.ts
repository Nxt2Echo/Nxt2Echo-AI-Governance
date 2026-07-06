import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';

const router = Router();

// GET /api/ai/insights
router.get('/insights', authenticate, async (_req: Request, res: Response) => {
  const insights = [
    { id: 1, type: 'Pattern', title: 'Pothole complaints spike 340% after monsoon', description: 'AI detected a recurring seasonal pattern. Pre-emptive repair in high-traffic zones recommended.', confidence: 97, department: 'PWD', priority: 'High', action: 'Schedule pre-monsoon road survey', timestamp: '2 hours ago', icon: 'trend' },
    { id: 2, type: 'Duplicate', title: '312 duplicate complaints detected this week', description: 'AI identified 312 semantically duplicate complaints about the same 47 underlying issues. Merging reduces workload by 28%.', confidence: 94, department: 'Multiple', priority: 'Medium', action: 'Merge duplicate complaints', timestamp: '4 hours ago', icon: 'duplicate' },
    { id: 3, type: 'Risk', title: 'BTM Layout sewage overflow — health emergency risk', description: 'Sentiment + frequency model predicts 89% probability of a health emergency in 72h without action.', confidence: 89, department: 'BWSSB', priority: 'Critical', action: 'Deploy emergency repair team', timestamp: '1 hour ago', icon: 'alert' },
    { id: 4, type: 'Efficiency', title: 'BESCOM resolution time improved 41%', description: 'BESCOM reduced average resolution time from 3.2 to 1.9 days over 90 days via AI routing.', confidence: 91, department: 'BESCOM', priority: 'Low', action: 'Share best practices', timestamp: '6 hours ago', icon: 'success' },
  ];
  return res.json({ data: insights });
});

// GET /api/activity
router.get('/', authenticate, async (_req: Request, res: Response) => {
  return res.json({ data: [] });
});

export default router;
