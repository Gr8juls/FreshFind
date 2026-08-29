'use client';

import React, { useState } from 'react';
import { 
  Check, 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  DollarSign, 
  Zap, 
  X, 
  CheckCircle2, 
  ArrowRight,
  CreditCard
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { VENDOR_SUBSCRIPTION_PLANS, VendorSubscriptionPlan } from '@/lib/mockData';

export function VendorSubscriptionModal() {
  const { 
    isSubscriptionModalOpen, 
    setIsSubscriptionModalOpen, 
    businesses, 
    upgradeBusinessSubscription 
  } = useApp();

  const activeMerchant = businesses[0];
  const currentTier = activeMerchant.subscriptionTier || 'FREE';

  const [selectedTier, setSelectedTier] = useState<'FREE' | 'PRO' | 'ENTERPRISE'>(currentTier);
  const [paymentMethod, setPaymentMethod] = useState<'MTN_MOMO' | 'STRIPE_CARD'>('MTN_MOMO');
  const [momoPhone, setMomoPhone] = useState('+250 788 123 456');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isSubscriptionModalOpen) return null;

  const handleUpgrade = async (plan: VendorSubscriptionPlan) => {
    setIsProcessing(true);
    try {
      await upgradeBusinessSubscription(activeMerchant.id, plan.id);
      setSuccessToast(`🎉 Successfully activated ${plan.name}! Commission dropped to ${plan.commissionRate}%.`);
      setTimeout(() => {
        setSuccessToast(null);
        setIsSubscriptionModalOpen(false);
      }, 2000);
    } catch (e) {
      console.error('Failed to upgrade subscription:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 text-amber-400 border border-amber-500/30">
              <Crown className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-slate-100">FreshFind Merchant Subscriptions</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Cut Commissions &amp; Unlock AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Lower your marketplace take-rate from 22% down to 10% and automate listings with AI.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSubscriptionModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="p-4 bg-emerald-950/90 border border-emerald-500 rounded-2xl text-xs text-emerald-300 flex items-center space-x-2 font-bold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {VENDOR_SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = currentTier === plan.id;
            const isSelected = selectedTier === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedTier(plan.id)}
                className={`relative rounded-3xl p-5 sm:p-6 space-y-4 border transition cursor-pointer flex flex-col justify-between ${
                  plan.isPopular
                    ? 'bg-gradient-to-b from-slate-900 via-emerald-950/30 to-slate-950 border-emerald-500 shadow-xl shadow-emerald-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                } ${isSelected ? 'ring-2 ring-emerald-400' : ''}`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <h4 className="text-base font-black text-slate-100">{plan.name}</h4>
                    <p className="text-[11px] text-slate-400 leading-tight mt-1">{plan.description}</p>
                  </div>

                  <div className="border-y border-slate-800/80 py-3 space-y-1">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-black text-slate-100">
                        {plan.priceMonthly === 0 ? 'Free' : `${plan.priceMonthly.toLocaleString()} RWF`}
                      </span>
                      {plan.priceMonthly > 0 && (
                        <span className="text-xs text-slate-400">/ month</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{plan.commissionRate}% Commission Rate</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2 text-xs">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-2 text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  disabled={isCurrent || isProcessing}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpgrade(plan);
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer mt-4 ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-400 cursor-default'
                      : plan.isPopular
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-100'
                  }`}
                >
                  {isCurrent ? 'Current Plan Active' : `Select ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Payment & MoMo Billing Box */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="font-bold text-slate-200">Billing via MTN Mobile Money / Card</p>
              <p className="text-[10px] text-slate-400">Cancel or upgrade anytime with instant auto-prorated billing.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-mono text-[11px]">{activeMerchant.name} ({activeMerchant.payoutPhone})</span>
          </div>
        </div>

      </div>
    </div>
  );
}
