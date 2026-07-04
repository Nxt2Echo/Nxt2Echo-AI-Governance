import dotenv from 'dotenv';


// Load .env file
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_key',
  FIREBASE: {
    PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  SMTP: {
    HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    PORT: parseInt(process.env.SMTP_PORT || '587', 10),
    SECURE: process.env.SMTP_SECURE === 'true',
    USER: process.env.SMTP_USER || '',
    PASS: process.env.SMTP_PASS || '',
    FROM: process.env.EMAIL_FROM || 'Nxt2Echo <noreply@nxt2echo.com>',
  },
};

// Validate required variables
const requiredEnvVars = [
  { key: 'JWT_SECRET', value: env.JWT_SECRET },
  { key: 'FIREBASE_PROJECT_ID', value: env.FIREBASE.PROJECT_ID },
  { key: 'FIREBASE_CLIENT_EMAIL', value: env.FIREBASE.CLIENT_EMAIL },
  { key: 'FIREBASE_PRIVATE_KEY', value: env.FIREBASE.PRIVATE_KEY },
  { key: 'GEMINI_API_KEY', value: env.GEMINI_API_KEY },
];

for (const { key, value } of requiredEnvVars) {
  if (!value) {
    console.warn(`[WARN] Missing environment variable: ${key}`);
  }
}
