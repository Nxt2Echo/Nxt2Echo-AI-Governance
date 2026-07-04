import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';

const router = Router();

// GET /api/reports
router.get('/', authenticate, async (_req: Request, res: Response) => {
  const templates = [
    { id: 1, title: 'Executive Summary Report', description: 'High-level overview for Commissioner', type: 'PDF', frequency: 'Weekly', lastGenerated: 'Jun 24, 2024', size: '2.3 MB', category: 'executive' },
    { id: 2, title: 'Department Performance Report', description: 'Dept-wise resolution rates and SLA compliance', type: 'XLSX', frequency: 'Monthly', lastGenerated: 'Jun 01, 2024', size: '4.7 MB', category: 'department' },
    { id: 3, title: 'AI Analysis Report', description: 'AI accuracy, duplicate detection stats, prediction outcomes', type: 'PDF', frequency: 'Weekly', lastGenerated: 'Jun 24, 2024', size: '1.8 MB', category: 'ai' },
    { id: 4, title: 'Critical Issues Report', description: 'All Critical and High priority complaints', type: 'PDF', frequency: 'Daily', lastGenerated: 'Today', size: '0.9 MB', category: 'critical' },
    { id: 5, title: 'Heatmap & Geographic Report', description: 'Zone-wise complaint distribution with visualizations', type: 'PDF', frequency: 'Weekly', lastGenerated: 'Jun 24, 2024', size: '5.2 MB', category: 'heatmap' },
    { id: 6, title: 'Daily Operations Digest', description: 'Snapshot of new, resolved, and escalated complaints in last 24h', type: 'PDF', frequency: 'Daily', lastGenerated: 'Today', size: '0.5 MB', category: 'executive' },
  ];
  return res.json({ data: templates });
});

// GET /api/reports/stats/weekly
router.get('/stats/weekly', authenticate, async (_req: Request, res: Response) => {
  return res.json({
    data: {
      newComplaints: 287,
      resolved: 312,
      escalated: 23,
      avgResolutionTime: '3.4 days',
      topCategory: 'Infrastructure',
      topArea: 'BTM Layout',
      aiAccuracy: '94.2%',
      duplicatesMerged: 47,
    }
  });
});

export default router;
