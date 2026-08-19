'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Offer } from '@/lib/mockData';
import { 
  Store, 
  Plus, 
  Sparkles, 
  QrCode, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Leaf, 
  Users, 
  CheckCircle2, 
  Trash2,
  Edit3,
  Calendar,
  KeyRound,
  ShieldCheck,
  Zap,
  Repeat
} from 'lucide-react';

interface BusinessViewProps {
  onOpenQRScanner: () => void;
}

export function BusinessView({ onOpenQRScanner }: BusinessViewProps) {
  const { offers, businesses, createMerchantOffer } = useApp();
  const merchantBusiness = businesses[0]; // "Kigali Artisan Bakery"
  const merchantOffers = offers.filter(o => o.businessId === merchantBusiness.id);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAutoScheduleModal, setShowAutoScheduleModal] = useState(false);
  const [autoScheduleActive, setAutoScheduleActive] = useState(true);
  
  // Cashier PIN state
  const [showPinModal, setShowPinModal] = useState(false);
  const [cashierPin, setCashierPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  // Create Offer Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Bakery');
  const [originalPrice, setOriginalPrice] = useState(15000);
  const [discountedPrice, setDiscountedPrice] = useState(4500);
  const [quantity, setQuantity] = useState(5);
  const [pickupStart, setPickupStart] = useState('18:00');
  const [pickupEnd, setPickupEnd] = useState('19:30');
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [isVegan, setIsVegan] = useState(false);
  const [isHalal, setIsHalal] = useState(true);
  const [isGlutenFree, setIsGlutenFree] = useState(false);

  // AI Assistant calculation
  const calculatedDiscount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  const aiSuggestedPrice = Math.round(originalPrice * 0.3);

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    createMerchantOffer({
      businessId: merchantBusiness.id,
      businessName: merchantBusiness.name,
      title,
      description,
      category,
      originalPrice,
      discountedPrice,
      currency: 'RWF',
      quantityTotal: quantity,
      quantityAvailable: quantity,
      pickupStart,
      pickupEnd,
      imageUrl: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=800',
      distanceKm: merchantBusiness.distanceKm,
      isVegetarian,
      isVegan,
      isHalal,
      isGlutenFree,
    });

    setShowCreateModal(false);
    setTitle('');
    setDescription('');
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cashierPin.length === 4) {
      setPinSuccess(true);
      setTimeout(() => {
        setPinSuccess(false);
        setShowPinModal(false);
        setCashierPin('');
        onOpenQRScanner();
      }, 800);
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* Merchant Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/30">
        <div className="flex items-center space-x-4">
          <img
            src={merchantBusiness.logoUrl}
            alt={merchantBusiness.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500/40 shadow-lg"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100">{merchantBusiness.name}</h1>
              <span className="bg-brand-500/20 text-brand-400 border border-brand-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Verified Food Partner
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{merchantBusiness.address} • {merchantBusiness.phone}</p>
          </div>
        </div>

        {/* Quick Merchant Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Quick Cashier PIN Login */}
          <button
            onClick={() => setShowPinModal(true)}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-indigo-400" />
            <span>Counter PIN Scanner</span>
          </button>

          {/* Recurring Auto Scheduler */}
          <button
            onClick={() => setShowAutoScheduleModal(true)}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
          >
            <Repeat className="w-4 h-4 text-amber-400" />
            <span>Daily Auto-Schedule</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-brand-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post Surplus Offer</span>
          </button>
        </div>
      </div>

      {/* Merchant Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Surplus Revenue</span>
          <p className="text-2xl font-black text-brand-400">485,000 RWF</p>
          <span className="text-[10px] text-emerald-400 font-semibold">+18% vs last month</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Active Surplus Packages</span>
          <p className="text-2xl font-black text-amber-400">{merchantOffers.length} Live</p>
          <span className="text-[10px] text-slate-400">Synced to Kigali Marketplace</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Food Rescued Locally</span>
          <p className="text-2xl font-black text-emerald-400">142 kg</p>
          <span className="text-[10px] text-slate-400">355 kg CO₂ prevented</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Customer Freshness Rating</span>
          <p className="text-2xl font-black text-slate-100">4.9 ★</p>
          <span className="text-[10px] text-slate-400">128 verified ratings</span>
        </div>
      </div>

      {/* Inventory & Offer Management Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Active Inventory & Mystery Packages</h3>
            <p className="text-xs text-slate-400">Manage published food offers, adjust inventory, and verify AI demand scores.</p>
          </div>
          <span className="text-xs font-mono text-brand-400 font-bold">{merchantOffers.length} active listings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-xl">Package Details</th>
                <th className="p-3.5">Retail vs Discount Price</th>
                <th className="p-3.5">Stock Available</th>
                <th className="p-3.5">Pickup Schedule</th>
                <th className="p-3.5">AI Demand Score</th>
                <th className="p-3.5 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {merchantOffers.map(offer => (
                <tr key={offer.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 flex items-center space-x-3">
                    <img src={offer.imageUrl} alt={offer.title} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                    <div>
                      <p className="font-bold text-slate-100">{offer.title}</p>
                      <p className="text-[10px] text-slate-400">{offer.category}</p>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-brand-400">{offer.discountedPrice.toLocaleString()} RWF</span>
                    <span className="text-[10px] text-slate-500 line-through ml-1.5">{offer.originalPrice.toLocaleString()}</span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-200">
                    {offer.quantityAvailable} / {offer.quantityTotal} left
                  </td>
                  <td className="p-3.5 text-slate-300 font-medium">
                    {offer.pickupStart} - {offer.pickupEnd}
                  </td>
                  <td className="p-3.5">
                    <span className="bg-amber-950/80 text-amber-400 font-bold px-2 py-0.5 rounded-md text-[10px]">
                      ⚡ {offer.aiDemandScore}% High Demand
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE OFFER MODAL WITH AI ASSIST */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-6 my-8">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-brand-400" />
                <h3 className="text-lg font-bold text-slate-100">Post New Chef&apos;s Surprise Bag</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-4 text-xs">
              
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Package Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chef's Evening Surprise Pastry Box"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Description (Contents Hint)</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Freshly baked sourdough, croissants, and tarts prepared today..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Pricing & AI Assist */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-brand-400 font-bold">
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Dynamic Price Advisor</span>
                  </span>
                  <span className="text-[10px] text-amber-400">-{calculatedDiscount}% Discount</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Original Retail Value (RWF)</label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Discounted Rescue Price</label>
                    <input
                      type="number"
                      value={discountedPrice}
                      onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-brand-400 font-bold focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between bg-slate-900 p-2 rounded-xl">
                  <span>AI Recommended Markdown:</span>
                  <button
                    type="button"
                    onClick={() => setDiscountedPrice(aiSuggestedPrice)}
                    className="font-bold text-brand-400 underline cursor-pointer"
                  >
                    Apply {aiSuggestedPrice.toLocaleString()} RWF (70% Off)
                  </button>
                </div>
              </div>

              {/* Stock Quantity & Schedule */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Pickup Start</label>
                  <input
                    type="text"
                    value={pickupStart}
                    onChange={(e) => setPickupStart(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Pickup End</label>
                  <input
                    type="text"
                    value={pickupEnd}
                    onChange={(e) => setPickupEnd(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-slate-950 py-3 rounded-2xl font-black text-sm shadow-xl shadow-brand-500/20 transition cursor-pointer"
              >
                Publish Surplus Offer Immediately
              </button>

            </form>

          </div>
        </div>
      )}

      {/* DAILY AUTO-SCHEDULE MODAL */}
      {showAutoScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Repeat className="w-5 h-5 text-amber-400" />
                <span>Daily Recurring Surplus Schedule</span>
              </h3>
              <button onClick={() => setShowAutoScheduleModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Eliminate daily manual listing! FreshFind will automatically publish <strong className="text-slate-200">5 Surprise Bakery Boxes</strong> every weekday at 18:00 unless paused.
            </p>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Recurring Status</span>
              <button
                onClick={() => setAutoScheduleActive(!autoScheduleActive)}
                className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                  autoScheduleActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {autoScheduleActive ? 'Enabled (Daily 18:00)' : 'Disabled'}
              </button>
            </div>

            <button
              onClick={() => setShowAutoScheduleModal(false)}
              className="w-full bg-brand-500 text-slate-950 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
            >
              Save Schedule Preferences
            </button>
          </div>
        </div>
      )}

      {/* CASHIER COUNTER PIN MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xs w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-100">Counter Staff Quick Login</h3>
              <p className="text-xs text-slate-400 mt-1">Enter 4-digit staff PIN to unlock customer QR scanner.</p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={cashierPin}
                onChange={(e) => setCashierPin(e.target.value)}
                placeholder="••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl py-3 text-center text-2xl font-mono tracking-widest text-brand-400 focus:outline-none focus:border-brand-500"
              />

              {pinSuccess ? (
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PIN Verified! Launching Scanner...</span>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={cashierPin.length < 4}
                  className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-slate-950 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
                >
                  Unlock QR Scanner
                </button>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
