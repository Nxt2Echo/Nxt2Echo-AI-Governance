import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const chatWithGemini = async (req: Request, res: Response): Promise<void> => {
  try {
    const prompt = req.body.prompt || req.query.prompt;

    if (!prompt) {
      res.status(400).json({ success: false, message: "Prompt is required in body or query" });
      return;
    }

    console.log("Calling Gemini API...");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    console.log("Gemini Response:", response.text);

    res.json({
      success: true,
      response: response.text,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
