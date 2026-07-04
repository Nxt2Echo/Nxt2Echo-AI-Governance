import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Mail, Lock, AlertCircle, ArrowRight, CheckCircle, RefreshCw, KeyRound } from "lucide-react";

const inputClass =
  "block w-full pl-10 bg-slate-950/50 border border-slate-800 rounded-lg py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1=email, 2=otp+newpw
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [devUrl, setDevUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const { sendPasswordReset, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await sendPasswordReset(email);
      if (res.success) {
        setStep(2);
        setInfo(`A reset OTP was sent to ${email}`);
        if (res.devPreviewUrl) setDevUrl(res.devPreviewUrl);
      } else {
        setError(res.error || "Failed to send OTP.");
      }
    } finally { setLoading(false); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      const res = await resetPassword(email, otp, newPassword);
      if (res.success) {
        setDone(true);
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setError(res.error || "Reset failed. Check your OTP.");
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-primary font-medium tracking-widest uppercase">
          Nxt2Echo AI Governance
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl py-8 px-4 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] border border-primary/20 sm:rounded-2xl sm:px-10">

          {done ? (
            <div className="text-center py-6">
              <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">Password Updated!</h3>
              <p className="text-slate-400 text-sm">Redirecting you to login...</p>
            </div>
          ) : step === 1 ? (
            <form className="space-y-5" onSubmit={handleSendOTP}>
              <p className="text-slate-400 text-sm text-center">Enter your registered email to receive a reset OTP.</p>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-300">Email address</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-slate-500" /></div>
                  <input type="email" required className={inputClass} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)] text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Sending OTP..." : "Send Reset OTP"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleReset}>
              <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg text-center">
                <KeyRound className="w-7 h-7 text-primary mx-auto mb-1" />
                <p className="text-sm text-slate-300">{info}</p>
                {devUrl && (
                  <a href={devUrl} target="_blank" rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs bg-amber-500/20 border border-amber-500/40 text-amber-400 px-3 py-1 rounded-full hover:bg-amber-500/30 transition-colors">
                    📧 Preview Email (Dev Mode) →
                  </a>
                )}
              </div>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              {/* OTP */}
              <div>
                <label className="block text-sm font-medium text-slate-300 text-center mb-2">Enter OTP</label>
                <input type="text" inputMode="numeric" maxLength={6} required
                  className="block w-full text-center bg-slate-950/50 border-2 border-primary/40 rounded-xl py-3 text-white text-2xl font-mono tracking-[0.5em] placeholder-slate-700 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="······" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300">New Password</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-500" /></div>
                  <input type="password" required minLength={6} className={inputClass} placeholder="Min 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-sm font-medium text-slate-300">Confirm Password</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-500" /></div>
                  <input type="password" required className={inputClass} placeholder="Repeat new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </div>

              <button type="submit" disabled={loading || otp.length !== 6}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)] text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Resetting..." : "Reset Password"}
                {!loading && <CheckCircle size={16} />}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-200 transition-colors">← Change email</button>
                <button type="button" onClick={handleSendOTP} disabled={loading}
                  className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors disabled:opacity-50">
                  <RefreshCw size={13} /> Resend OTP
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-slate-400">
            <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">← Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
