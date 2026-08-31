'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/lib/mockData';
import { 
  Award, 
  Leaf, 
  Sparkles, 
  Share2, 
  Trees, 
  Check, 
  ShieldCheck, 
  QrCode,
  Smartphone,
  Utensils
} from 'lucide-react';

interface EcoPassportCardProps {
  user: UserProfile;
}

export function EcoPassportCard({ user }: EcoPassportCardProps) {
  const [copied, setCopied] = useState(false);

  const meals = user.mealsRescued || 18;
  const co2 = user.co2SavedKg || 45.2;
  const treeDays = Math.round(co2 * 16.5);
  const phoneCharges = Math.round(co2 * 122);
  const badgeTier = user.badgeTier || 'Waste Warrior 🌿';

  const handleShare = async () => {
    const text = `🌿 I have rescued ${meals} surprise meals and prevented ${co2}kg of CO2 emissions in Kigali with FreshFind! Check my Eco Passport: https://freshfind.rw/passport/${user.id}`;
    
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'FreshFind Eco Passport',
          text,
          url: 'https://freshfind.rw',
        });
        return;
      } catch (err) {}
    }

    // Fallback: clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 p-6 sm:p-8 text-white shadow-2xl space-y-6">
      
      {/* Background glowing watermark */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 backdrop-blur-md">
            <Leaf className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Official Climate Credential</span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">Kigali Eco Passport</h3>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-emerald-500 hover:text-slate-950 text-white border border-white/20 text-xs font-extrabold transition cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied Link!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Passport</span>
            </>
          )}
        </button>
      </div>

      {/* User profile section */}
      <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative z-10">
        <img
          src={user.avatarUrl || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'}
          alt={user.fullName}
          className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400/50 shadow-md"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-black truncate">{user.fullName}</h4>
          <p className="text-xs text-emerald-300 font-medium">Passport ID: FF-RW-{user.id.toUpperCase()}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
              {badgeTier}
            </span>
            <span className="text-[11px] text-slate-300">
              Rank: Top 5% Rescuer
            </span>
          </div>
        </div>

        {/* QR Stamp */}
        <div className="hidden sm:flex flex-col items-center justify-center p-2 rounded-xl bg-white text-slate-950">
          <QrCode className="w-8 h-8" />
          <span className="text-[8px] font-black uppercase tracking-tighter">Verified</span>
        </div>
      </div>

      {/* 4 Impact Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
          <Utensils className="w-4 h-4 mx-auto text-emerald-400" />
          <p className="text-xl font-black text-white">{meals}</p>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Meals Rescued</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
          <Leaf className="w-4 h-4 mx-auto text-teal-400" />
          <p className="text-xl font-black text-teal-300">{co2} kg</p>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">CO₂e Avoided</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
          <Trees className="w-4 h-4 mx-auto text-emerald-400" />
          <p className="text-xl font-black text-emerald-300">{treeDays}</p>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tree Days Eq.</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
          <Smartphone className="w-4 h-4 mx-auto text-blue-400" />
          <p className="text-xl font-black text-blue-300">{phoneCharges.toLocaleString()}</p>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Phone Charges</p>
        </div>
      </div>

      {/* Footer stamp */}
      <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 relative z-10 gap-2">
        <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>City of Kigali Sustainable Food Rescue Network</span>
        </div>
        <span className="text-[11px] font-mono">Issued 2026 • Valid Indefinitely</span>
      </div>

    </div>
  );
}
