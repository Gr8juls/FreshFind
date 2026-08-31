'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { 
  Store, 
  Sparkles, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Utensils, 
  Coffee, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Phone, 
  Wallet, 
  ShieldCheck, 
  Image as ImageIcon,
  Rocket
} from 'lucide-react';

const PRESET_LOGOS = [
  'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=150',
];

const PRESET_BANNERS = [
  'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
];

export function MerchantOnboardingWizard() {
  const router = useRouter();
  const { registerNewBusiness, createMerchantOffer } = useApp();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: 'Nyarutarama Gourmet Bakery',
    category: 'Bakery' as const,
    district: 'Kigali',
    address: 'KG 9 Ave, Nyarutarama',
    phone: '+250 788 123 789',
    openingHours: '07:00 - 20:00',
    description: 'Freshly baked artisan croissants, pastries, baguettes, and sourdough loaf surplus.',

    // Step 2: Visuals
    logoUrl: PRESET_LOGOS[0],
    bannerUrl: PRESET_BANNERS[0],

    // Step 3: First Offer
    offerTitle: 'Surprise Morning Pastry Bag',
    bagType: 'Surprise Pastry Bag' as const,
    originalPrice: 15000,
    discountedPrice: 4500,
    quantityTotal: 6,
    pickupStart: '18:30',
    pickupEnd: '19:30',
    pickupTiming: 'TODAY' as const,
    offerDescription: 'Fresh daily surplus croissants, pain au chocolat, sourdough bread, and fruit tarts.',

    // Step 4: Payout Details
    tinNumber: 'TIN-99201948',
    payoutPhone: '+250 788 123 789',
    payoutMethod: 'MTN_MOMO' as const,
  });

  const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'new-merchant';

  const handleNext = () => setStep(prev => Math.min(5, prev + 1));
  const handleBack = () => setStep(prev => Math.max(1, prev - 1));

  const handleComplete = async () => {
    setIsSubmitting(true);

    const createdBiz = await registerNewBusiness({
      name: formData.name,
      slug,
      category: formData.category,
      description: formData.description,
      address: formData.address,
      district: formData.district,
      logoUrl: formData.logoUrl,
      bannerUrl: formData.bannerUrl,
      openingHours: formData.openingHours,
      phone: formData.phone,
      tinNumber: formData.tinNumber,
      payoutPhone: formData.payoutPhone,
      lat: -1.9355,
      lng: 30.0880,
    });

    await createMerchantOffer({
      businessId: createdBiz.id,
      businessName: createdBiz.name,
      businessSlug: slug,
      title: formData.offerTitle,
      description: formData.offerDescription,
      category: formData.category,
      bagType: formData.bagType,
      guaranteedValue: formData.originalPrice,
      originalPrice: formData.originalPrice,
      discountedPrice: formData.discountedPrice,
      currency: 'RWF',
      quantityTotal: formData.quantityTotal,
      quantityAvailable: formData.quantityTotal,
      pickupStart: formData.pickupStart,
      pickupEnd: formData.pickupEnd,
      pickupTiming: formData.pickupTiming,
      imageUrl: formData.bannerUrl,
      distanceKm: 1.2,
      isVegetarian: true,
      isVegan: false,
      isHalal: true,
      isGlutenFree: false,
      reservedToday: 0,
      isNewStore: true,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/store/${slug}`);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Wizard Step Indicator */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Merchant Registration</span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Partner Onboarding Wizard</h1>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            Step {step} of 5
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step labels */}
        <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
          <span className={step >= 1 ? 'text-emerald-600 dark:text-emerald-400' : ''}>1. Store Info</span>
          <span className={step >= 2 ? 'text-emerald-600 dark:text-emerald-400' : ''}>2. Branding</span>
          <span className={step >= 3 ? 'text-emerald-600 dark:text-emerald-400' : ''}>3. First Offer</span>
          <span className={step >= 4 ? 'text-emerald-600 dark:text-emerald-400' : ''}>4. Payouts</span>
          <span className={step >= 5 ? 'text-emerald-600 dark:text-emerald-400' : ''}>5. Launch</span>
        </div>
      </div>

      {/* Wizard Form Body */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <Store className="w-5 h-5" />
              <h2 className="text-base font-black text-slate-900 dark:text-white">Store &amp; Location Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Business Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Kigali Artisan Bakery"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-emerald-500/50 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500/50 outline-none"
                >
                  <option value="Bakery">Bakery 🥐</option>
                  <option value="Cafe">Cafe ☕</option>
                  <option value="Restaurant">Restaurant 🍲</option>
                  <option value="Supermarket">Supermarket 🛒</option>
                  <option value="Hotel">Hotel &amp; Buffet 🏨</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">District / City</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="e.g. Kigali"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-emerald-500/50 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Physical Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. KG 9 Ave, Nyarutarama"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-emerald-500/50 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Business Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+250 788 000 000"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-emerald-500/50 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Store Hours</label>
                <input
                  type="text"
                  value={formData.openingHours}
                  onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                  placeholder="07:00 - 20:00"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-emerald-500/50 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300">About Store &amp; Surplus Types</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-emerald-500/50 outline-none resize-none"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Branding & Visuals */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <ImageIcon className="w-5 h-5" />
              <h2 className="text-base font-black text-slate-900 dark:text-white">Store Logo &amp; Banner Photos</h2>
            </div>

            {/* Logo Picker */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300">Choose Store Logo</label>
              <div className="flex flex-wrap gap-3">
                {PRESET_LOGOS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, logoUrl: url })}
                    className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition cursor-pointer ${
                      formData.logoUrl === url ? 'border-emerald-500 ring-2 ring-emerald-500/50 scale-105' : 'border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <img src={url} alt="Logo preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Banner Picker */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300">Choose Store Cover Banner</label>
              <div className="grid grid-cols-2 gap-3">
                {PRESET_BANNERS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, bannerUrl: url })}
                    className={`h-24 rounded-2xl overflow-hidden border-2 transition cursor-pointer ${
                      formData.bannerUrl === url ? 'border-emerald-500 ring-2 ring-emerald-500/50 scale-[1.02]' : 'border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <img src={url} alt="Banner preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: First Surprise Offer */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-base font-black text-slate-900 dark:text-white">Create Your First Surprise Bag</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Bag Title</label>
                <input
                  type="text"
                  value={formData.offerTitle}
                  onChange={(e) => setFormData({ ...formData, offerTitle: e.target.value })}
                  placeholder="e.g. Surprise Artisan Pastry Box"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-emerald-500/50 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Bag Type</label>
                <select
                  value={formData.bagType}
                  onChange={(e) => setFormData({ ...formData, bagType: e.target.value as any })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500/50 outline-none"
                >
                  <option value="Surprise Pastry Bag">Surprise Pastry Bag 🥐</option>
                  <option value="Surprise Meal Box">Surprise Meal Box 🍱</option>
                  <option value="Surprise Groceries Box">Surprise Groceries Box 🛒</option>
                  <option value="Buffet Feast Box">Buffet Feast Box 🍲</option>
                  <option value="Vegan Surplus Bowl">Vegan Surplus Bowl 🥗</option>
                  <option value="General Magic Bag">General Magic Bag ✨</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Guaranteed Value (RWF)</label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-black focus:ring-2 focus:ring-emerald-500/50 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Rescuer Price (RWF)</label>
                <input
                  type="number"
                  value={formData.discountedPrice}
                  onChange={(e) => setFormData({ ...formData, discountedPrice: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 font-black focus:ring-2 focus:ring-emerald-500/50 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Pickup Start</label>
                <input
                  type="text"
                  value={formData.pickupStart}
                  onChange={(e) => setFormData({ ...formData, pickupStart: e.target.value })}
                  placeholder="18:30"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500/50 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Pickup End</label>
                <input
                  type="text"
                  value={formData.pickupEnd}
                  onChange={(e) => setFormData({ ...formData, pickupEnd: e.target.value })}
                  placeholder="19:30"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500/50 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Payouts */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <Wallet className="w-5 h-5" />
              <h2 className="text-base font-black text-slate-900 dark:text-white">MTN MoMo &amp; Payout Account</h2>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
              <p className="font-bold">⚡ Automated Weekly MoMo Payouts</p>
              <p className="text-[11px] opacity-90">
                FreshFind transfers your surplus recovery revenue every Monday directly to your MTN Mobile Money account.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">MTN MoMo Phone Number</label>
                <input
                  type="text"
                  value={formData.payoutPhone}
                  onChange={(e) => setFormData({ ...formData, payoutPhone: e.target.value })}
                  placeholder="+250 788 000 000"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500/50 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">RRA TIN Number</label>
                <input
                  type="text"
                  value={formData.tinNumber}
                  onChange={(e) => setFormData({ ...formData, tinNumber: e.target.value })}
                  placeholder="TIN-88291024"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500/50 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Go Live */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <Rocket className="w-5 h-5" />
              <h2 className="text-base font-black text-slate-900 dark:text-white">Review &amp; Launch Store</h2>
            </div>

            {/* Store Card Preview */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
              <img src={formData.logoUrl} alt={formData.name} className="w-16 h-16 rounded-2xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">{formData.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    Ready to Launch
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{formData.category} • {formData.address}</p>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  1st Drop: {formData.offerTitle} ({formData.discountedPrice.toLocaleString()} RWF)
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>By launching, you agree to the FreshFind Merchant Zero-Waste Covenant &amp; Standard 22% Commission.</span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-md shadow-emerald-500/20 transition cursor-pointer"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/30 transition transform active:scale-95 cursor-pointer"
            >
              <Rocket className="w-4 h-4" />
              <span>{isSubmitting ? 'Launching Store...' : 'Launch On FreshFind! 🚀'}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
