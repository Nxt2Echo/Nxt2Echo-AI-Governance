import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import { ComplaintService } from '../services/complaint.service';

const router = Router();

// ─── Dashboard Stats ───────────────────────────────────────────────────────────
// GET /api/dashboard/stats  (used by frontend fetchDashboardStats)
router.get('/stats', authenticate, async (_req: Request, res: Response) => {
  try {
    const stats = await ComplaintService.getDashboardStats();
    return res.json({
      success: true,
      data: {
        total: stats.total,
        byStatus: stats.byStatus,
        byCategory: stats.byCategory,
        byWard: stats.byWard
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load stats' });
  }
});

export default router;
