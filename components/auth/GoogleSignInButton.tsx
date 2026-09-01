'use client';

import React, { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Loader2 } from 'lucide-react';

interface GoogleSignInButtonProps {
  onSuccess: (userData: any) => void;
  onError?: (error: string) => void;
}

export function GoogleSignInButton({ onSuccess, onError }: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      onError?.('No credential received from Google');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/oauth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Google login failed');
      }

      onSuccess(data);
    } catch (err: any) {
      console.error('Google login error:', err);
      onError?.(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative flex justify-center">
      {loading ? (
        <div className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-sm font-semibold">
          <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
          <span>Signing in with Google...</span>
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-2xl flex justify-center [&>div]:w-full [&>div>iframe]:!w-full [&>div]:!max-w-none">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              onError?.('Google login popup failed or was closed');
            }}
            theme="filled_black"
            size="large"
            text="continue_with"
            shape="pill"
            width="100%"
            logo_alignment="center"
          />
        </div>
      )}
    </div>
  );
}
