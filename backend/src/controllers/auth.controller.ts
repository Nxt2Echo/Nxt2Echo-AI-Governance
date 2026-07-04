import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { UserModel } from '../models/User';
import { Role } from '../types';

export class AuthController {
  // ─── Step 1: Send OTP to email ─────────────────────────────────────────────
  static async sendVerificationOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name, password, role } = req.body;

      if (!email || !name || !password) {
        return res.status(400).json({ error: 'email, name, and password are required' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
      }

      const result = await EmailService.sendVerificationOTP(
        email, name, role || 'CITIZEN', password
      );

      return res.status(200).json({
        message: 'Verification OTP sent to your email.',
        ...(result.previewUrl ? { devPreviewUrl: result.previewUrl } : {}),
      });
    } catch (error: any) {
      console.error('[AuthController.sendVerificationOTP]', error);
      return res.status(500).json({ error: error.message || 'Failed to send OTP' });
    }
  }

  // ─── Step 2: Verify OTP → create account ───────────────────────────────────
  static async verifyOTPAndRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) return res.status(400).json({ error: 'email and otp are required' });

      const pending = EmailService.validateOTP(email, otp);
      if (!pending) {
        return res.status(400).json({ error: 'Invalid or expired OTP. Please request a new one.' });
      }

      const result = await AuthService.registerUser({
        email: pending.email,
        name: pending.name,
        role: (pending.role as Role) || Role.CITIZEN,
        password: pending.password,
      });

      return res.status(201).json({
        message: 'Email verified and account created successfully.',
        data: result,
      });
    } catch (error: any) {
      console.error('[AuthController.verifyOTPAndRegister]', error);
      return res.status(500).json({ error: error.message || 'Registration failed' });
    }
  }

  // ─── Register (direct — kept for backward compat) ─────────────────────────
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name, role } = req.body;
      const result = await AuthService.registerUser({ email, password, name, role });
      
      res.status(201).json({
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // ─── Login ─────────────────────────────────────────────────────────────────
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'No account found with this email.' });
      }

      // Verify password
      const valid = await AuthService.verifyPassword(password, (user as any).password ?? '');
      if (!valid) {
        return res.status(401).json({ error: 'Incorrect password.' });
      }

      const token = AuthService.generateToken(user.id!, user.role as Role);
      const { password: _pw, ...safeUser } = user as any;

      return res.status(200).json({
        message: 'Login successful',
        data: { token, user: safeUser },
      });
    } catch (error: any) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  }

  // ─── Forgot Password ───────────────────────────────────────────────────────
  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'email is required' });

      const user = await UserModel.findByEmail(email);
      if (!user) {
        // Don't reveal if email exists
        return res.status(200).json({ message: 'If this email exists, a reset OTP has been sent.' });
      }

      const result = await EmailService.sendPasswordResetOTP(email);
      return res.status(200).json({
        message: 'Password reset OTP sent to your email.',
        ...(result.previewUrl ? { devPreviewUrl: result.previewUrl } : {}),
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to send reset OTP' });
    }
  }

  // ─── Reset Password ────────────────────────────────────────────────────────
  static async resetPassword(req: Request, res: Response) {
    try {
      const { email, otp, newPassword } = req.body;
      if (!email || !otp || !newPassword) {
        return res.status(400).json({ error: 'email, otp, and newPassword are required' });
      }

      const valid = EmailService.validateResetOTP(email, otp);
      if (!valid) {
        return res.status(400).json({ error: 'Invalid or expired OTP.' });
      }

      await (UserModel as any).updatePassword(email, newPassword);
      return res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to reset password' });
    }
  }
}
