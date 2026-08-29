'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Leaf, 
  Zap, 
  Sliders, 
  ArrowRight,
  Bot
} from 'lucide-react';
import { useApp } from '@/lib/store';

export function SmartVendorAssistantModal() {
  const { 
    isVendorAssistantModalOpen, 
    setIsVendorAssistantModalOpen, 
    offers, 
    businesses, 
    applyDynamicMarkdown 
  } = useApp();

  const activeMerchant = businesses[0];
  const merchantOffers = offers.filter(o => o.businessId === activeMerchant.id);

  const [copilotData, setCopilotData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOfferToMarkdown, setSelectedOfferToMarkdown] = useState<string>(merchantOffers[0]?.id || '');
  const [markdownDiscount, setMarkdownDiscount] = useState<number>(75);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    if (isVendorAssistantModalOpen) {
      loadCopilotInsights();
    }
  }, [isVendorAssistantModalOpen]);

  const loadCopilotInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/vendor-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: activeMerchant.name,
          category: activeMerchant.category,
          activeOffers: merchantOffers.map(o => ({
            id: o.id,
            title: o.title,
            originalPrice: o.originalPrice,
            discountedPrice: o.discountedPrice,
            quantityAvailable: o.quantityAvailable,
            pickupEnd: o.pickupEnd,
          })),
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setCopilotData(json.data);
      }
    } catch (e) {
      console.error('Failed to load copilot insights:', e);
    } finally {
      setLoading(false);
    }
  };

  if (!isVendorAssistantModalOpen) return null;

  const targetOffer = merchantOffers.find(o => o.id === selectedOfferToMarkdown) || merchantOffers[0];
  const dynamicPrice = targetOffer ? Math.round(targetOffer.originalPrice * ((100 - markdownDiscount) / 100)) : 0;
  const estimatedSelloutProbability = markdownDiscount >= 75 ? 98 : markdownDiscount >= 65 ? 85 : 68;

  const handleApplyMarkdown = () => {
    if (!targetOffer) return;
    applyDynamicMarkdown(targetOffer.id, dynamicPrice);
    setSuccessToast(`Dynamic Markdown of ${dynamicPrice.toLocaleString()} RWF applied to ${targetOffer.title}!`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-slate-100">Smart Vendor Copilot</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  24/7 AI Kitchen Co-Pilot
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time sell-through optimization, closing-hour dynamic markdowns, and waste prevention.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVendorAssistantModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Real-time Summary Cards */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Unsold Surplus Bags</span>
            <p className="text-xl font-black text-amber-400">
              {copilotData?.totalSurplusBags || merchantOffers.reduce((s, o) => s + o.quantityAvailable, 0)} Bags
            </p>
            <span className="text-[10px] text-slate-500">Live in Kigali</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Est. Recovery Value</span>
            <p className="text-xl font-black text-emerald-400">
              {(copilotData?.estRecoveredRevenue || 485000).toLocaleString()} RWF
            </p>
            <span className="text-[10px] text-emerald-400">100% Margin Rescue</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Closing Window</span>
            <p className="text-xl font-black text-slate-200">1h 45m left</p>
            <span className="text-[10px] text-slate-500">Peak pickup: 18:30</span>
          </div>
        </div>

        {/* Dynamic Price & Sell-Through Optimization Simulator */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <h4 className="font-extrabold text-slate-100 text-xs uppercase tracking-wider">
                Dynamic Markdown Simulator (Guarantee 100% Sell-Out)
              </h4>
            </div>
            <span className="text-[10px] text-slate-400">Targeting 0% Food Waste</span>
          </div>

          {/* Select Offer */}
          <div className="text-xs space-y-1.5">
            <label className="text-slate-300 font-bold">Select Mystery Bag Drop:</label>
            <select
              value={selectedOfferToMarkdown}
              onChange={(e) => setSelectedOfferToMarkdown(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {merchantOffers.map(o => (
                <option key={o.id} value={o.id}>
                  {o.title} (Qty: {o.quantityAvailable} left, Current: {o.discountedPrice.toLocaleString()} RWF)
                </option>
              ))}
            </select>
          </div>

          {/* Markdown Slider */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span>Adjust Discount Rate:</span>
              <span className="font-mono font-black text-emerald-400 text-sm">{markdownDiscount}% OFF</span>
            </div>
            <input
              type="range"
              min="50"
              max="85"
              step="5"
              value={markdownDiscount}
              onChange={(e) => setMarkdownDiscount(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>50% (Standard)</span>
              <span>70% (Optimal)</span>
              <span>85% (Last 30 Mins Flash)</span>
            </div>
          </div>

          {/* Probability Matrix */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-400">New Rescue Price:</span>
              <p className="text-base font-black text-emerald-400">{dynamicPrice.toLocaleString()} RWF</p>
              <span className="text-[10px] text-slate-500 line-through">
                {targetOffer?.originalPrice.toLocaleString()} RWF Retail
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">AI Sell-Out Probability:</span>
              <p className="text-base font-black text-emerald-400">{estimatedSelloutProbability}% Guaranteed</p>
              <span className="text-[10px] text-emerald-400 font-semibold">⚡ Est. pickup in 14 mins</span>
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApplyMarkdown}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <span>Apply Dynamic Markdown to Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Smart Alerts Stream */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
            AI Kitchen Operations Feed:
          </span>
          <div className="space-y-2">
            {copilotData?.smartAlerts?.map((alert: any) => (
              <div key={alert.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200">{alert.title}</span>
                    <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
