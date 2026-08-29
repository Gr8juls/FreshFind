'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  Plus, 
  Store, 
  CheckCircle, 
  Clock, 
  QrCode, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  Sliders, 
  ArrowUpRight, 
  AlertCircle, 
  Edit3, 
  Calendar, 
  Layers, 
  ChevronUp, 
  ChevronDown, 
  Repeat, 
  XCircle,
  Camera,
  Bot,
  Crown,
  Flame,
  Zap
} from 'lucide-react';
import { AISnapAndListModal } from './AISnapAndListModal';
import { SmartVendorAssistantModal } from './SmartVendorAssistantModal';
import { VendorSubscriptionModal } from './VendorSubscriptionModal';
import { FeaturedBoostModal } from './FeaturedBoostModal';
import { Offer } from '@/lib/mockData';

interface BusinessViewProps {
  onOpenQRScanner: () => void;
}

export function BusinessView({ onOpenQRScanner }: BusinessViewProps) {
  const { 
    offers, 
    businesses, 
    createMerchantOffer, 
    quickAdjustOfferStock, 
    cancelOfferAndRefund,
    isSnapListModalOpen,
    setIsSnapListModalOpen,
    isVendorAssistantModalOpen,
    setIsVendorAssistantModalOpen,
    isSubscriptionModalOpen,
    setIsSubscriptionModalOpen,
  } = useApp();
  const merchantBusiness = businesses[0]; // Active bakery merchant

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [boostTargetOffer, setBoostTargetOffer] = useState<Offer | null>(null);

  const [title, setTitle] = useState('Surprise Artisan Pastry Box');
  const [bagType, setBagType] = useState<'Surprise Pastry Bag' | 'Surprise Meal Box' | 'Surprise Groceries Box' | 'Buffet Feast Box'>('Surprise Pastry Bag');
  const [description, setDescription] = useState('Assorted fresh daily croissants, sourdough baguettes, and tarts.');
  const [category, setCategory] = useState('Bakery');
  const [originalPrice, setOriginalPrice] = useState(15000);
  const [discountedPrice, setDiscountedPrice] = useState(4500);
  const [quantity, setQuantity] = useState(5);
  const [pickupStart, setPickupStart] = useState('18:00');
  const [pickupEnd, setPickupEnd] = useState('19:30');
  const [pickupTiming, setPickupTiming] = useState<'TODAY' | 'TOMORROW'>('TODAY');
  const [imageUrl, setImageUrl] = useState('https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=800');
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [isVegan, setIsVegan] = useState(false);
  const [isHalal, setIsHalal] = useState(true);
  const [isGlutenFree, setIsGlutenFree] = useState(false);

  // AI Assistant calculation
  const calculatedDiscount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  const aiSuggestedPrice = Math.round(originalPrice * 0.3);

  const handleApplyAIScan = (aiData: any) => {
    if (aiData.title) setTitle(aiData.title);
    if (aiData.bagType) setBagType(aiData.bagType);
    if (aiData.category) setCategory(aiData.category);
    if (aiData.originalPrice) setOriginalPrice(aiData.originalPrice);
    if (aiData.discountedPrice) setDiscountedPrice(aiData.discountedPrice);
    if (aiData.description) setDescription(aiData.description);
    if (aiData.imageUrl) setImageUrl(aiData.imageUrl);
    if (aiData.isVegetarian !== undefined) setIsVegetarian(aiData.isVegetarian);
    if (aiData.isVegan !== undefined) setIsVegan(aiData.isVegan);
    if (aiData.isHalal !== undefined) setIsHalal(aiData.isHalal);
    if (aiData.isGlutenFree !== undefined) setIsGlutenFree(aiData.isGlutenFree);
    setShowCreateModal(true);
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    await createMerchantOffer({
      businessId: merchantBusiness.id,
      businessName: merchantBusiness.name,
      title,
      bagType,
      guaranteedValue: originalPrice,
      description,
      category,
      originalPrice,
      discountedPrice,
      currency: 'RWF',
      quantityTotal: quantity,
      quantityAvailable: quantity,
      pickupStart,
      pickupEnd,
      pickupTiming,
      imageUrl,
      distanceKm: merchantBusiness.distanceKm,
      isVegetarian,
      isVegan,
      isHalal,
      isGlutenFree,
    });

    setShowCreateModal(false);
  };

  const merchantOffers = offers.filter(o => o.businessId === merchantBusiness.id);

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* Merchant Header Bar */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-0.5 shadow-xl">
            <img src={merchantBusiness.logoUrl} alt={merchantBusiness.name} className="w-full h-full rounded-2xl object-cover" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-100">{merchantBusiness.name}</h2>
              {merchantBusiness.isVerified && (
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified Merchant</span>
                </span>
              )}
              <button
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/40 flex items-center space-x-1 cursor-pointer transition"
              >
                <Crown className="w-3 h-3 text-amber-400" />
                <span>{merchantBusiness.subscriptionTier || 'PRO'} Tier ({merchantBusiness.commissionRate || 14}% Fee)</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">{merchantBusiness.address}, {merchantBusiness.district} • Daily surplus hours: {merchantBusiness.openingHours}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsVendorAssistantModalOpen(true)}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-sm"
          >
            <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>AI Copilot</span>
          </button>

          <button
            onClick={() => setIsSnapListModalOpen(true)}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-sm"
          >
            <Camera className="w-4 h-4 text-teal-400" />
            <span>AI Snap &amp; List</span>
          </button>

          <button
            onClick={onOpenQRScanner}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Scan QR</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 px-4 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post Box</span>
          </button>
        </div>
      </div>

      {/* TGTG Recurring Schedule Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-slate-100">Set-and-Forget Daily Schedule Active</span>
              <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded">AUTO-DROP</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Auto-publishing 4 Surprise Pastry Bags Mon–Sat at 16:00 (Pickup 18:00–19:30).
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-800">
          Next Auto-Drop: Tomorrow 16:00
        </span>
      </div>

      {/* Merchant Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Surprise Bag Revenue</span>
          <p className="text-2xl font-black text-emerald-400">485,000 RWF</p>
          <span className="text-[10px] text-emerald-400 font-semibold">+18% vs last month</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Active Mystery Packages</span>
          <p className="text-2xl font-black text-teal-400">{merchantOffers.length} Live</p>
          <span className="text-[10px] text-slate-400">Synced to Kigali Marketplace</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Food Rescued Locally</span>
          <p className="text-2xl font-black text-emerald-400">142 kg</p>
          <span className="text-[10px] text-slate-400">355 kg CO₂ avoided</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Customer Rating</span>
          <p className="text-2xl font-black text-slate-100">4.9 ★</p>
          <span className="text-[10px] text-slate-400">128 verified ratings</span>
        </div>
      </div>

      {/* Inventory & Offer Management Table with 1-Tap Quick Stepper */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Today&apos;s Surplus Bags & Fast Stepper</h3>
            <p className="text-xs text-slate-400">Use the 1-click + / - steppers to adjust today&apos;s bag count in 2 seconds.</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">{merchantOffers.length} active listings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-xl">Surprise Box Type</th>
                <th className="p-3.5">Price & Value</th>
                <th className="p-3.5">Quick Stock Adjust</th>
                <th className="p-3.5">Pickup Schedule</th>
                <th className="p-3.5">AI Demand &amp; Boost</th>
                <th className="p-3.5 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {merchantOffers.map(offer => (
                <tr key={offer.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 flex items-center space-x-3">
                    <img src={offer.imageUrl} alt={offer.title} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <p className="font-bold text-slate-100">{offer.title}</p>
                        {offer.isFeatured && (
                          <span className="bg-orange-500/20 text-orange-400 font-extrabold text-[9px] px-1.5 py-0.2 rounded border border-orange-500/30">
                            BOOSTED
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-emerald-400 font-semibold">{offer.bagType || offer.category}</p>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-emerald-400">{offer.discountedPrice.toLocaleString()} RWF</span>
                    <span className="text-[10px] text-slate-500 line-through ml-1.5">{offer.originalPrice.toLocaleString()}</span>
                  </td>
                  
                  {/* 1-Tap Quick Stepper */}
                  <td className="p-3.5">
                    <div className="inline-flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => quickAdjustOfferStock(offer.id, -1)}
                        className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-center transition cursor-pointer"
                        title="Decrease 1 bag"
                      >
                        -
                      </button>
                      <span className="font-mono font-black text-emerald-400 px-2 text-sm">
                        {offer.quantityAvailable}
                      </span>
                      <button
                        onClick={() => quickAdjustOfferStock(offer.id, 1)}
                        className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-center transition cursor-pointer"
                        title="Increase 1 bag"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="p-3.5 text-slate-300 font-medium">
                    {offer.pickupTiming === 'TOMORROW' ? 'Tomorrow' : 'Today'} {offer.pickupStart} - {offer.pickupEnd}
                  </td>
                  <td className="p-3.5">
                    <span className="bg-amber-950/80 text-amber-400 font-bold px-2 py-0.5 rounded-md text-[10px] flex items-center space-x-1 w-max">
                      <Flame className="w-3 h-3 text-amber-400 fill-current" />
                      <span>{offer.aiDemandScore}% Demand</span>
                    </span>
                  </td>

                  {/* Actions Column with Boost and Cancel */}
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setBoostTargetOffer(offer)}
                        className="px-2.5 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[11px] font-bold transition cursor-pointer flex items-center space-x-1 shadow-sm"
                        title="Boost to Featured Drop"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Boost</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Cancel today's drop for "${offer.title}"? Uncollected orders will be auto-refunded.`)) {
                            cancelOfferAndRefund(offer.id);
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold transition cursor-pointer flex items-center space-x-1"
                        title="Cancel today's drop and refund"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE OFFER MODAL WITH AI ASSIST & TGTG BAG TYPES */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-5 my-8">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-slate-100">Post New Chef&apos;s Surprise Bag</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            {/* AI Auto-Fill Fast Trigger */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-950/60 to-teal-950/40 border border-emerald-500/40 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Camera className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-slate-100">Want AI to write this listing?</p>
                  <p className="text-[10px] text-slate-400">Snap a photo and AI auto-detects items &amp; pricing.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setIsSnapListModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md"
              >
                Launch AI Camera
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-4 text-xs">
              
              {/* Bag Type Selector */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Surprise Bag Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Surprise Pastry Bag', 'Surprise Meal Box', 'Surprise Groceries Box', 'Buffet Feast Box'] as const).map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => {
                        setBagType(type);
                        setTitle(type === 'Surprise Pastry Bag' ? 'Surprise Artisan Pastry Box' : type === 'Surprise Meal Box' ? 'Chef Mystery Dinner Box' : type === 'Surprise Groceries Box' ? 'Fresh Deli & Grocery Box' : 'Executive Buffet Feast Box');
                      }}
                      className={`p-2.5 rounded-xl border text-left font-bold transition cursor-pointer ${
                        bagType === type ? 'bg-emerald-950 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Package Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Original Value (RWF)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Rescue Price (RWF)</label>
                  <input
                    type="number"
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                    required
                  />
                </div>
              </div>

              {/* AI Guidance Pill */}
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[11px] text-slate-300 flex items-center justify-between">
                <span>💡 Recommended Rescue Price (~70% off):</span>
                <span className="font-bold text-emerald-400">{aiSuggestedPrice.toLocaleString()} RWF</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Surprise Bags</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pickup Start</label>
                  <input
                    type="text"
                    value={pickupStart}
                    onChange={(e) => setPickupStart(e.target.value)}
                    placeholder="18:00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pickup End</label>
                  <input
                    type="text"
                    value={pickupEnd}
                    onChange={(e) => setPickupEnd(e.target.value)}
                    placeholder="19:30"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Surprise Box Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 py-3 rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                Publish Surprise Box Deal
              </button>

            </form>

          </div>
        </div>
      )}

      {/* AI & MONETIZATION MODALS */}
      <AISnapAndListModal onApplyToListing={handleApplyAIScan} />
      <SmartVendorAssistantModal />
      <VendorSubscriptionModal />
      <FeaturedBoostModal
        offer={boostTargetOffer}
        isOpen={!!boostTargetOffer}
        onClose={() => setBoostTargetOffer(null)}
      />

    </div>
  );
}
