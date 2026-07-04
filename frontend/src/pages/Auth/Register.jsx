import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Mail, Lock, User, AlertCircle, ArrowRight, CheckCircle, RefreshCw, Shield } from "lucide-react";

const inputClass =
  "block w-full pl-10 bg-slate-950/50 border border-slate-800 rounded-lg py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]";

export default function Register() {
  const [step, setStep] = useState(1); // 1 = details, 2 = OTP
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("CITIZEN");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [devUrl, setDevUrl] = useState(""); // Ethereal preview link
  const [loading, setLoading] = useState(false);

  const { sendVerificationOTP, verifyOTPAndRegister } = useAuth();
  const navigate = useNavigate();

  // ── Step 1: Send OTP ────────────────────────────────────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    try {
      const res = await sendVerificationOTP(email, name, password, role);
      if (res.success) {
        setStep(2);
        setInfo(`A 6-digit OTP has been sent to ${email}`);
        if (res.devPreviewUrl) {
          setDevUrl(res.devPreviewUrl);
        }
      } else {
        setError(res.error || "Failed to send OTP.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ───────────────────────────────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await verifyOTPAndRegister(email, otp);
      if (res.success) {
        navigate(res.user?.role === "CITIZEN" ? "/citizen" : "/");
      } else {
        setError(res.error || "Invalid OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setDevUrl("");
    setLoading(true);
    try {
      const res = await sendVerificationOTP(email, name, password, role);
      if (res.success) {
        setInfo("A new OTP has been sent!");
        if (res.devPreviewUrl) setDevUrl(res.devPreviewUrl);
      } else {
        setError(res.error || "Failed to resend OTP.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          {step === 1 ? "Join Nxt2Echo" : "Verify Email"}
        </h2>
        <p className="mt-2 text-center text-sm text-primary font-medium tracking-widest uppercase">
          AI Governance Intelligence
        </p>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? "bg-primary text-white shadow-[0_0_10px_rgba(99,102,241,0.6)]" : "bg-slate-800 text-slate-500"}`}>
                {step > s ? <CheckCircle size={14} /> : s}
              </div>
              {s < 2 && <div className={`w-10 h-0.5 ${step > s ? "bg-primary" : "bg-slate-800"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl py-8 px-4 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] border border-primary/20 sm:rounded-2xl sm:px-10">

          {/* ── Step 1: Account Details ───────────────────────────────────────── */}
          {step === 1 && (
            <form className="space-y-5" onSubmit={handleSendOTP}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              {/* Role toggle */}
              <div className="flex bg-slate-950/50 p-1 rounded-lg border border-slate-800">
                {["CITIZEN", "OFFICER"].map((r) => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === r ? "bg-primary text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}>
                    {r === "CITIZEN" ? "Citizen" : "Gov Officer"}
                  </button>
                ))}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300">Full Name</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-slate-500" /></div>
                  <input type="text" required className={inputClass} placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300">Email address</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-slate-500" /></div>
                  <input type="email" required className={inputClass} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-500" /></div>
                  <input type="password" required minLength={6} className={inputClass} placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300">Confirm Password</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-500" /></div>
                  <input type="password" required className={inputClass} placeholder="Repeat password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)] text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Sending OTP..." : "Send Verification OTP"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>
          )}

          {/* ── Step 2: Enter OTP ────────────────────────────────────────────── */}
          {step === 2 && (
            <form className="space-y-5" onSubmit={handleVerifyOTP}>
              {/* Info */}
              <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
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

              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 text-center mb-3">Enter 6-digit OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  className="block w-full text-center bg-slate-950/50 border-2 border-primary/40 rounded-xl py-4 text-white text-3xl font-mono tracking-[0.5em] placeholder-slate-700 focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                  placeholder="······"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                />
              </div>

              <button type="submit" disabled={loading || otp.length !== 6}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)] text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Verifying..." : "Verify & Create Account"}
                {!loading && <CheckCircle size={16} />}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-200 transition-colors">
                  ← Change email
                </button>
                <button type="button" onClick={handleResend} disabled={loading}
                  className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors disabled:opacity-50">
                  <RefreshCw size={13} /> Resend OTP
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
