'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Offer } from '@/lib/mockData';
import dynamic from 'next/dynamic';
import { OfferCard } from './OfferCard';
import { MarketplaceMap } from './MarketplaceMap';

const AIDemandForecastWidget = dynamic(
  () => import('./AIDemandForecastWidget').then((mod) => mod.AIDemandForecastWidget),
  { ssr: false, loading: () => <div className="h-44 rounded-3xl bg-slate-900/50 border border-slate-800 animate-pulse" /> }
);
import { 
  MapPin, 
  SlidersHorizontal, 
  Grid, 
  Map as MapIcon, 
  Leaf, 
  Heart, 
  ShoppingBag,
  PackageCheck,
  Globe,
  Sparkles,
  Star,
  Camera,
  CheckCircle2,
  X,
  Clock
} from 'lucide-react';

interface CustomerViewProps {
  onSelectOffer: (offer: Offer) => void;
}

export function CustomerView({ onSelectOffer }: CustomerViewProps) {
  const { 
    offers, 
    businesses,
    user, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    filterDietary,
    setFilterDietary,
    maxDistanceKm,
    setMaxDistanceKm,
    orders,
    favorites,
    toggleFavorite
  } = useApp();

  const [displayMode, setDisplayMode] = useState<'GRID' | 'MAP'>('GRID');
  const [activeTab, setActiveTab] = useState<'OFFERS' | 'ORDERS' | 'FAVORITES' | 'IMPACT'>('OFFERS');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'FR' | 'RW'>('EN');

  // Review modal state
  const [reviewOrder, setReviewOrder] = useState<any | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [freshnessScore, setFreshnessScore] = useState<'EXCELLENT' | 'FRESH' | 'AVERAGE'>('EXCELLENT');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccessToast, setReviewSuccessToast] = useState(false);

  // Filter logic
  const filteredOffers = offers.filter(offer => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = offer.title.toLowerCase().includes(q);
      const matchBusiness = offer.businessName.toLowerCase().includes(q);
      const matchDesc = offer.description.toLowerCase().includes(q);
      if (!matchTitle && !matchBusiness && !matchDesc) return false;
    }

    // Category match
    if (selectedCategory !== 'All' && offer.category !== selectedCategory) {
      return false;
    }

    // Dietary filters
    if (filterDietary.vegetarian && !offer.isVegetarian) return false;
    if (filterDietary.vegan && !offer.isVegan) return false;
    if (filterDietary.halal && !offer.isHalal) return false;
    if (filterDietary.glutenFree && !offer.isGlutenFree) return false;

    // Distance filter
    if (offer.distanceKm > maxDistanceKm) return false;

    return true;
  });

  const CATEGORIES = ['All', 'Bakery', 'Supermarket', 'Restaurant', 'Hotel', 'Cafe'];

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewOrder(null);
    setReviewComment('');
    setReviewSuccessToast(true);
    setTimeout(() => setReviewSuccessToast(false), 4000);
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* Review Toast */}
      {reviewSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-semibold">Thank you for rating food freshness & supporting Kigali artisans!</span>
        </div>
      )}

      {/* HERO BANNER & USER IMPACT TRACKER */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-eco-card to-slate-950">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center space-x-2">
              <div className="inline-flex items-center space-x-2 bg-brand-500/10 border border-brand-500/30 px-3 py-1 rounded-full text-xs font-bold text-brand-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fresh End-of-Day Specials • 50–70% Off</span>
              </div>

              {/* Language Switcher Pill */}
              <div className="flex items-center bg-slate-900/90 border border-slate-700/80 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-300 space-x-1">
                <Globe className="w-3 h-3 text-brand-400" />
                {(['EN', 'FR', 'RW'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-1.5 py-0.5 rounded ${language === lang ? 'bg-brand-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight leading-tight">
              Delicious Surplus Packages from Kigali&apos;s Finest Spots.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Enjoy premium chef&apos;s mystery bags & freshly baked daily surplus before store closing while preventing food emissions in Rwanda.
            </p>
          </div>

          {/* Environmental Impact Metrics Badge */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-black text-brand-400">{user.mealsRescued}</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Packages Saved</div>
            </div>
            <div className="text-center border-x border-slate-800 px-2">
              <div className="text-lg sm:text-xl font-black text-emerald-400">{user.co2SavedKg} kg</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">CO₂ Prevented</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-black text-amber-400">{user.badgeTier || 'Eco Champion 🌿'}</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">FreshFind Tier</div>
            </div>
          </div>

        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 overflow-x-auto">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('OFFERS')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'OFFERS'
                ? 'bg-brand-500 text-slate-950 shadow-lg shadow-brand-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Chef&apos;s Surprise Bags ({filteredOffers.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition relative cursor-pointer ${
              activeTab === 'ORDERS'
                ? 'bg-brand-500 text-slate-950 shadow-lg shadow-brand-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>My Pickup Orders ({orders.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('FAVORITES')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'FAVORITES'
                ? 'bg-brand-500 text-slate-950 shadow-lg shadow-brand-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Saved Bakeries ({favorites.length})</span>
          </button>
        </div>

        {/* View Mode Toggle: Grid vs Interactive Map */}
        {activeTab === 'OFFERS' && (
          <div className="hidden sm:flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setDisplayMode('GRID')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                displayMode === 'GRID' ? 'bg-brand-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setDisplayMode('MAP')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                displayMode === 'MAP' ? 'bg-brand-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Kigali Map</span>
            </button>
          </div>
        )}
      </div>

      {/* OFFERS TAB CONTENT */}
      {activeTab === 'OFFERS' && (
        <div className="space-y-6">
          
          {/* CATEGORIES & DIETARY FILTER BAR */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              
              {/* Category Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-slate-100 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Filter Drawer Toggle */}
              <button
                onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  showFilterDrawer 
                    ? 'bg-brand-500/20 text-brand-400 border-brand-500/40' 
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filter Drawer Matrix */}
            {showFilterDrawer && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-200 block mb-2">Dietary Requirements</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilterDietary(prev => ({ ...prev, vegetarian: !prev.vegetarian }))}
                      className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer ${filterDietary.vegetarian ? 'bg-emerald-950 text-emerald-400 border-emerald-500' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                    >
                      Vegetarian
                    </button>
                    <button
                      onClick={() => setFilterDietary(prev => ({ ...prev, vegan: !prev.vegan }))}
                      className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer ${filterDietary.vegan ? 'bg-teal-950 text-teal-400 border-teal-500' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                    >
                      Vegan
                    </button>
                    <button
                      onClick={() => setFilterDietary(prev => ({ ...prev, halal: !prev.halal }))}
                      className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer ${filterDietary.halal ? 'bg-amber-950 text-amber-400 border-amber-500' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                    >
                      Halal
                    </button>
                    <button
                      onClick={() => setFilterDietary(prev => ({ ...prev, glutenFree: !prev.glutenFree }))}
                      className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer ${filterDietary.glutenFree ? 'bg-indigo-950 text-indigo-400 border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                    >
                      Gluten Free
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-300 mb-1">
                    <span>Maximum Distance Radius</span>
                    <span className="text-brand-400">{maxDistanceKm} km</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={maxDistanceKm}
                    onChange={(e) => setMaxDistanceKm(parseFloat(e.target.value))}
                    className="w-full accent-brand-500 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* AI Demand Forecast Intelligence Widget */}
          <AIDemandForecastWidget offers={offers} onSelectOffer={onSelectOffer} />

          {/* OFFERS DISPLAY GRID */}
          {displayMode === 'GRID' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map(offer => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onSelect={onSelectOffer}
                />
              ))}
            </div>
          ) : (
            /* INTERACTIVE GEOLOCATION MAP */
            <MarketplaceMap
              offers={filteredOffers}
              businesses={businesses}
              onSelectOffer={onSelectOffer}
              maxDistanceKm={maxDistanceKm}
              setMaxDistanceKm={setMaxDistanceKm}
            />
          )}
        </div>
      )}

      {/* ORDERS TAB CONTENT */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100">Your Active & Past Food Pickups</h2>
          {orders.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
              <p className="text-sm text-slate-400">No orders placed yet. Explore surplus offers to reserve food!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(ord => (
                <div key={ord.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono bg-slate-800 text-brand-400 px-2 py-0.5 rounded font-bold">{ord.orderNumber}</span>
                      <span className="text-sm font-bold text-slate-200">{ord.offerTitle}</span>
                    </div>
                    <p className="text-xs text-slate-400">{ord.businessName} • {ord.quantity} package(s) • <strong className="text-slate-200 font-mono">{ord.totalPrice.toLocaleString()} RWF</strong></p>
                    <p className="text-[11px] text-amber-400 flex items-center space-x-1 pt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{ord.pickupWindow}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {ord.status}
                    </span>

                    {/* Freshness Rating & Review Trigger */}
                    <button
                      onClick={() => setReviewOrder(ord)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>Rate Freshness</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAVORITES TAB CONTENT */}
      {activeTab === 'FAVORITES' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100">Saved Bakeries & Restaurants</h2>
          {favorites.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
              <p className="text-sm text-slate-400">No saved stores yet. Click the heart icon on any offer to save!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {businesses.filter(b => favorites.includes(b.id)).map(b => (
                <div key={b.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-3">
                  <img src={b.logoUrl} alt={b.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-200">{b.name}</h4>
                    <p className="text-xs text-slate-400">{b.category} • {b.district}</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(b.id)}
                    className="text-rose-500 hover:text-slate-400 transition"
                  >
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Freshness Review Modal */}
      {reviewOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>Rate Food Freshness & Quality</span>
              </h3>
              <button onClick={() => setReviewOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Order <strong className="text-brand-400">#{reviewOrder.orderNumber}</strong> from <strong className="text-slate-200">{reviewOrder.businessName}</strong>
            </p>

            {/* Star selector */}
            <div className="flex items-center justify-center space-x-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1 cursor-pointer transition hover:scale-125"
                >
                  <Star className={`w-7 h-7 ${star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                </button>
              ))}
            </div>

            {/* Freshness Badge Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Food Condition at Pickup:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['EXCELLENT', 'FRESH', 'AVERAGE'] as const).map(score => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setFreshnessScore(score)}
                    className={`py-2 rounded-xl font-bold border transition ${
                      freshnessScore === score
                        ? 'bg-brand-500 text-slate-950 border-brand-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Feedback for Chef / Bakery:</label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Delicious pastries, well packed and fresh!"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setReviewOrder(null)}
                className="w-1/2 bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitReview}
                className="w-1/2 bg-brand-500 hover:bg-brand-400 text-slate-950 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
