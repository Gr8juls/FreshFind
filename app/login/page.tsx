'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, Lock, Mail, Phone, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/lib/store';
import { OtpInput } from '@/components/auth/OtpInput';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { AppleSignInButton } from '@/components/auth/AppleSignInButton';

export default function LoginPage() {
  const router = useRouter();
  const { fetchSession } = useApp();

  const [step, setStep] = useState<'INPUT' | 'OTP' | 'PASSWORD'>('INPUT');
  const [authType, setAuthType] = useState<'EMAIL' | 'PHONE'>('EMAIL');
  const [identifier, setIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRedirect = (role?: string) => {
    if (role === 'BUSINESS_OWNER' || role === 'BUSINESS_MANAGER' || role === 'BUSINESS_STAFF') {
      router.push('/business');
    } else if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      router.push('/admin');
    } else {
      router.push('/');
    }
    router.refresh();
  };

  // 1. Send OTP (Email or Phone)
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

  // 2. Verify OTP
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

      handleRedirect(data.user?.role);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // 3. Password Login (Traditional fallback)
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

      handleRedirect(data.user?.role);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // 4. Social login callback
  const handleSocialSuccess = async (data: any) => {
    if (fetchSession) {
      await fetchSession();
    }
    handleRedirect(data.user?.role);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-7 h-7 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-brand-400 bg-clip-text text-transparent">
                FreshFind
              </span>
            </div>
          </Link>
        </div>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          Welcome to FreshFind
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Save delicious meals & reduce food waste across Kigali
        </p>
      </div>

      {/* Card Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center space-x-3 text-red-400 text-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Fast Social + Passwordless Identifier Input */}
          {step === 'INPUT' && (
            <div className="space-y-5">
              {/* 1-Tap Social Buttons */}
              <div className="space-y-3">
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
              <div className="relative flex items-center justify-center my-5">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-slate-900/90 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  or continue with
                </span>
                <div className="border-t border-slate-800 w-full" />
              </div>

              {/* Email / Phone Toggle */}
              <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setAuthType('EMAIL');
                    setError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                    authType === 'EMAIL'
                      ? 'bg-brand-500/20 text-brand-400 shadow-sm border border-brand-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Email Address
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthType('PHONE');
                    setError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                    authType === 'PHONE'
                      ? 'bg-brand-500/20 text-brand-400 shadow-sm border border-brand-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Phone (Rwanda)
                </button>
              </div>

              {/* Identifier Input Form */}
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    {authType === 'EMAIL' ? 'Email address' : 'Phone number'}
                  </label>
                  <div className="relative">
                    {authType === 'EMAIL' ? (
                      <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    ) : (
                      <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    )}
                    <input
                      type={authType === 'EMAIL' ? 'email' : 'tel'}
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={authType === 'EMAIL' ? 'you@domain.com' : 'e.g. 078XXXXXXX or +250...'}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-xl shadow-lg shadow-brand-500/25 text-sm font-bold text-slate-950 bg-gradient-to-r from-brand-500 via-emerald-400 to-teal-400 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 transition cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
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

              {/* Toggle to Password */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep('PASSWORD');
                    setError(null);
                  }}
                  className="text-xs text-slate-400 hover:text-brand-400 transition cursor-pointer"
                >
                  Have a password? Use standard sign in
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: 6-Digit OTP Screen */}
          {step === 'OTP' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">Enter verification code</h3>
                <p className="text-xs text-slate-400 mt-1">
                  We sent a 6-digit code to <strong className="text-slate-200">{identifier}</strong>
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
                className="w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-xl shadow-lg shadow-brand-500/25 text-sm font-bold text-slate-950 bg-gradient-to-r from-brand-500 via-emerald-400 to-teal-400 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 transition cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Continue</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setStep('INPUT');
                    setError(null);
                  }}
                  className="text-slate-400 hover:text-slate-200 transition cursor-pointer"
                >
                  ← Edit {authType === 'EMAIL' ? 'email' : 'phone'}
                </button>

                <button
                  type="button"
                  disabled={countdown > 0 || loading}
                  onClick={() => handleSendOtp()}
                  className="text-brand-400 hover:text-brand-300 disabled:text-slate-600 font-semibold transition cursor-pointer"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Password Fallback Form */}
          {step === 'PASSWORD' && (
            <form className="space-y-5" onSubmit={handlePasswordLogin}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-xl shadow-lg shadow-brand-500/25 text-sm font-bold text-slate-950 bg-gradient-to-r from-brand-500 via-emerald-400 to-teal-400 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 transition cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setStep('INPUT');
                    setError(null);
                  }}
                  className="text-xs text-slate-400 hover:text-brand-400 transition cursor-pointer"
                >
                  ← Back to passwordless login
                </button>
              </div>
            </form>
          )}

          {/* Business Sign up link */}
          <div className="mt-6 border-t border-slate-800 pt-6 text-center text-sm">
            <p className="text-slate-400">
              Own a restaurant or bakery?{' '}
              <Link href="/register" className="font-semibold text-brand-400 hover:text-brand-300 transition">
                Register as Business Partner
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
