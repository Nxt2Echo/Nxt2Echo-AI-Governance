import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';

const router = Router();

// GET /api/activity
router.get('/', authenticate, async (_req: Request, res: Response) => {
  const feed = [
    { id: 1, action: 'Complaint CMP-011 escalated to Critical', actor: 'AI System', time: '2 min ago', type: 'escalation' },
    { id: 2, action: 'CMP-015 marked as Resolved by BESCOM team', actor: 'Team BESCOM', time: '14 min ago', type: 'resolved' },
    { id: 3, action: '312 duplicate complaints auto-merged', actor: 'AI System', time: '28 min ago', type: 'ai' },
    { id: 4, action: 'New complaint CMP-020 flagged as Critical', actor: 'AI System', time: '45 min ago', type: 'critical' },
    { id: 5, action: 'Weekly report generated and sent to Commissioner', actor: 'System', time: '1 hr ago', type: 'report' },
  ];
  return res.json({ data: feed });
});

export default router;
