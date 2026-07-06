import { Request, Response } from 'express';
import { AnalysisService } from '../services/analysis.service';
import { env } from '../config/env';

export class AnalysisController {
  
  /**
   * GET /api/analysis
   * Health check and status of the AI Engine
   */
  static async getAnalysisStatus(req: Request, res: Response) {
    try {
      const isConfigured = !!env.GEMINI_API_KEY;
      
      return res.status(200).json({
        success: true,
        data: {
          status: isConfigured ? "online" : "offline_fallback_mode",
          provider: "Gemini",
          model: "gemini-2.5-flash",
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve analysis engine status'
      });
    }
  }

  /**
   * POST /api/analysis/analyze
   * Send complaint details to the AI engine for structured analysis
   */
  static async analyzeComplaint(req: Request, res: Response) {
    try {
      const { description, location, historyContext } = req.body;

      if (!description) {
        return res.status(400).json({
          success: false,
          message: 'Complaint description is required for analysis'
        });
      }

      // Execute AI Analysis
      const analysisResult = await AnalysisService.analyze(
        description,
        location,
        historyContext
      );

      return res.status(200).json({
        success: true,
        data: analysisResult
      });

    } catch (error) {
      console.error('[AnalysisController] Error analyzing complaint:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred during AI analysis'
      });
    }
  }
}
