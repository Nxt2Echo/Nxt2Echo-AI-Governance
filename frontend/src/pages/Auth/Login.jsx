import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CITIZEN");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await login(email, password, role);
      if (res.success) {
        const userRole = res.user?.role || role;
        navigate(userRole === "CITIZEN" ? "/citizen" : "/");
      } else {
        setError(res.error || "Failed to sign in. Check your email and password.");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await googleLogin(role);
      if (res.success) {
        navigate(role === "CITIZEN" ? "/citizen" : "/");
      } else {
        setError(res.error || "Failed to sign in with Google");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Neon decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Nxt2Echo
        </h2>
        <p className="mt-2 text-center text-sm text-primary font-medium tracking-widest uppercase">
          AI Governance Intelligence
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl py-8 px-4 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] border border-primary/20 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="flex bg-slate-950/50 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setRole("CITIZEN")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === "CITIZEN" ? "bg-primary text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => setRole("OFFICER")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === "OFFICER" ? "bg-primary text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
              >
                Gov Officer
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 bg-slate-950/50 border border-slate-800 rounded-lg py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 bg-slate-950/50 border border-slate-800 rounded-lg py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)] text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900/50 text-slate-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-slate-700 rounded-lg shadow-sm bg-slate-800/50 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
