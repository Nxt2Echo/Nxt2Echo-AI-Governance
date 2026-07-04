import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Sync with local storage or backend for extra profile info (role, etc.)
        const storedUser = localStorage.getItem('user');
        const parsedStored = storedUser ? JSON.parse(storedUser) : {};
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || parsedStored.name || 'User',
          email: firebaseUser.email || parsedStored.email,
          phone: firebaseUser.phoneNumber || parsedStored.phone,
          avatar: firebaseUser.photoURL || parsedStored.avatar,
          role: parsedStored.role || 'CITIZEN', // Default role unless overridden
          ...parsedStored
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password, role = 'CITIZEN') => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = { id: res.user.uid, name, email, role };
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  };
  
  const googleLogin = async (role = 'CITIZEN') => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const updatedUser = { 
        id: res.user.uid, 
        name: res.user.displayName, 
        email: res.user.email, 
        avatar: res.user.photoURL,
        role: role
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (data) => {
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const setupRecaptcha = (containerId) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible'
      });
    }
  };

  const sendOtp = async (phoneNumber) => {
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const verifyOtp = async (otpCode) => {
    try {
      await window.confirmationResult.confirm(otpCode);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, register, googleLogin, logout, updateUser, loading,
      sendPasswordReset, setupRecaptcha, sendOtp, verifyOtp
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
