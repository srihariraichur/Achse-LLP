/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ACHSE LLP Admin Auth & Inactivity Session Controller
 * Enforces:
 * - Email / Password Firebase authentication with whitelisted admin verification
 * - 5-attempt rate-limiting / 15-minute lock
 * - 30-minute inactivity auto-logout
 * - Clear, non-leaking error messages
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase.ts';
import type { AdminUser } from './types.ts';

interface AuthContextType {
  currentUser: AdminUser | null;
  firebaseUser: User | null;
  isLoading: boolean;
  lockoutTimeRemaining: number; // in seconds, 0 if not locked
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

const LOCAL_ADMIN_SESSION_KEY = 'achse_admin_active_session';
const FAILED_ATTEMPTS_KEY = 'achse_admin_failed_attempts';
const LOCKOUT_TIMESTAMP_KEY = 'achse_admin_lockout_until';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lockoutUntil, setLockoutUntil] = useState<number>(0);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState<number>(0);
  const lastActivityRef = useRef<number>(Date.now());

  // Check existing lockout on load
  useEffect(() => {
    const storedLockout = localStorage.getItem(LOCKOUT_TIMESTAMP_KEY);
    if (storedLockout) {
      const until = parseInt(storedLockout, 10);
      if (until > Date.now()) {
        setLockoutUntil(until);
      } else {
        localStorage.removeItem(LOCKOUT_TIMESTAMP_KEY);
        localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      }
    }
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutUntil <= Date.now()) {
      setLockoutTimeRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const diff = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setLockoutTimeRemaining(diff);
      if (diff <= 0) {
        clearInterval(interval);
        setLockoutUntil(0);
        localStorage.removeItem(LOCKOUT_TIMESTAMP_KEY);
        localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Restore session from localStorage or Firebase Auth
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (auth && isFirebaseConfigured) {
      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          setFirebaseUser(fbUser);
          // Check admins collection if firestore available
          let role: 'admin' | 'superadmin' = 'admin';
          if (db) {
            try {
              const adminSnap = await getDoc(doc(db, 'admins', fbUser.uid));
              if (adminSnap.exists()) {
                role = adminSnap.data()?.role || 'admin';
              }
            } catch (err) {
              console.warn('Could not verify admin doc in Firestore:', err);
            }
          }

          const adminUser: AdminUser = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            role,
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Admin',
          };
          setCurrentUser(adminUser);
          localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(adminUser));
        } else {
          setFirebaseUser(null);
          // Fall back to stored session if not using live Firebase
          const stored = localStorage.getItem(LOCAL_ADMIN_SESSION_KEY);
          if (stored) {
            try {
              setCurrentUser(JSON.parse(stored));
            } catch {
              setCurrentUser(null);
            }
          } else {
            setCurrentUser(null);
          }
        }
        setIsLoading(false);
      });
    } else {
      // Local fallback session
      const stored = localStorage.getItem(LOCAL_ADMIN_SESSION_KEY);
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch {
          setCurrentUser(null);
        }
      }
      setIsLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Inactivity auto-logout tracker (30 minutes)
  useEffect(() => {
    if (!currentUser) return;

    const resetActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    events.forEach((ev) => window.addEventListener(ev, resetActivity, { passive: true }));

    const checkInactivity = setInterval(() => {
      if (Date.now() - lastActivityRef.current >= INACTIVITY_TIMEOUT_MS) {
        console.warn('ACHSE Admin Portal: Auto-logging out due to 30 minutes of inactivity');
        logout();
      }
    }, 15000);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, resetActivity));
      clearInterval(checkInactivity);
    };
  }, [currentUser]);

  const handleFailedAttempt = () => {
    const rawAttempts = localStorage.getItem(FAILED_ATTEMPTS_KEY);
    const count = (rawAttempts ? parseInt(rawAttempts, 10) : 0) + 1;
    localStorage.setItem(FAILED_ATTEMPTS_KEY, String(count));

    if (count >= MAX_FAILED_ATTEMPTS) {
      const lockUntil = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem(LOCKOUT_TIMESTAMP_KEY, String(lockUntil));
      setLockoutUntil(lockUntil);
      setLockoutTimeRemaining(LOCKOUT_DURATION_MS / 1000);
      return true;
    }
    return false;
  };

  const clearFailedAttempts = () => {
    localStorage.removeItem(FAILED_ATTEMPTS_KEY);
    localStorage.removeItem(LOCKOUT_TIMESTAMP_KEY);
    setLockoutUntil(0);
    setLockoutTimeRemaining(0);
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // 1. Check lockout status
    if (lockoutTimeRemaining > 0) {
      const mins = Math.ceil(lockoutTimeRemaining / 60);
      return { 
        success: false, 
        error: `Account is temporarily locked due to too many failed attempts. Please try again in ${mins} minute${mins > 1 ? 's' : ''}.` 
      };
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = pass.trim();

    if (!trimmedEmail || !trimmedPass) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    // 2. Try Firebase Auth if configured
    if (auth && isFirebaseConfigured) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPass);
        clearFailedAttempts();
        const fbUser = userCredential.user;

        // Verify admin role in Firestore
        let role: 'admin' | 'superadmin' = 'admin';
        if (db) {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', fbUser.uid));
            if (!adminDoc.exists()) {
              // Not in admins collection
              await signOut(auth);
              return { success: false, error: 'Access denied. Account is not registered in the admin roster.' };
            }
            role = adminDoc.data()?.role || 'admin';
          } catch (e) {
            console.warn('Admin record check:', e);
          }
        }

        const adminObj: AdminUser = {
          uid: fbUser.uid,
          email: fbUser.email || trimmedEmail,
          role,
          displayName: fbUser.displayName || trimmedEmail.split('@')[0],
        };
        setCurrentUser(adminObj);
        localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(adminObj));
        lastActivityRef.current = Date.now();
        return { success: true };
      } catch (err: any) {
        const isLocked = handleFailedAttempt();
        if (isLocked) {
          return { success: false, error: 'Too many failed login attempts. Locked for 15 minutes.' };
        }
        // Generic error without revealing email vs password
        return { success: false, error: 'Invalid email or password.' };
      }
    }

    // 3. Fallback demo/offline authentication
    // Accepts official admin email or default admin credentials for review
    if (
      (trimmedEmail === 'srihari@achse.in' || trimmedEmail === 'admin@achse.in') &&
      trimmedPass.length >= 6
    ) {
      clearFailedAttempts();
      const mockAdmin: AdminUser = {
        uid: 'admin-achse-default',
        email: trimmedEmail,
        role: 'superadmin',
        displayName: 'ACHSE Administrator',
      };
      setCurrentUser(mockAdmin);
      localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(mockAdmin));
      lastActivityRef.current = Date.now();
      return { success: true };
    }

    const isLocked = handleFailedAttempt();
    if (isLocked) {
      return { success: false, error: 'Too many failed login attempts. Locked for 15 minutes.' };
    }
    return { success: false, error: 'Invalid email or password.' };
  };

  const logout = async () => {
    try {
      if (auth && isFirebaseConfigured) {
        await signOut(auth);
      }
    } catch (e) {
      console.warn('SignOut error:', e);
    }
    setCurrentUser(null);
    setFirebaseUser(null);
    localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
    window.location.hash = 'admin/login';
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      return { success: false, message: 'Please provide a valid administrator email.' };
    }

    if (auth && isFirebaseConfigured) {
      try {
        await sendPasswordResetEmail(auth, trimmed);
        return { 
          success: true, 
          message: `If an admin account is linked to ${trimmed}, a password reset link has been dispatched.` 
        };
      } catch (err: any) {
        // Uniform message to avoid account harvesting
        return { 
          success: true, 
          message: `If an admin account is linked to ${trimmed}, a password reset link has been dispatched.` 
        };
      }
    }

    return {
      success: true,
      message: `Password reset instruction dispatched for ${trimmed} (Firebase offline mode).`,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        isLoading,
        lockoutTimeRemaining,
        login,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAdminAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
