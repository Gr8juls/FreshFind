'use client';

import React, { useState } from 'react';
import { Sparkles, TrendingUp, DollarSign, Leaf, Zap, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

import { Offer } from '@/lib/mockData';

const DEMAND_TIMELINE = [
  { hour: '14:00', demand: 35, optimalPrice: 9000 },
  { hour: '16:00', demand: 55, optimalPrice: 7500 },
  { hour: '18:00', demand: 88, optimalPrice: 5000 },
  { hour: '19:00', demand: 96, optimalPrice: 4500 },
  { hour: '20:00', demand: 70, optimalPrice: 4000 },
];

export interface AIDemandForecastWidgetProps {
  offers?: Offer[];
  onSelectOffer?: (offer: Offer) => void;
}

export const AIDemandForecastWidget: React.FC<AIDemandForecastWidgetProps> = ({ offers, onSelectOffer }) => {
  const [activeTab, setActiveTab] = useState<'DEMAND' | 'PRICING' | 'WASTE'>('DEMAND');

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-brand-500/20 to-emerald-500/20 text-brand-400 border border-brand-500/30">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-100 flex items-center space-x-2">
              <span>FreshFind Intelligence Engine</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                AI v2.4 Active
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Predictive models trained on 50,000+ local food rescue transactions.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('DEMAND')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'DEMAND' ? 'bg-brand-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Demand Curve
          </button>
          <button
            onClick={() => setActiveTab('PRICING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'PRICING' ? 'bg-brand-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Price Optimizer
          </button>
          <button
            onClick={() => setActiveTab('WASTE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'WASTE' ? 'bg-brand-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Waste Forecast
          </button>
        </div>
      </div>

      {/* Content Panels */}
      {activeTab === 'DEMAND' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Peak Purchase Window</span>
              <p className="text-xl font-black text-brand-400 mt-1">18:00 - 19:30</p>
              <span className="text-[10px] text-slate-500">96% Sell-out probability</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Recommended Stock Qty</span>
              <p className="text-xl font-black text-amber-400 mt-1">8 Packages</p>
              <span className="text-[10px] text-slate-500">Based on bakery daily average</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Est. Rescue Velocity</span>
              <p className="text-xl font-black text-emerald-400 mt-1">12 mins / order</p>
              <span className="text-[10px] text-slate-500">Fast customer pickup speed</span>
            </div>
          </div>

          {/* Recharts Curve */}
          <div className="h-44 w-full bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEMAND_TIMELINE}>
                <defs>
                  <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="demand" stroke="#10B981" fillOpacity={1} fill="url(#demandGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'PRICING' && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center text-xs text-slate-300">
            <span className="font-bold text-brand-400">Dynamic Discount Recommendation Engine</span>
            <span>Max Profit vs 0% Food Waste Balance</span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 bg-slate-900 rounded-xl border border-slate-800">
              <div>
                <p className="font-bold text-slate-200">Pastry Surprise Bag</p>
                <p className="text-[10px] text-slate-400">Original Retail: 15,000 RWF</p>
              </div>
              <div className="text-right">
                <span className="font-black text-brand-400 text-sm">Suggested: 4,500 RWF</span>
                <p className="text-[10px] text-amber-400">Optimal 70% Discount</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900 rounded-xl border border-slate-800">
              <div>
                <p className="font-bold text-slate-200">Buffet Feast Tray</p>
                <p className="text-[10px] text-slate-400">Original Retail: 35,000 RWF</p>
              </div>
              <div className="text-right">
                <span className="font-black text-brand-400 text-sm">Suggested: 9,800 RWF</span>
                <p className="text-[10px] text-amber-400">Optimal 72% Discount</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'WASTE' && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <Leaf className="w-5 h-5" />
            <span>Kigali Food Waste Prevention Forecast (Next 30 Days)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-slate-900 rounded-xl">
              <span className="text-[10px] text-slate-400">Rescued Meals</span>
              <p className="text-base font-extrabold text-brand-400">1,450 Meals</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl">
              <span className="text-[10px] text-slate-400">CO₂ Avoided</span>
              <p className="text-base font-extrabold text-emerald-400">3,625 kg</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl">
              <span className="text-[10px] text-slate-400">Water Saved</span>
              <p className="text-base font-extrabold text-blue-400">18,200 L</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl">
              <span className="text-[10px] text-slate-400">Merchant Savings</span>
              <p className="text-base font-extrabold text-amber-400">6.8M RWF</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
