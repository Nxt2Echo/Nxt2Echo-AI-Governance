import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ComplaintService } from '../services/complaint.service';
import { GeminiService } from '../services/gemini.service';
import { StorageService } from '../services/storage.service';
import { AuthRequest } from '../middlewares/auth';
import { Status } from '../types';

export class ComplaintController {
  static async createComplaint(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      let imageUrl = '';
      let voiceUrl = '';

      if (files?.image && files.image[0]) {
        imageUrl = await StorageService.uploadImage(files.image[0].buffer, files.image[0].mimetype);
      }
      
      if (files?.voice && files.voice[0]) {
        voiceUrl = await StorageService.uploadVoice(files.voice[0].buffer, files.voice[0].mimetype);
      }

      const userId = req.user!.id;
      const { title, description, category, severity, latitude, longitude, ward, address } = req.body;

      // Check for duplicates
      const isDuplicate = await ComplaintService.checkForDuplicate(
        parseFloat(latitude),
        parseFloat(longitude),
        category
      );

      // Leverage Comprehensive Gemini API
      let priorityScore = severity === 'High' ? 8 : severity === 'Medium' ? 5 : 2;
      let aiAnalysis = null;
      let finalCategory = category;

      if (description) {
        aiAnalysis = await GeminiService.analyzeComplaintDetails(description, severity);
        if (aiAnalysis) {
          priorityScore = aiAnalysis.priorityScore;
          if (aiAnalysis.category && aiAnalysis.category !== 'Others') {
             finalCategory = aiAnalysis.category;
          }
        }
      }
      
      const newComplaint = await ComplaintService.createComplaint({
        userId,
        title,
        description,
        category: finalCategory as any,
        severity,
        priorityScore,
        language: aiAnalysis?.language,
        translatedDescription: aiAnalysis?.translatedDescription,
        sentiment: aiAnalysis?.sentiment,
        isDuplicate,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        ward,
        address,
        imageUrl,
        voiceUrl,
      });

      res.status(201).json({
        message: 'Complaint created successfully',
        data: newComplaint,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getComplaints(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status, priority, category, userId } = req.query;
      const dbFilters: Record<string, any> = {};
      
      if (status) dbFilters.status = status;
      if (priority) dbFilters.severity = priority;
      if (category) dbFilters.category = category;
      if (userId) dbFilters.userId = userId;

      const complaints = await ComplaintService.getComplaints(dbFilters);
      res.status(200).json({ data: complaints });
    } catch (error) {
      next(error);
    }
  }

  static async getComplaintById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const complaint = await ComplaintService.getComplaintById(id);
      
      if (!complaint) {
        return res.status(404).json({ error: 'Complaint not found' });
      }

      res.status(200).json({ data: complaint });
    } catch (error) {
      next(error);
    }
  }

  static async updateComplaint(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const updatedComplaint = await ComplaintService.updateComplaint(id, req.body);

      if (!updatedComplaint) {
        return res.status(404).json({ error: 'Complaint not found' });
      }

      res.status(200).json({
        message: 'Complaint updated successfully',
        data: updatedComplaint,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteComplaint(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await ComplaintService.deleteComplaint(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Complaint not found' });
      }

      res.status(200).json({ message: 'Complaint deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Gemini specific endpoints (Optional utility endpoints)
  static async analyze(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { description } = req.body;
      if (!description) return res.status(400).json({ error: 'Description is required' });
      const analysis = await GeminiService.analyzeComplaint(description);
      res.status(200).json({ data: { analysis } });
    } catch (error) {
      next(error);
    }
  }

  // Dashboard Stats
  static async getDashboardStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await ComplaintService.getDashboardStats();
      res.status(200).json({ data: stats });
    } catch (error) {
      next(error);
    }
  }

  // Heatmap Data
  static async getHeatmapData(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Just fetch all complaints (or could be filtered by status/category)
      const complaints = await ComplaintService.getComplaints();
      const heatmapData = complaints.map(c => ({
        id: c.id,
        latitude: c.latitude,
        longitude: c.longitude,
        weight: c.priorityScore || 1, // weight for Google Maps Heatmap
        category: c.category,
      }));
      res.status(200).json({ data: heatmapData });
    } catch (error) {
      next(error);
    }
  }
}
