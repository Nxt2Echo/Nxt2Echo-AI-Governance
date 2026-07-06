import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { registerValidator, loginValidator } from '../validators/auth.validator';

const router = Router();

// ── Email OTP Verification Flow (Registration) ─────────────────────────────
// Step 1 — Send OTP to email before creating account
router.post('/send-otp', AuthController.sendVerificationOTP);
// Step 2 — Verify OTP → create account
router.post('/verify-otp', AuthController.verifyOTPAndRegister);

// ── Direct Register (fallback) ─────────────────────────────────────────────
router.post('/register', registerValidator, AuthController.register);

// ── Login with email + password ────────────────────────────────────────────
router.post('/login', AuthController.login);

// ── Password Reset ─────────────────────────────────────────────────────────
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

export default router;
