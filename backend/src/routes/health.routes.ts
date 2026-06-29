import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { auth as firebaseAuth } from '../firebase';
import { GoogleGenAI } from '@google/genai';

const router = Router();

/**
 * GET /api/health
 * Tests Firebase Admin SDK, JWT, and Gemini API keys.
 * Returns a live HTML dashboard showing pass/fail for each service.
 */
router.get('/', async (_req: Request, res: Response) => {
  const results: {
    service: string;
    status: 'PASS' | 'FAIL' | 'SKIP';
    detail: string;
    timeTaken: string;
  }[] = [];

  // ─── 1. JWT CHECK ──────────────────────────────────────────────────────────
  const jwtStart = Date.now();
  try {
    const secret = env.JWT_SECRET as string;
    const token = jwt.sign({ id: 'health-check-user', role: 'Admin' }, secret, { expiresIn: '1m' });
    const decoded = jwt.verify(token, secret) as { id: string; role: string };

    if (decoded.id === 'health-check-user') {
      results.push({
        service: 'JWT (jsonwebtoken)',
        status: 'PASS',
        detail: `Token signed & verified successfully. Payload: id="${decoded.id}", role="${decoded.role}"`,
        timeTaken: `${Date.now() - jwtStart}ms`,
      });
    } else {
      throw new Error('Decoded payload mismatch');
    }
  } catch (err: any) {
    results.push({
      service: 'JWT (jsonwebtoken)',
      status: 'FAIL',
      detail: err.message,
      timeTaken: `${Date.now() - jwtStart}ms`,
    });
  }

  // ─── 2. FIREBASE ADMIN SDK CHECK ───────────────────────────────────────────
  const fbStart = Date.now();
  const isFirebasePlaceholder =
    !env.FIREBASE.PROJECT_ID ||
    env.FIREBASE.PROJECT_ID === 'your_firebase_project_id' ||
    !env.FIREBASE.CLIENT_EMAIL ||
    env.FIREBASE.CLIENT_EMAIL === 'your_firebase_client_email';

  if (isFirebasePlaceholder) {
    results.push({
      service: 'Firebase Admin SDK',
      status: 'SKIP',
      detail:
        'Placeholder credentials detected in .env. Add real FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to test.',
      timeTaken: `${Date.now() - fbStart}ms`,
    });
  } else {
    try {
      // Listing users is a lightweight call that requires a valid Admin SDK connection
      const listResult = await firebaseAuth.listUsers(1);
      results.push({
        service: 'Firebase Admin SDK',
        status: 'PASS',
        detail: `Connected to Firebase project "${env.FIREBASE.PROJECT_ID}". Auth SDK responded successfully (users in project: checked).`,
        timeTaken: `${Date.now() - fbStart}ms`,
      });
    } catch (err: any) {
      results.push({
        service: 'Firebase Admin SDK',
        status: 'FAIL',
        detail: err.message,
        timeTaken: `${Date.now() - fbStart}ms`,
      });
    }
  }

  // ─── 3. GEMINI API KEY CHECK ───────────────────────────────────────────────
  const geminiStart = Date.now();
  const isGeminiPlaceholder =
    !env.GEMINI_API_KEY || env.GEMINI_API_KEY === 'your_gemini_api_key';

  if (isGeminiPlaceholder) {
    results.push({
      service: 'Google Gemini API',
      status: 'SKIP',
      detail: 'Placeholder API key detected in .env. Add a real GEMINI_API_KEY to test.',
      timeTaken: `${Date.now() - geminiStart}ms`,
    });
  } else {
    try {
      const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Reply with exactly: "Gemini OK"',
      });
      const reply = response.text?.trim() || '';
      results.push({
        service: 'Google Gemini API',
        status: 'PASS',
        detail: `API key valid. Model "gemini-2.5-flash" responded: "${reply}"`,
        timeTaken: `${Date.now() - geminiStart}ms`,
      });
    } catch (err: any) {
      results.push({
        service: 'Google Gemini API',
        status: 'FAIL',
        detail: err.message,
        timeTaken: `${Date.now() - geminiStart}ms`,
      });
    }
  }

  // ─── BUILD HTML RESPONSE ──────────────────────────────────────────────────
  const statusColor = (s: 'PASS' | 'FAIL' | 'SKIP') => {
    if (s === 'PASS') return '#22c55e';
    if (s === 'FAIL') return '#ef4444';
    return '#f59e0b';
  };
  const statusBg = (s: 'PASS' | 'FAIL' | 'SKIP') => {
    if (s === 'PASS') return '#052e16';
    if (s === 'FAIL') return '#2d0000';
    return '#1c1400';
  };
  const statusIcon = (s: 'PASS' | 'FAIL' | 'SKIP') => {
    if (s === 'PASS') return '✅';
    if (s === 'FAIL') return '❌';
    return '⚠️';
  };

  const allPass = results.every((r) => r.status === 'PASS' || r.status === 'SKIP');
  const anyFail = results.some((r) => r.status === 'FAIL');
  const overallStatus = anyFail ? 'DEGRADED' : allPass ? 'HEALTHY' : 'PARTIAL';
  const overallColor = anyFail ? '#ef4444' : '#22c55e';

  const cards = results
    .map(
      (r) => `
      <div style="
        background:${statusBg(r.status)};
        border:1px solid ${statusColor(r.status)}40;
        border-left:4px solid ${statusColor(r.status)};
        border-radius:12px;
        padding:24px 28px;
        margin-bottom:16px;
      ">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
          <span style="font-size:24px;">${statusIcon(r.status)}</span>
          <span style="font-size:18px;font-weight:700;color:#f1f5f9;">${r.service}</span>
          <span style="
            margin-left:auto;
            background:${statusColor(r.status)}22;
            color:${statusColor(r.status)};
            border:1px solid ${statusColor(r.status)}55;
            border-radius:999px;
            padding:3px 14px;
            font-size:13px;
            font-weight:700;
            letter-spacing:1px;
          ">${r.status}</span>
        </div>
        <p style="margin:0 0 8px;color:#94a3b8;font-size:14px;line-height:1.6;">${r.detail}</p>
        <p style="margin:0;color:#475569;font-size:12px;">⏱ Response time: <strong style="color:#64748b;">${r.timeTaken}</strong></p>
      </div>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nxt2Echo — API Health Check</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background: #0a0f1e;
      color: #e2e8f0;
      min-height: 100vh;
      padding: 40px 20px;
    }
    .container { max-width: 760px; margin: 0 auto; }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 3px;
      color: #6366f1;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 36px;
      font-weight: 800;
      background: linear-gradient(135deg, #e2e8f0, #94a3b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 16px;
    }
    .overall-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: ${overallColor}15;
      border: 1.5px solid ${overallColor}55;
      color: ${overallColor};
      border-radius: 999px;
      padding: 8px 24px;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .timestamp {
      font-size: 13px;
      color: #475569;
      margin-bottom: 36px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 2px;
      color: #475569;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .refresh-btn {
      display: block;
      width: 100%;
      margin-top: 24px;
      padding: 14px;
      background: #6366f1;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.2s;
    }
    .refresh-btn:hover { background: #4f46e5; }
    .env-note {
      margin-top: 24px;
      padding: 16px 20px;
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 10px;
      font-size: 13px;
      color: #64748b;
      line-height: 1.7;
    }
    .env-note code {
      background: #1e293b;
      color: #a5b4fc;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Nxt2Echo Platform</div>
      <h1>API Health Check</h1>
      <div class="overall-badge">
        ${overallStatus === 'HEALTHY' ? '🟢' : overallStatus === 'DEGRADED' ? '🔴' : '🟡'}
        System: ${overallStatus}
      </div>
      <div class="timestamp">Checked at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST &nbsp;•&nbsp; Port: ${env.PORT}</div>
    </div>

    <div class="section-title">Service Diagnostics</div>
    ${cards}

    <button class="refresh-btn" onclick="location.reload()">🔄 Re-run Health Check</button>

    <div class="env-note">
      <strong style="color:#94a3b8;">📌 How to fix SKIP / FAIL status:</strong><br/>
      Open <code>backend/.env</code> and replace the placeholder values with your real credentials:<br/>
      <code>FIREBASE_PROJECT_ID</code>, <code>FIREBASE_CLIENT_EMAIL</code>, <code>FIREBASE_PRIVATE_KEY</code>, <code>GEMINI_API_KEY</code>.<br/>
      Then restart the server and refresh this page.
    </div>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
});

export default router;
