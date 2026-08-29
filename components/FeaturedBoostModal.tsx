'use client';

import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Send, 
  Eye, 
  Clock, 
  X 
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { Offer } from '@/lib/mockData';

interface FeaturedBoostModalProps {
  offer: Offer | null;
  isOpen: boolean;
  onClose: () => void;
}

const BOOST_PLANS = [
  {
    id: 'FLASH_1H',
    title: '⚡ 1-Hour Flash Surge',
    badge: '🔥 Top 1-Hour Flash Deal',
    price: 2000,
    duration: '1 Hour',
    reach: '3x more customer views in your district',
    isPopular: false,
  },
  {
    id: 'DAY_TOP',
    title: '🌟 All-Day Pinned Placement',
    badge: '🌟 Chef\'s Pinned Special',
    price: 4500,
    duration: 'Full Day',
    reach: 'Pinned at top of customer discovery feed & map',
    isPopular: true,
  },
  {
    id: 'PUSH_BLAST',
    title: '📢 Instant Push Notification Blast',
    badge: '📢 Verified Super Drop',
    price: 8000,
    duration: 'Immediate Blast',
    reach: 'Direct push alert to 500+ active foodies within 3km radius',
    isPopular: false,
  },
];

export function FeaturedBoostModal({ offer, isOpen, onClose }: FeaturedBoostModalProps) {
  const { boostOfferAsFeatured } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<string>('DAY_TOP');
  const [isBoosting, setIsBoosting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen || !offer) return null;

  const activePlan = BOOST_PLANS.find(p => p.id === selectedPlan) || BOOST_PLANS[1];

  const handleApplyBoost = async () => {
    setIsBoosting(true);
    try {
      await boostOfferAsFeatured(offer.id, activePlan.badge);
      setSuccessToast(`🚀 "${offer.title}" is now BOOSTED with "${activePlan.badge}"!`);
      setTimeout(() => {
        setSuccessToast(null);
        onClose();
      }, 2200);
    } catch (e) {
      console.error('Failed to boost offer:', e);
    } finally {
      setIsBoosting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 text-orange-400 border border-orange-500/30">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-slate-100">Boost to Featured Drop</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Monetized Boost
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pin your surplus drop at the top of the feed to sell out in under 15 minutes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Target Offer Preview */}
        <div className="flex items-center space-x-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
          <img src={offer.imageUrl} alt={offer.title} className="w-12 h-12 rounded-xl object-cover" />
          <div className="flex-1">
            <p className="font-bold text-slate-100">{offer.title}</p>
            <p className="text-[11px] text-emerald-400 font-bold">{offer.discountedPrice.toLocaleString()} RWF ({offer.quantityAvailable} left)</p>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-lg">
            {offer.pickupTiming === 'TOMORROW' ? 'Tomorrow' : 'Today'} {offer.pickupStart}
          </span>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="p-4 bg-emerald-950/90 border border-emerald-500 rounded-2xl text-xs text-emerald-300 flex items-center space-x-2 font-bold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Boost Plans */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Select Boost Package:
          </label>
          <div className="space-y-2.5">
            {BOOST_PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`p-4 rounded-2xl border text-xs transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-slate-950 border-orange-500 shadow-md'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-100">{plan.title}</span>
                      {plan.isPopular && (
                        <span className="text-[9px] font-black uppercase bg-orange-500 text-slate-950 px-2 py-0.5 rounded-full">
                          Top Choice
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{plan.reach}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-orange-400">{plan.price.toLocaleString()} RWF</span>
                    <p className="text-[10px] text-slate-500">{plan.duration}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleApplyBoost}
          disabled={isBoosting}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-xl shadow-orange-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50 cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>{isBoosting ? 'Activating Sponsored Boost...' : `Confirm Boost (${activePlan.price.toLocaleString()} RWF)`}</span>
        </button>

      </div>
    </div>
  );
}
