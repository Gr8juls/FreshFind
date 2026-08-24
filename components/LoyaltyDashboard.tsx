'use client';

import React, { useState } from 'react';
import { Leaf, Award, Utensils, Sparkles, Trees, Smartphone, ChevronRight } from 'lucide-react';
import { useApp } from '@/lib/store';
import { EcoImpactModal } from './EcoImpactModal';

export default function LoyaltyDashboard() {
  const { user } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const meals = user.mealsRescued ?? 18;
  const co2 = user.co2SavedKg ?? 45.2;
  const points = user.points ?? 480;
  const badgeTier = user.badgeTier || 'Waste Warrior 🌿';

  const treeDays = Math.round(co2 * 16.5);
  const phoneCharges = Math.round(co2 * 122);

  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/60 border border-slate-800 shadow-2xl text-white">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-brand-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Live Eco Footprint</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-brand-300">
              Community Food Rescue Impact
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-brand-500/10 rounded-full border border-brand-500/30">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-brand-300">{badgeTier}</span>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full text-xs font-bold transition border border-slate-700 cursor-pointer"
            >
              <span>View Equivalence Card</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar to next tier */}
        <div className="mb-6 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-400">Eco-Hero Progress</span>
            <span className="font-bold text-brand-400">{points} / 1000 Points to Next Tier</span>
          </div>
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((points / 1000) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* 4 Impact Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          
          <div 
            onClick={() => setIsModalOpen(true)}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-brand-500/40 flex flex-col items-center justify-center text-center transition cursor-pointer group"
          >
            <div className="p-2 bg-emerald-500/10 rounded-xl mb-2 group-hover:scale-110 transition-transform">
              <Utensils className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-2xl font-black text-white">{meals}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Meals Rescued</span>
          </div>
          
          <div 
            onClick={() => setIsModalOpen(true)}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-brand-500/40 flex flex-col items-center justify-center text-center transition cursor-pointer group"
          >
            <div className="p-2 bg-teal-500/10 rounded-xl mb-2 group-hover:scale-110 transition-transform">
              <Leaf className="w-5 h-5 text-teal-400" />
            </div>
            <span className="text-2xl font-black text-teal-300">{co2} kg</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">CO₂e Avoided</span>
          </div>

          <div 
            onClick={() => setIsModalOpen(true)}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-brand-500/40 flex flex-col items-center justify-center text-center transition cursor-pointer group"
          >
            <div className="p-2 bg-emerald-500/10 rounded-xl mb-2 group-hover:scale-110 transition-transform">
              <Trees className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-2xl font-black text-white">{treeDays}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Tree-Days Eq.</span>
          </div>

          <div 
            onClick={() => setIsModalOpen(true)}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-brand-500/40 flex flex-col items-center justify-center text-center transition cursor-pointer group"
          >
            <div className="p-2 bg-blue-500/10 rounded-xl mb-2 group-hover:scale-110 transition-transform">
              <Smartphone className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-2xl font-black text-blue-300">{phoneCharges.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Phone Charges</span>
          </div>

        </div>
      </div>

      <EcoImpactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mealsRescued={meals}
        co2SavedKg={co2}
        userName={user.fullName || 'Food Rescue Hero'}
      />
    </>
  );
}
