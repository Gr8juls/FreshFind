'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, ArrowRight, AlertCircle, Loader2, RefreshCw, CheckCircle2, Lock } from 'lucide-react';
import { OtpInput } from './OtpInput';
import { GoogleSignInButton } from './GoogleSignInButton';
import { AppleSignInButton } from './AppleSignInButton';
import { useApp } from '@/lib/store';

interface InlineAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  subtitle?: string;
}

export function InlineAuthModal({
  isOpen,
  onClose,
  onSuccess,
  title = 'Sign in to reserve your bag',
  subtitle = 'Reserving food takes just a second with passwordless login',
}: InlineAuthModalProps) {
  const { fetchSession } = useApp();

  const [step, setStep] = useState<'INPUT' | 'OTP' | 'PASSWORD'>('INPUT');
  const [authType, setAuthType] = useState<'EMAIL' | 'PHONE'>('EMAIL');
  const [identifier, setIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setLoading(false);
      setOtpCode('');
    }
  }, [isOpen]);

  // Resend countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) {
      setError(authType === 'EMAIL' ? 'Please enter your email address' : 'Please enter your phone number');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), type: authType }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setStep('OTP');
      setCountdown(45);
    } catch (err: any) {
      setError(err.message || 'Could not send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otpCode;
    if (code.length < 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          code,
          type: authType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid code');
      }

      if (fetchSession) {
        await fetchSession();
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please enter both email and password');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password');
      }

      if (fetchSession) {
        await fetchSession();
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSuccess = async () => {
    if (fetchSession) {
      await fetchSession();
    }
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden font-sans">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-emerald-400 mb-3 shadow-lg shadow-brand-500/20">
            <span className="text-2xl">🌱</span>
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">{title}</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">{subtitle}</p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center space-x-2.5 text-red-400 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Main Identifier Input & Social Buttons */}
        {step === 'INPUT' && (
          <div className="space-y-4">
            {/* Social Logins */}
            <div className="space-y-2.5">
              <GoogleSignInButton
                onSuccess={handleSocialSuccess}
                onError={(err) => setError(err)}
              />
              <AppleSignInButton
                onSuccess={handleSocialSuccess}
                onError={(err) => setError(err)}
              />
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                or with email / phone
              </span>
              <div className="border-t border-slate-800 w-full" />
            </div>

            {/* Switch between Email and Phone */}
            <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 mb-2">
              <button
                type="button"
                onClick={() => {
                  setAuthType('EMAIL');
                  setError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  authType === 'EMAIL'
                    ? 'bg-brand-500/20 text-brand-400 shadow-sm border border-brand-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthType('PHONE');
                  setError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  authType === 'PHONE'
                    ? 'bg-brand-500/20 text-brand-400 shadow-sm border border-brand-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Phone (Rwanda)
              </button>
            </div>

            {/* Identifier Input Form */}
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div className="relative">
                {authType === 'EMAIL' ? (
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                ) : (
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                )}
                <input
                  type={authType === 'EMAIL' ? 'email' : 'tel'}
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={authType === 'EMAIL' ? 'you@domain.com' : 'e.g. 078XXXXXXX or +250...'}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl shadow-lg shadow-brand-500/25 text-sm font-bold text-slate-950 bg-gradient-to-r from-brand-500 via-emerald-400 to-teal-400 hover:opacity-95 disabled:opacity-50 transition cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <>
                    <span>Continue with Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setStep('PASSWORD');
                  setError(null);
                }}
                className="text-xs text-slate-400 hover:text-brand-400 transition"
              >
                Have a password? Use password sign in
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 'OTP' && (
          <div className="space-y-5">
            <div className="text-center">
              <p className="text-xs text-slate-400">
                Enter the 6-digit code sent to <strong className="text-slate-200">{identifier}</strong>
              </p>
            </div>

            <OtpInput
              value={otpCode}
              onChange={(code) => setOtpCode(code)}
              onComplete={(code) => handleVerifyOtp(code)}
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => handleVerifyOtp()}
              disabled={loading || otpCode.length < 6}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl shadow-lg shadow-brand-500/25 text-sm font-bold text-slate-950 bg-gradient-to-r from-brand-500 via-emerald-400 to-teal-400 hover:opacity-95 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Proceed</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setStep('INPUT');
                  setError(null);
                }}
                className="text-slate-400 hover:text-slate-200 transition"
              >
                Change {authType === 'EMAIL' ? 'email' : 'phone'}
              </button>

              <button
                type="button"
                disabled={countdown > 0 || loading}
                onClick={() => handleSendOtp()}
                className="text-brand-400 hover:text-brand-300 disabled:text-slate-600 font-semibold transition"
              >
                {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Password Fallback */}
        {step === 'PASSWORD' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl shadow-lg shadow-brand-500/25 text-sm font-bold text-slate-950 bg-gradient-to-r from-brand-500 via-emerald-400 to-teal-400 hover:opacity-95 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep('INPUT');
                  setError(null);
                }}
                className="text-xs text-slate-400 hover:text-brand-400 transition"
              >
                ← Back to passwordless login
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
