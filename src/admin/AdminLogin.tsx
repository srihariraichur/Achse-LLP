/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ACHSE LLP Admin Login Page
 * Brand-accurate login interface:
 * - Brand colours (#0F2A4A, amber #D97706, slate #0F172A)
 * - Achse logo, "Admin Portal" heading
 * - Email and password input with show/hide password toggle
 * - Forgot password reset email trigger
 * - 15-minute lock after 5 failed attempts
 * - Clear, uniform error messaging
 * - No sign-up link anywhere
 */

import React, { useState } from 'react';
import { Logo } from '../components/Logo.tsx';
import { useAdminAuth } from './AdminAuthContext.tsx';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldAlert, CheckCircle2, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onReturnToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onReturnToSite }) => {
  const { login, lockoutTimeRemaining, resetPassword } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<{ sent: boolean; message: string } | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (lockoutTimeRemaining > 0) {
      const mins = Math.ceil(lockoutTimeRemaining / 60);
      setErrorMessage(`Portal locked. Please wait ${mins} minute${mins > 1 ? 's' : ''} before retrying.`);
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      onLoginSuccess();
    } else {
      setErrorMessage(result.error || 'Invalid email or password');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    const res = await resetPassword(resetEmail || email);
    setIsResetting(false);
    setResetStatus({ sent: res.success, message: res.message });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1D33] via-[#0F2A4A] to-[#0A1626] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Background technical grid pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Return to public site link */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onReturnToSite}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
          <span>Return to ACHSE Website</span>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand identity header */}
        <div className="flex flex-col items-center mb-8">
          <Logo variant="dark" showTagline={true} />
          <div className="mt-5 flex items-center gap-2">
            <span className="h-px w-8 bg-amber-500/40" />
            <span className="text-[11px] font-mono-spec uppercase tracking-[0.25em] text-amber-400 font-semibold">
              Admin Portal
            </span>
            <span className="h-px w-8 bg-amber-500/40" />
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200/80 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#0F2A4A] tracking-tight">
                Engineering Desk Access
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Secure management console for customer RFQs, engineering drawings, and technical inquiries.
              </p>
            </div>

            {/* Lockout Warning Banner */}
            {lockoutTimeRemaining > 0 && (
              <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-xs animate-shake">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block">Portal Temporarily Locked</strong>
                  <span>
                    5 failed login attempts detected. For security, login is locked for{' '}
                    <strong>{Math.ceil(lockoutTimeRemaining / 60)} min</strong>.
                  </span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && lockoutTimeRemaining === 0 && (
              <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[11px] font-mono-spec uppercase tracking-wider text-slate-700 font-semibold mb-1.5">
                  Administrator Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={lockoutTimeRemaining > 0 || isSubmitting}
                    placeholder="admin@achse.in"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg text-xs sm:text-sm bg-slate-50 border border-slate-300 focus:bg-white focus:outline-hidden focus:border-[#0F2A4A] focus:ring-1 focus:ring-[#0F2A4A] transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-mono-spec uppercase tracking-wider text-slate-700 font-semibold">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setResetStatus(null);
                      setForgotModalOpen(true);
                    }}
                    className="text-[11px] text-amber-700 hover:text-amber-800 font-medium hover:underline transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={lockoutTimeRemaining > 0 || isSubmitting}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg text-xs sm:text-sm bg-slate-50 border border-slate-300 focus:bg-white focus:outline-hidden focus:border-[#0F2A4A] focus:ring-1 focus:ring-[#0F2A4A] transition-colors disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={lockoutTimeRemaining > 0 || isSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-[#0F2A4A] hover:bg-[#1E3A5F] active:bg-[#0A1D33] disabled:opacity-60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {isSubmitting ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Login to Portal</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>SSL Encrypted</span>
              </span>
              <span>Pune Desk • Est. 2026</span>
            </div>
          </div>
        </div>

        {/* Security disclaimer */}
        <p className="mt-6 text-center text-[11px] text-slate-400 leading-relaxed max-w-sm mx-auto">
          Authorized personnel only. All access attempts and telemetry are strictly recorded for engineering security.
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-[#0F2A4A]">Reset Admin Password</h3>
            <p className="text-xs text-slate-600 mt-1">
              Enter your verified administrator email to receive a secure password reset link via Firebase.
            </p>

            {resetStatus ? (
              <div className="mt-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>{resetStatus.message}</p>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="mt-4 space-y-4">
                <div>
                  <label className="block text-[11px] font-mono-spec uppercase text-slate-700 font-semibold mb-1">
                    Administrator Email
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@achse.in"
                    className="w-full px-3 py-2 rounded text-xs bg-slate-50 border border-slate-300 focus:bg-white focus:outline-hidden focus:border-[#0F2A4A]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-3 py-1.5 rounded text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="px-4 py-1.5 rounded text-xs font-semibold text-white bg-[#0F2A4A] hover:bg-[#1E3A5F]"
                  >
                    {isResetting ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}

            {resetStatus && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-4 py-1.5 rounded text-xs font-semibold text-white bg-[#0F2A4A] hover:bg-[#1E3A5F]"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
