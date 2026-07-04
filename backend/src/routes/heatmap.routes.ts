import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';

const router = Router();

// GET /api/heatmap/zones
router.get('/zones', authenticate, async (_req: Request, res: Response) => {
  const zones = [
    { id: 1, name: 'BTM Layout', risk: 'Critical', complaints: 147, category: 'Sanitation', lat: 12.9166, lng: 77.6101, trend: '+23%' },
    { id: 2, name: 'Whitefield', risk: 'High', complaints: 98, category: 'Water Supply', lat: 12.9698, lng: 77.7499, trend: '+12%' },
    { id: 3, name: 'Koramangala', risk: 'High', complaints: 87, category: 'Infrastructure', lat: 12.9352, lng: 77.6245, trend: '+8%' },
    { id: 4, name: 'Indiranagar', risk: 'Medium', complaints: 63, category: 'Electricity', lat: 12.9784, lng: 77.6408, trend: '-5%' },
    { id: 5, name: 'HSR Layout', risk: 'Medium', complaints: 54, category: 'Sanitation', lat: 12.9116, lng: 77.6474, trend: '+3%' },
    { id: 6, name: 'Electronic City', risk: 'Medium', complaints: 48, category: 'Electricity', lat: 12.8399, lng: 77.6770, trend: '-12%' },
    { id: 7, name: 'Jayanagar', risk: 'Low', complaints: 32, category: 'Infrastructure', lat: 12.9299, lng: 77.5933, trend: '-8%' },
    { id: 8, name: 'Basavanagudi', risk: 'Low', complaints: 28, category: 'Public Safety', lat: 12.9422, lng: 77.5738, trend: '-15%' },
    { id: 9, name: 'Malleswaram', risk: 'Low', complaints: 21, category: 'Public Spaces', lat: 13.0035, lng: 77.5689, trend: '-3%' },
  ];
  return res.json({ data: zones });
});

export default router;
