'use client';

import React, { useState } from 'react';
import { X, Trees, Smartphone, Car, Award, Share2, Check, Sparkles, Heart } from 'lucide-react';

interface EcoImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealsRescued: number;
  co2SavedKg: number;
  userName: string;
}

export function EcoImpactModal({
  isOpen,
  onClose,
  mealsRescued,
  co2SavedKg,
  userName,
}: EcoImpactModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Real-world tangible environmental equivalency formulas
  const treeDays = Math.round(co2SavedKg * 16.5); // Tree days of carbon absorption
  const smartphoneCharges = Math.round(co2SavedKg * 122); // Full smartphone battery cycles
  const carKmOffset = Math.round(co2SavedKg * 6.8); // Km driven by average petrol car
  const estimatedMoneySaved = Math.round(mealsRescued * 9500); // Average RWF saved per surprise bag

  const handleShare = () => {
    const shareText = `🌍 I've rescued ${mealsRescued} meals and avoided ${co2SavedKg}kg of CO2 on FreshFind! That's equal to ${treeDays} tree-days and ${smartphoneCharges.toLocaleString()} smartphone charges. Join the food rescue revolution! 🍃`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8">
        
        {/* Header with Eco Pattern */}
        <div className="relative bg-gradient-to-tr from-emerald-950 via-slate-900 to-teal-950 p-6 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-emerald-400 mb-1">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-black tracking-widest uppercase">Planet Hero Impact Card</span>
          </div>
          <h3 className="text-xl font-black text-white">{userName}&apos;s Food Rescue Footprint</h3>
          <p className="text-xs text-slate-400 mt-1">Here is the tangible difference your rescued meals made.</p>
        </div>

        {/* Tangible Metrics Cards */}
        <div className="p-6 space-y-4">
          
          {/* Main Totals */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <p className="text-2xl font-black text-emerald-400">{mealsRescued}</p>
              <p className="text-[11px] font-bold text-slate-400 mt-0.5">Surprise Meals Rescued</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <p className="text-2xl font-black text-teal-400">{co2SavedKg} kg</p>
              <p className="text-[11px] font-bold text-slate-400 mt-0.5">CO₂e Emissions Avoided</p>
            </div>
          </div>

          {/* Relatable Real-World Equivalents */}
          <div className="space-y-2.5 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Real-World Planet Equivalents
            </h4>

            {/* Tree Days */}
            <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-emerald-950/20 border border-emerald-900/40">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Trees className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-slate-100">{treeDays.toLocaleString()} Tree-Days</p>
                <p className="text-[10px] text-slate-400">Equivalent carbon absorbed by adult trees in one day.</p>
              </div>
            </div>

            {/* Smartphone Charges */}
            <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-teal-950/20 border border-teal-900/40">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-slate-100">{smartphoneCharges.toLocaleString()} Smartphone Charges</p>
                <p className="text-[10px] text-slate-400">Total electrical energy footprint saved.</p>
              </div>
            </div>

            {/* Car Commute Offset */}
            <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-blue-950/20 border border-blue-900/40">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Car className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-slate-100">{carKmOffset.toLocaleString()} km Offset</p>
                <p className="text-[10px] text-slate-400">Equivalent exhaust emissions from city driving avoided.</p>
              </div>
            </div>

            {/* Estimated Money Saved */}
            <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-amber-950/20 border border-amber-900/40">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-black text-xs">
                RWF
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-slate-100">~{estimatedMoneySaved.toLocaleString()} RWF Saved</p>
                <p className="text-[10px] text-slate-400">Saved compared to regular restaurant and supermarket prices.</p>
              </div>
            </div>

          </div>

          {/* Share Action */}
          <button
            onClick={handleShare}
            className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 py-3 rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Impact Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share My Eco-Hero Impact Card</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
}
