'use client';

import { useEffect, useState } from 'react';
import { Leaf, Award, Utensils, Droplets } from 'lucide-react';

interface LoyaltyData {
  points: number;
  badgeTier: string;
  mealsRescued: number;
  co2SavedKg: number;
}

export default function LoyaltyDashboard() {
  const [data, setData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/loyalty')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-white/20 rounded-xl mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-16 bg-white/20 rounded-xl"></div>
          <div className="h-16 bg-white/20 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-3xl bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-xl border border-white/10 shadow-2xl text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-100">
          Your Impact
        </h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
          <Award className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-semibold">{data.badgeTier}</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2 opacity-80">
          <span>Current Points</span>
          <span className="font-bold">{data.points} / 1000 to Next Tier</span>
        </div>
        <div className="h-3 w-full bg-black/30 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
            style={{ width: `${Math.min((data.points / 1000) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center transition-transform hover:scale-105">
          <div className="p-2 bg-emerald-500/20 rounded-full mb-2">
            <Utensils className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold">{data.mealsRescued}</span>
          <span className="text-xs opacity-70 uppercase tracking-wider mt-1">Meals Rescued</span>
        </div>
        
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center transition-transform hover:scale-105">
          <div className="p-2 bg-blue-500/20 rounded-full mb-2">
            <Leaf className="w-6 h-6 text-blue-400" />
          </div>
          <span className="text-2xl font-bold">{data.co2SavedKg} kg</span>
          <span className="text-xs opacity-70 uppercase tracking-wider mt-1">CO₂ Saved</span>
        </div>
      </div>
    </div>
  );
}
