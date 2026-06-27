import express from "express";
import { chatWithGemini } from "../controllers/gemini.controller";

const router = express.Router();

/**
 * @swagger
 * /api/gemini/chat:
 *   post:
 *     summary: Chat with Gemini AI
 *     tags: [Gemini]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 example: "Hello, what is your name?"
 *     responses:
 *       200:
 *         description: Successful response from Gemini
 *       500:
 *         description: Server error
 */
router.post("/chat", chatWithGemini);
router.get("/chat", chatWithGemini);

export default router;
