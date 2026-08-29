'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Offer } from '@/lib/mockData';
import dynamic from 'next/dynamic';
import { OfferCard } from './OfferCard';
import { MarketplaceMap } from './MarketplaceMap';
import { AISmartSearchBar } from './AISmartSearchBar';
import { NativeEcoAdBanner } from './NativeEcoAdBanner';
import { AIChefRescueModal } from './AIChefRescueModal';

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
  Clock,
  Bell,
  EyeOff,
  ChefHat,
  Zap,
  Flame
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
    toggleFavorite,
    setIsChefModalOpen,
    setChefRescueOffer
  } = useApp();

  const [displayMode, setDisplayMode] = useState<'GRID' | 'MAP'>('GRID');
  const [activeTab, setActiveTab] = useState<'OFFERS' | 'ORDERS' | 'FAVORITES' | 'IMPACT'>('OFFERS');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'FR' | 'RW'>('EN');
  
  // TGTG Specific filters
  const [timingFilter, setTimingFilter] = useState<'ALL' | 'TODAY' | 'TOMORROW'>('ALL');
  const [hideSoldOut, setHideSoldOut] = useState(false);

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

    // Timing filter (Today vs Tomorrow)
    if (timingFilter === 'TODAY' && offer.pickupTiming === 'TOMORROW') return false;
    if (timingFilter === 'TOMORROW' && offer.pickupTiming !== 'TOMORROW') return false;

    // Hide sold out
    if (hideSoldOut && offer.quantityAvailable <= 0) return false;

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

  // Check if any favorited store has active bags
  const favoriteActiveBags = offers.filter(o => favorites.includes(o.businessId) && o.quantityAvailable > 0);

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
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chef&apos;s Mystery Bags • Guaranteed 3x Minimum Value</span>
              </div>

              {/* Language Switcher Pill */}
              <div className="flex items-center bg-slate-900/90 border border-slate-700/80 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-300 space-x-1">
                <Globe className="w-3 h-3 text-emerald-400" />
                {(['EN', 'FR', 'RW'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-1.5 py-0.5 rounded cursor-pointer ${language === lang ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight leading-tight">
              Rescue Delicious Surprise Bags from Kigali&apos;s Top Kitchens.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Pay 1/3 of the regular price. Pick up surplus bakery boxes, restaurant buffets, and groceries before closing time.
            </p>
          </div>

          {/* Environmental Impact Metrics Badge */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-black text-emerald-400">{user.mealsRescued}</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Bags Rescued</div>
            </div>
            <div className="text-center border-x border-slate-800 px-2">
              <div className="text-lg sm:text-xl font-black text-teal-400">{user.co2SavedKg} kg</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">CO₂ Prevented</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-black text-amber-400">{user.badgeTier || 'Eco Champion 🌿'}</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Tier Badge</div>
            </div>
          </div>

        </div>
      </div>

      {/* Favorite Store Drop Alert Banner if any */}
      {favoriteActiveBags.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-slate-900 border border-emerald-500/40 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">
                ⚡ Favorite Alert: <span className="text-emerald-400">{favoriteActiveBags[0].businessName}</span> has {favoriteActiveBags[0].quantityAvailable} surprise bags available!
              </p>
              <p className="text-[10px] text-slate-400">Collect today between {favoriteActiveBags[0].pickupStart} - {favoriteActiveBags[0].pickupEnd}</p>
            </div>
          </div>
          <button
            onClick={() => onSelectOffer(favoriteActiveBags[0])}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow transition cursor-pointer"
          >
            Quick Grab
          </button>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 overflow-x-auto">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('OFFERS')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'OFFERS'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Surprise Magic Bags ({filteredOffers.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition relative cursor-pointer ${
              activeTab === 'ORDERS'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
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
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Favorited Stores ({favorites.length})</span>
          </button>
        </div>

        {/* View Mode Toggle: Grid vs Interactive Map */}
        {activeTab === 'OFFERS' && (
          <div className="hidden sm:flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setDisplayMode('GRID')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                displayMode === 'GRID' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setDisplayMode('MAP')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                displayMode === 'MAP' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
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
          
          {/* AI SMART SEARCH BAR */}
          <AISmartSearchBar />

          {/* AI RESCUE RADAR - PERSONALIZED RECOMMENDATIONS CAROUSEL */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-100 flex items-center space-x-2">
                    <span>AI Rescue Radar™</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Personalized For You
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Predicted drops matching your taste, usual commute radius, and peak 6–8 PM pickup habits.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold hidden sm:inline-block">
                ⚡ 96% Affinity Score
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.slice(0, 3).map((offer, idx) => (
                <div
                  key={'rec-' + offer.id}
                  onClick={() => onSelectOffer(offer)}
                  className="group relative bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/60 transition cursor-pointer shadow-lg space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {idx === 0 ? '🥐 Top Bakery Match' : idx === 1 ? '☕ Afternoon Grab & Go' : '🍲 Dinner Feast Match'}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">
                      {98 - idx * 3}% Match
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <img src={offer.imageUrl} alt={offer.title} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-100 truncate group-hover:text-emerald-400 transition">
                        {offer.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">{offer.businessName}</p>
                      <div className="flex items-baseline space-x-1.5 mt-0.5">
                        <span className="text-xs font-black text-emerald-400">{offer.discountedPrice.toLocaleString()} RWF</span>
                        <span className="text-[10px] text-slate-500 line-through">{offer.originalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 italic bg-slate-950/80 p-1.5 rounded-lg border border-slate-800/80">
                    💡 {idx === 0 ? 'Saved 4.9★ rating from 128 neighbors near Nyarutarama.' : idx === 1 ? 'High-protein grab-and-go option before closing time.' : 'Generous 3.3x guaranteed value meal tray.'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CHEF RESCUE AI RECIPE BANNER */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <ChefHat className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-black text-slate-100">&ldquo;Chef Rescue&rdquo; Zero-Waste AI Cooking Assistant</h4>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Free Feature
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Turn your collected surprise bags and bakery loaves into 15-minute gourmet dishes with zero food waste.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChefModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center space-x-1.5 transition cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Chef Rescue</span>
              </button>
            </div>
          </div>

          {/* CATEGORIES & TGTG FILTER BAR */}
          <div className="space-y-4">
            
            {/* Row 1: Collection Timing Pills (Today vs Tomorrow) & Hide Sold Out */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-2">Collection:</span>
                <button
                  onClick={() => setTimingFilter('ALL')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    timingFilter === 'ALL' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All Times
                </button>
                <button
                  onClick={() => setTimingFilter('TODAY')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    timingFilter === 'TODAY' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🟢 Collect Today
                </button>
                <button
                  onClick={() => setTimingFilter('TOMORROW')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    timingFilter === 'TOMORROW' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ⏳ Collect Tomorrow
                </button>
              </div>

              {/* Hide Sold Out Toggle */}
              <button
                onClick={() => setHideSoldOut(!hideSoldOut)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition border cursor-pointer ${
                  hideSoldOut 
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50' 
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>{hideSoldOut ? 'Hiding Sold Out' : 'Hide Sold Out'}</span>
              </button>
            </div>

            {/* Row 2: Categories */}
            <div className="flex items-center justify-between gap-4">
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
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
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
                    <span className="text-emerald-400">{maxDistanceKm} km</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={maxDistanceKm}
                    onChange={(e) => setMaxDistanceKm(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* AI Demand Forecast Intelligence Widget */}
          <AIDemandForecastWidget offers={offers} onSelectOffer={onSelectOffer} />

          {/* NATIVE CONTEXTUAL ECO AD BANNER */}
          <NativeEcoAdBanner adIndex={0} />

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

          {/* Modals */}
          <AIChefRescueModal />
        </div>
      )}

      {/* ORDERS TAB CONTENT */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100">Your Active &amp; Past Food Pickups</h2>
          {orders.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
              <p className="text-sm text-slate-400">No orders placed yet. Explore surprise boxes to rescue food!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">#{order.orderNumber}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        order.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-200">{order.offerTitle}</h4>
                    <p className="text-xs text-slate-400">{order.businessName} • {order.pickupWindow}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        const matchedOffer = offers.find(o => o.id === order.offerId);
                        if (matchedOffer) setChefRescueOffer(matchedOffer);
                        setIsChefModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      <span>Cook with AI Chef</span>
                    </button>

                    <div className="text-right">
                      <p className="text-xs font-extrabold text-slate-100">{order.totalPrice.toLocaleString()} RWF</p>
                      <p className="text-[10px] text-slate-400 font-mono">{order.qrToken}</p>
                    </div>
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
          <h2 className="text-lg font-bold text-slate-100">Your Favorite Food Rescue Partners</h2>
          {favorites.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
              <p className="text-sm text-slate-400">Click the heart icon on any store to get notified when they drop new surprise boxes!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.filter(o => favorites.includes(o.businessId)).map(offer => (
                <OfferCard key={offer.id} offer={offer} onSelect={onSelectOffer} />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
