import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env';

let ai: GoogleGenAI | null = null;
if (env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
}

export class AnalysisService {
  /**
   * Complete AI analysis of a complaint, generating sentiment, priority, category, risk score, summary,
   * department recommendation, and duplicate detection context.
   */
  static async analyze(
    description: string,
    location?: string,
    historyContext?: string
  ): Promise<any> {
    
    // Graceful Fallback if AI is not configured or offline
    if (!ai) {
      console.warn("[AnalysisService] Gemini API Key missing. Returning fallback analysis.");
      return this.getFallbackAnalysis(description);
    }

    try {
      const prompt = `
        Analyze the following citizen complaint and provide a structured JSON response.
        
        Complaint Description: "${description}"
        Location (if provided): "${location || 'Unknown'}"
        Historical Context: "${historyContext || 'None'}"

        You MUST respond with a valid JSON object containing EXACTLY these keys:
        - "summary": A concise 1-2 sentence summary of the issue.
        - "sentiment": Classify as exactly one of: "Positive", "Neutral", "Frustrated", "Angry", "Outraged", or "Fearful".
        - "priority": Classify as exactly one of: "Low", "Medium", "High", or "Critical".
        - "category": Classify into the most appropriate civic category (e.g., "Roads & Infrastructure", "Water Supply", "Sanitation", "Electricity", "Public Safety", "Environment").
        - "departmentRecommendation": Recommend the specific department (e.g., "BBMP", "BWSSB", "BESCOM", "PWD", "BTP", "KSPCB").
        - "riskScore": A float number between 0.0 and 10.0 indicating the severity/risk to public safety or infrastructure.
        - "duplicateDetection": An object with two keys:
            - "isLikelyDuplicate": boolean (true if the history context strongly suggests this is a duplicate).
            - "clusterReason": string (brief explanation of why it might be a duplicate, or null if false).

        Return ONLY a valid JSON string. Do not use markdown blocks like \`\`\`json.
      `;

      // @google/genai syntax
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      let responseText = response.text || "{}";
      
      // Clean up potential markdown formatting if the model still includes it
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

      const parsedData = JSON.parse(responseText);
      return parsedData;

    } catch (error) {
      console.error("[AnalysisService] AI Analysis failed, falling back:", error);
      return this.getFallbackAnalysis(description);
    }
  }

  /**
   * Fallback logic when AI fails
   */
  private static getFallbackAnalysis(description: string) {
    return {
      summary: description.substring(0, 100) + "...",
      sentiment: "Neutral",
      priority: "Medium",
      category: "Uncategorized",
      departmentRecommendation: "General Administration",
      riskScore: 5.0,
      duplicateDetection: {
        isLikelyDuplicate: false,
        clusterReason: null
      }
    };
  }
}
