import nodemailer from 'nodemailer';
import { env } from '../config/env';

// ─── OTP Store (in-memory, TTL 10 minutes) ────────────────────────────────────
interface OTPEntry {
  otp: string;
  email: string;
  name: string;
  role: string;
  password: string;
  expiresAt: number;
}
const otpStore = new Map<string, OTPEntry>();

// Clean up expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of otpStore.entries()) {
    if (entry.expiresAt < now) otpStore.delete(key);
  }
}, 5 * 60 * 1000);

// ─── Transporter ──────────────────────────────────────────────────────────────
function createTransporter() {
  if (!env.SMTP.USER || !env.SMTP.PASS || env.SMTP.USER === 'your_gmail@gmail.com') {
    // Development: use Ethereal (fake SMTP) — no credentials needed
    return null;
  }
  return nodemailer.createTransport({
    host: env.SMTP.HOST,
    port: env.SMTP.PORT,
    secure: env.SMTP.SECURE,
    auth: {
      user: env.SMTP.USER,
      pass: env.SMTP.PASS,
    },
  });
}

// ─── OTP Utilities ────────────────────────────────────────────────────────────
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const EmailService = {
  /** Store a pending registration with OTP */
  storePendingRegistration(email: string, otp: string, data: { name: string; role: string; password: string }) {
    const key = email.toLowerCase();
    otpStore.set(key, {
      otp,
      email: key,
      name: data.name,
      role: data.role,
      password: data.password,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 min
    });
  },

  /** Retrieve and validate a pending OTP */
  validateOTP(email: string, otp: string): OTPEntry | null {
    const key = email.toLowerCase();
    const entry = otpStore.get(key);
    if (!entry) return null;
    if (entry.expiresAt < Date.now()) {
      otpStore.delete(key);
      return null;
    }
    if (entry.otp !== otp.trim()) return null;
    otpStore.delete(key); // one-time use
    return entry;
  },

  /** Send a verification OTP email */
  async sendVerificationOTP(email: string, name: string, role: string, password: string): Promise<{ otp: string; previewUrl?: string }> {
    const otp = generateOTP();
    this.storePendingRegistration(email, otp, { name, role, password });

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0d1427,#111827);border-radius:16px;border:1px solid #1e293b;overflow:hidden;">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#6366f1,#3b82f6);padding:32px;text-align:center;">
          <h1 style="margin:0;font-size:28px;font-weight:800;color:#fff;letter-spacing:-0.5px;">Nxt2Echo</h1>
          <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.7);letter-spacing:3px;text-transform:uppercase;">AI Governance Intelligence</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px 36px;">
          <h2 style="margin:0 0 8px;font-size:20px;color:#f1f5f9;">Verify Your Email</h2>
          <p style="margin:0 0 28px;color:#94a3b8;font-size:14px;line-height:1.6;">
            Hi <strong style="color:#e2e8f0;">${name}</strong>, use the OTP below to complete your ${role === 'OFFICER' ? '<strong style="color:#6366f1;">Gov Officer</strong>' : '<strong style="color:#22d3ee;">Citizen</strong>'} registration. It expires in <strong>10 minutes</strong>.
          </p>
          <!-- OTP Box -->
          <div style="background:#0f172a;border:2px solid #6366f1;border-radius:12px;text-align:center;padding:24px 16px;margin-bottom:28px;">
            <p style="margin:0 0 8px;font-size:11px;color:#64748b;letter-spacing:2px;text-transform:uppercase;">Your Verification Code</p>
            <div style="font-size:48px;font-weight:900;letter-spacing:12px;color:#6366f1;font-family:monospace;">${otp}</div>
          </div>
          <p style="margin:0;font-size:12px;color:#475569;line-height:1.6;">
            If you didn't create an account on Nxt2Echo, you can safely ignore this email.
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:20px 36px;border-top:1px solid #1e293b;text-align:center;">
          <p style="margin:0;font-size:11px;color:#334155;">© 2024 Nxt2Echo AI Governance Platform · Bengaluru, KA</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const transporter = createTransporter();

    if (!transporter) {
      // Create a temporary Ethereal test account for dev preview
      const testAccount = await nodemailer.createTestAccount();
      const devTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      const info = await devTransporter.sendMail({
        from: env.SMTP.FROM,
        to: email,
        subject: `${otp} — Your Nxt2Echo Verification Code`,
        html,
      });
      const previewUrl = nodemailer.getTestMessageUrl(info) as string;
      console.log(`[EMAIL DEV] OTP preview: ${previewUrl}`);
      return { otp, previewUrl };
    }

    await transporter.sendMail({
      from: env.SMTP.FROM,
      to: email,
      subject: `${otp} — Your Nxt2Echo Verification Code`,
      html,
    });

    return { otp };
  },

  /** Send password-reset OTP */
  async sendPasswordResetOTP(email: string): Promise<{ otp: string; previewUrl?: string }> {
    const otp = generateOTP();
    // Reuse the OTP store but with a reset marker
    otpStore.set(`reset:${email.toLowerCase()}`, {
      otp, email, name: '', role: '', password: '',
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    const html = `
<!DOCTYPE html><html><body style="background:#0a0f1e;font-family:Inter,Arial,sans-serif;padding:40px;">
  <div style="max-width:520px;margin:auto;background:#111827;border-radius:16px;padding:40px;border:1px solid #1e293b;">
    <h2 style="color:#f1f5f9;">Password Reset</h2>
    <p style="color:#94a3b8;">Your OTP to reset your password:</p>
    <div style="background:#0f172a;border:2px solid #6366f1;border-radius:12px;text-align:center;padding:24px;margin:20px 0;">
      <div style="font-size:48px;font-weight:900;letter-spacing:12px;color:#6366f1;font-family:monospace;">${otp}</div>
    </div>
    <p style="color:#475569;font-size:12px;">Valid for 10 minutes. If you didn't request this, ignore this email.</p>
  </div>
</body></html>`;

    const transporter = createTransporter();
    if (!transporter) {
      const testAccount = await nodemailer.createTestAccount();
      const devT = nodemailer.createTransport({ host: 'smtp.ethereal.email', port: 587, secure: false, auth: { user: testAccount.user, pass: testAccount.pass } });
      const info = await devT.sendMail({ from: env.SMTP.FROM, to: email, subject: `${otp} — Nxt2Echo Password Reset`, html });
      const previewUrl = nodemailer.getTestMessageUrl(info) as string;
      console.log(`[EMAIL DEV] Reset preview: ${previewUrl}`);
      return { otp, previewUrl };
    }
    await transporter.sendMail({ from: env.SMTP.FROM, to: email, subject: `${otp} — Nxt2Echo Password Reset`, html });
    return { otp };
  },

  validateResetOTP(email: string, otp: string): boolean {
    const key = `reset:${email.toLowerCase()}`;
    const entry = otpStore.get(key);
    if (!entry || entry.expiresAt < Date.now() || entry.otp !== otp.trim()) return false;
    otpStore.delete(key);
    return true;
  },
};
