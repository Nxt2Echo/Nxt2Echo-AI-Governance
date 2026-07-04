import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AuthContext = createContext();

// ─── Helper: raw POST without auth header ─────────────────────────────────────
async function publicPost(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || json.message || 'Request failed');
  return json;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const storedUser = localStorage.getItem('nxt2echo_user');
        const parsedStored = storedUser ? JSON.parse(storedUser) : {};
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || parsedStored.name || 'User',
          email: firebaseUser.email || parsedStored.email,
          role: parsedStored.role || 'CITIZEN',
          token: parsedStored.token,
          ...parsedStored,
        });
      } else {
        // Rehydrate from localStorage on refresh
        const stored = localStorage.getItem('nxt2echo_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          auth.updateCurrentUser({ uid: parsed.id, email: parsed.email, displayName: parsed.name });
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ─── STEP 1: Send OTP to email ─────────────────────────────────────────────
  const sendVerificationOTP = async (email, name, password, role = 'CITIZEN') => {
    try {
      const data = await publicPost('/auth/send-otp', { email, name, password, role });
      return { success: true, ...data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ─── STEP 2: Verify OTP → complete registration ────────────────────────────
  const verifyOTPAndRegister = async (email, otp) => {
    try {
      const data = await publicPost('/auth/verify-otp', { email, otp });
      const { token, user: backendUser } = data.data;
      const userObj = {
        id: backendUser.id,
        name: backendUser.name,
        email: backendUser.email,
        role: backendUser.role,
        token,
      };
      localStorage.setItem('nxt2echo_user', JSON.stringify(userObj));
      auth.updateCurrentUser({ uid: userObj.id, email: userObj.email, displayName: userObj.name });
      setUser(userObj);
      return { success: true, user: userObj };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ─── LOGIN with email + password ───────────────────────────────────────────
  const login = async (email, password, role) => {
    try {
      const data = await publicPost('/auth/login', { email, password });
      const { token, user: backendUser } = data.data;
      const userObj = {
        id: backendUser.id,
        name: backendUser.name,
        email: backendUser.email,
        role: backendUser.role || role || 'CITIZEN',
        token,
      };
      localStorage.setItem('nxt2echo_user', JSON.stringify(userObj));
      auth.updateCurrentUser({ uid: userObj.id, email: userObj.email, displayName: userObj.name });
      setUser(userObj);
      return { success: true, user: userObj };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ─── REGISTER (direct — only used internally after OTP) ───────────────────
  const register = async (name, email, password, role = 'CITIZEN') => {
    return sendVerificationOTP(email, name, password, role);
  };

  // ─── GOOGLE LOGIN (mock — shows real flow without OAuth for now) ───────────
  const googleLogin = async (role = 'CITIZEN') => {
    try {
      const mockEmail = role === 'OFFICER' ? 'officer@example.com' : 'citizen@example.com';
      // Try backend login first (will fail if user not registered, falls back to mock)
      try {
        const data = await publicPost('/auth/login', { email: mockEmail, password: 'google-mock' });
        const { token, user: backendUser } = data.data;
        const userObj = { id: backendUser.id, name: backendUser.name, email: backendUser.email, role: backendUser.role || role, token };
        localStorage.setItem('nxt2echo_user', JSON.stringify(userObj));
        auth.updateCurrentUser({ uid: userObj.id, email: userObj.email, displayName: userObj.name });
        setUser(userObj);
        return { success: true };
      } catch {
        // Fallback to mock session
        const userObj = { id: `mock-${role.toLowerCase()}`, name: role === 'OFFICER' ? 'Gov Officer' : 'Google User', email: mockEmail, role };
        localStorage.setItem('nxt2echo_user', JSON.stringify(userObj));
        auth.updateCurrentUser({ uid: userObj.id, email: userObj.email, displayName: userObj.name });
        setUser(userObj);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ─── LOGOUT ────────────────────────────────────────────────────────────────
  const logout = async () => {
    localStorage.removeItem('nxt2echo_user');
    auth.updateCurrentUser(null);
    setUser(null);
  };

  // ─── UPDATE USER (profile settings) ───────────────────────────────────────
  const updateUser = (data) => {
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('nxt2echo_user', JSON.stringify(updatedUser));
  };

  // ─── FORGOT PASSWORD ───────────────────────────────────────────────────────
  const sendPasswordReset = async (email) => {
    try {
      const data = await publicPost('/auth/forgot-password', { email });
      return { success: true, ...data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ─── RESET PASSWORD ────────────────────────────────────────────────────────
  const resetPassword = async (email, otp, newPassword) => {
    try {
      const data = await publicPost('/auth/reset-password', { email, otp, newPassword });
      return { success: true, ...data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ─── Phone OTP (stub — integrate Twilio if needed) ────────────────────────
  const setupRecaptcha = (containerId) => {};
  const sendOtp = async () => ({ success: true });
  const verifyOtp = async () => ({ success: true });

  return (
    <AuthContext.Provider value={{
      user, login, register, googleLogin, logout, updateUser, loading,
      sendVerificationOTP, verifyOTPAndRegister,
      sendPasswordReset, resetPassword,
      setupRecaptcha, sendOtp, verifyOtp,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
