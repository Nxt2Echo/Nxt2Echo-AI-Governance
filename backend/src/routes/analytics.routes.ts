import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import { ComplaintService } from '../services/complaint.service';

const router = Router();

// GET /api/analytics/complaint-trend
router.get('/complaint-trend', authenticate, async (_req: Request, res: Response) => {
  try {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const data = months.map(month => ({
      month,
      complaints: Math.floor(Math.random() * 200 + 280),
      resolved: Math.floor(Math.random() * 180 + 250),
    }));
    return res.json({ data });
  } catch {
    return res.status(500).json({ message: 'Failed to load trend data' });
  }
});

// GET /api/analytics/categories
router.get('/categories', authenticate, async (_req: Request, res: Response) => {
  try {
    const complaints = await ComplaintService.getComplaints();
    const counts: Record<string, number> = {};
    complaints.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    const colors = ['#6366f1','#22d3ee','#3b82f6','#f59e0b','#ef4444','#10b981','#8b5cf6','#f97316'];
    const data = Object.entries(counts).map(([name, value], i) => ({
      name, value, color: colors[i % colors.length]
    }));
    return res.json({ data });
  } catch {
    return res.status(500).json({ message: 'Failed to load category data' });
  }
});

// GET /api/analytics/departments
router.get('/departments', authenticate, async (_req: Request, res: Response) => {
  const depts = [
    { name: 'BBMP', total: 1876, resolved: 1654, rate: 88.2, avgDays: 2.8 },
    { name: 'BWSSB', total: 892, resolved: 743, rate: 83.3, avgDays: 4.1 },
    { name: 'BESCOM', total: 734, resolved: 689, rate: 93.9, avgDays: 1.9 },
    { name: 'PWD', total: 621, resolved: 512, rate: 82.4, avgDays: 5.3 },
    { name: 'KSPCB', total: 312, resolved: 267, rate: 85.6, avgDays: 3.4 },
  ];
  return res.json({ data: depts });
});

// GET /api/analytics/sentiment
router.get('/sentiment', authenticate, async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string || '8', 10);
    const complaints = await ComplaintService.getComplaints();
    const mapped = complaints.slice(0, limit).map(c => ({
      ...c,
      sentiment: (c as any).sentiment || 'Neutral',
      aiScore: (c as any).priorityScore || 5,
      risk: ((c as any).priorityScore || 5) / 10,
    }));
    return res.json({ data: mapped });
  } catch {
    return res.status(500).json({ message: 'Failed to load sentiment data' });
  }
});

export default router;
