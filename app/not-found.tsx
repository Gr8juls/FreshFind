'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto">
          <Leaf className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black text-brand-400 font-mono">404</span>
          <h2 className="text-xl font-bold text-slate-100">Page Not Found</h2>
          <p className="text-xs text-slate-400">
            The food offer or portal page you are looking for does not exist or has expired.
          </p>
        </div>

        <Link
          href="/"
          className="w-full flex items-center justify-center space-x-2 bg-brand-500 hover:bg-brand-400 text-slate-950 py-3 rounded-xl font-bold text-xs transition shadow-lg shadow-brand-500/20"
        >
          <Home className="w-4 h-4" />
          <span>Return to Marketplace</span>
        </Link>
      </div>
    </div>
  );
}
