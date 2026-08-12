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
  Edit3
} from 'lucide-react';

interface BusinessViewProps {
  onOpenQRScanner: () => void;
}

export function BusinessView({ onOpenQRScanner }: BusinessViewProps) {
  const { offers, businesses, createMerchantOffer } = useApp();
  const merchantBusiness = businesses[0]; // "Kigali Artisan Bakery"
  const merchantOffers = offers.filter(o => o.businessId === merchantBusiness.id);

  const [showCreateModal, setShowCreateModal] = useState(false);
  
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
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
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

  return (
    <div className="space-y-8 pb-16">
      
      {/* Merchant Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={merchantBusiness.logoUrl}
            alt={merchantBusiness.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500/40"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100">{merchantBusiness.name}</h1>
              <span className="bg-brand-500/20 text-brand-400 border border-brand-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Verified Store
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{merchantBusiness.address} • {merchantBusiness.phone}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenQRScanner}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-brand-400 border border-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan QR Code</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-brand-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Surplus Offer</span>
          </button>
        </div>
      </div>

      {/* Merchant Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Rescue Sales</span>
          <p className="text-2xl font-black text-brand-400">485,000 RWF</p>
          <span className="text-[10px] text-emerald-400 font-semibold">+18% vs last month</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Active Surplus Offers</span>
          <p className="text-2xl font-black text-amber-400">{merchantOffers.length} Live</p>
          <span className="text-[10px] text-slate-400">Inventory synced real-time</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Food Waste Prevented</span>
          <p className="text-2xl font-black text-emerald-400">142 kg</p>
          <span className="text-[10px] text-slate-400">355 kg CO₂ avoided</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Merchant Rating</span>
          <p className="text-2xl font-black text-slate-100">4.9 ★</p>
          <span className="text-[10px] text-slate-400">128 verified customer reviews</span>
        </div>
      </div>

      {/* Inventory & Offer Management Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-100">Active Inventory & Surplus Offers</h3>
          <span className="text-xs text-slate-400">{merchantOffers.length} offers active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Offer Details</th>
                <th className="p-3">Original vs Sale Price</th>
                <th className="p-3">Available Stock</th>
                <th className="p-3">Pickup Window</th>
                <th className="p-3">AI Demand</th>
                <th className="p-3 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {merchantOffers.map(offer => (
                <tr key={offer.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 flex items-center space-x-3">
                    <img src={offer.imageUrl} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-slate-100">{offer.title}</p>
                      <p className="text-[10px] text-slate-400">{offer.category}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-brand-400">{offer.discountedPrice.toLocaleString()} RWF</span>
                    <span className="text-[10px] text-slate-500 line-through ml-1.5">{offer.originalPrice.toLocaleString()}</span>
                  </td>
                  <td className="p-3 font-bold text-slate-200">
                    {offer.quantityAvailable} / {offer.quantityTotal} left
                  </td>
                  <td className="p-3 text-slate-300">
                    {offer.pickupStart} - {offer.pickupEnd}
                  </td>
                  <td className="p-3">
                    <span className="bg-amber-950/80 text-amber-400 font-bold px-2 py-0.5 rounded-md text-[10px]">
                      ⚡ {offer.aiDemandScore}% High
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
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
                <h3 className="text-lg font-bold text-slate-100">Post New Surplus Offer</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-4 text-xs">
              
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Offer Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fresh Artisan Sourdough & Pastry Box"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe contents of surplus package..."
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
                    <label className="text-slate-400 block mb-1">Original Price (RWF)</label>
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
                    className="font-bold text-brand-400 underline"
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
                className="w-full bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-slate-950 py-3 rounded-2xl font-black text-sm shadow-xl shadow-brand-500/20 transition"
              >
                Publish Surplus Offer Immediately
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
