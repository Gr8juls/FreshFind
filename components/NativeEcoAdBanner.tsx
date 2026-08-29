'use client';

import React from 'react';
import { ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { INITIAL_NATIVE_ADS } from '@/lib/mockData';

interface NativeEcoAdBannerProps {
  adIndex?: number;
}

export function NativeEcoAdBanner({ adIndex = 0 }: NativeEcoAdBannerProps) {
  const ad = INITIAL_NATIVE_ADS[adIndex] || INITIAL_NATIVE_ADS[0];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 shadow-lg group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-center space-x-4">
          <img
            src={ad.imageUrl}
            alt={ad.sponsorName}
            className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow-md group-hover:scale-105 transition duration-300"
          />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                {ad.tag}
              </span>
              <span className="text-xs font-bold text-slate-300">{ad.sponsorName}</span>
            </div>
            <h4 className="text-sm font-black text-slate-100">{ad.title}</h4>
            <p className="text-xs text-slate-400 max-w-md">{ad.description}</p>
          </div>
        </div>

        <a
          href={ad.ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/50 text-xs font-bold transition shadow-sm self-start sm:self-auto shrink-0"
        >
          <span>{ad.ctaText}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

      </div>
    </div>
  );
}
