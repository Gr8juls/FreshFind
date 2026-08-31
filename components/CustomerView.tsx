'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Offer, Order } from '@/lib/mockData';
import { OfferCard } from './OfferCard';
import { MarketplaceMap } from './MarketplaceMap';
import { AIChefRescueModal } from './AIChefRescueModal';
import { ReviewModal } from './ReviewModal';
import LoyaltyDashboard from './LoyaltyDashboard';
import { Language } from '@/lib/translations';

import { 
  SlidersHorizontal, 
  Grid, 
  Map as MapIcon, 
  Heart, 
  ShoppingBag,
  PackageCheck,
  Globe,
  Sparkles,
  CheckCircle2,
  Bell,
  EyeOff,
  ChefHat,
  RotateCcw,
  Award,
  Navigation,
  ArrowUpDown,
  Star,
  MapPin,
  Compass
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
    sortBy,
    setSortBy,
    filterDietary,
    setFilterDietary,
    maxDistanceKm,
    setMaxDistanceKm,
    orders,
    favorites,
    language,
    setLanguage,
    t,
    setIsChefModalOpen,
    setChefRescueOffer,
    userDistrict,
    isRealGps,
    requestGpsLocation,
    openReviewModal
  } = useApp();

  const [displayMode, setDisplayMode] = useState<'GRID' | 'MAP'>('GRID');
  const [activeTab, setActiveTab] = useState<'OFFERS' | 'ORDERS' | 'FAVORITES' | 'IMPACT'>('OFFERS');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  
  // Filtering states
  const [timingFilter, setTimingFilter] = useState<'ALL' | 'TODAY' | 'TOMORROW'>('ALL');
  const [hideSoldOut, setHideSoldOut] = useState(false);

  const handleRefreshGps = async () => {
    setIsGpsLoading(true);
    await requestGpsLocation();
    setTimeout(() => setIsGpsLoading(false), 800);
  };

  // Filter logic
  let filteredOffers = offers.filter(offer => {
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

  // Sort logic
  filteredOffers = [...filteredOffers].sort((a, b) => {
    if (sortBy === 'DISTANCE') {
      return a.distanceKm - b.distanceKm;
    }
    if (sortBy === 'DISCOUNT') {
      const discA = (a.originalPrice - a.discountedPrice) / a.originalPrice;
      const discB = (b.originalPrice - b.discountedPrice) / b.originalPrice;
      return discB - discA;
    }
    if (sortBy === 'RATING') {
      return b.rating - a.rating;
    }
    if (sortBy === 'DEMAND') {
      return b.aiDemandScore - a.aiDemandScore;
    }
    return 0;
  });

  const CATEGORIES = [
    { key: 'All', label: t.filters.allDeals, icon: '⚡' },
    { key: 'Bakery', label: t.filters.bakery, icon: '🥐' },
    { key: 'Cafe', label: t.filters.cafe, icon: '☕' },
    { key: 'Restaurant', label: t.filters.restaurant, icon: '🍲' },
    { key: 'Supermarket', label: t.filters.supermarket, icon: '🛒' },
    { key: 'Hotel', label: t.filters.hotel, icon: '🏨' },
  ];

  // Active filters count
  const hasActiveFilters = 
    selectedCategory !== 'All' || 
    timingFilter !== 'ALL' || 
    hideSoldOut || 
    searchQuery.trim() !== '' || 
    filterDietary.vegetarian || 
    filterDietary.vegan || 
    filterDietary.halal || 
    filterDietary.glutenFree || 
    maxDistanceKm < 10 ||
    sortBy !== 'DISTANCE';

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setTimingFilter('ALL');
    setHideSoldOut(false);
    setSearchQuery('');
    setSortBy('DISTANCE');
    setFilterDietary({
      vegetarian: false,
      vegan: false,
      halal: false,
      glutenFree: false,
    });
    setMaxDistanceKm(10);
  };

  // Find favorite stores active bags for quick notification banner
  const favoriteActiveBags = offers.filter(o => favorites.includes(o.businessId) && o.quantityAvailable > 0);

  return (
    <div className="space-y-6">
      
      {/* HERO BANNER */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white shadow-xl overflow-hidden border border-emerald-500/20">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-bold border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.hero.valueBadge}</span>
            </span>

            {/* GPS Location Pill */}
            <button
              onClick={handleRefreshGps}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-950/40 backdrop-blur-md text-slate-200 hover:text-white text-xs font-bold border border-white/20 transition cursor-pointer"
            >
              <Navigation className={`w-3.5 h-3.5 ${isGpsLoading ? 'animate-spin text-amber-400' : isRealGps ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{isRealGps ? '📍 Live GPS:' : '📍 Location:'} {userDistrict}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {t.hero.title}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
            {t.hero.subtitle}
          </p>

          {/* Quick Value Metrics Pill */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-emerald-200">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{user.mealsRescued} {t.hero.bagsRescued}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{user.co2SavedKg} kg {t.hero.co2Avoided}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{user.points} {t.hero.ecoPoints}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAVORITE STORE ALERT BANNER */}
      {favoriteActiveBags.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-slate-900 border border-emerald-200 dark:border-emerald-500/40 flex items-center justify-between gap-4 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                ⚡ {t.favorites.alertTitle} <span className="text-emerald-600 dark:text-emerald-400">{favoriteActiveBags[0].businessName}</span> has {favoriteActiveBags[0].quantityAvailable} surprise bags available!
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Collect today between {favoriteActiveBags[0].pickupStart} - {favoriteActiveBags[0].pickupEnd}</p>
            </div>
          </div>
          <button
            onClick={() => onSelectOffer(favoriteActiveBags[0])}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow transition cursor-pointer shrink-0"
          >
            {t.favorites.quickGrab}
          </button>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto gap-2">
        <div className="flex space-x-2 shrink-0">
          <button
            onClick={() => setActiveTab('OFFERS')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'OFFERS'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t.tabs.surpriseBags} ({filteredOffers.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'ORDERS'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>{t.tabs.myOrders} ({orders.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('FAVORITES')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'FAVORITES'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{t.tabs.favorites} ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('IMPACT')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'IMPACT'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{t.tabs.ecoImpact}</span>
          </button>
        </div>

        {/* View Mode Toggle: Grid vs Interactive Map */}
        {activeTab === 'OFFERS' && (
          <div className="hidden sm:flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
            <button
              onClick={() => setDisplayMode('GRID')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                displayMode === 'GRID' ? 'bg-emerald-500 text-slate-950' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{t.tabs.grid}</span>
            </button>
            <button
              onClick={() => setDisplayMode('MAP')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                displayMode === 'MAP' ? 'bg-emerald-500 text-slate-950' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>{t.tabs.map}</span>
            </button>
          </div>
        )}
      </div>

      {/* OFFERS TAB CONTENT */}
      {activeTab === 'OFFERS' && (
        <div className="space-y-6">
          
          {/* UNIFIED FILTER & SORT TOOLBAR */}
          <div className="space-y-3 bg-white/70 dark:bg-slate-900/60 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm">
            
            {/* Row 1: Categories Bar */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none flex-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat.key
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Filters Drawer Toggle */}
              <button
                onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer shrink-0 ${
                  showFilterDrawer || hasActiveFilters
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{t.filters.filterButton}</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            </div>

            {/* Row 2: Timing, Sorting & Quick Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.filters.timingLabel}</span>
                <button
                  onClick={() => setTimingFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    timingFilter === 'ALL' 
                      ? 'bg-emerald-500 text-slate-950' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {t.filters.allTimes}
                </button>
                <button
                  onClick={() => setTimingFilter('TODAY')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    timingFilter === 'TODAY' 
                      ? 'bg-emerald-500 text-slate-950' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {t.filters.collectToday}
                </button>
                <button
                  onClick={() => setTimingFilter('TOMORROW')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    timingFilter === 'TOMORROW' 
                      ? 'bg-emerald-500 text-slate-950' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {t.filters.collectTomorrow}
                </button>

                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

                {/* Hide Sold Out */}
                <button
                  onClick={() => setHideSoldOut(!hideSoldOut)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition border cursor-pointer ${
                    hideSoldOut 
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-500/50' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>{hideSoldOut ? t.filters.hidingSoldOut : t.filters.hideSoldOut}</span>
                </button>
              </div>

              {/* Sort By Pills */}
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                  <ArrowUpDown className="w-3 h-3" />
                  <span>Sort:</span>
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="DISTANCE">📍 Closest First</option>
                  <option value="DISCOUNT">💰 Highest Discount</option>
                  <option value="RATING">⭐ Top Rated</option>
                  <option value="DEMAND">🔥 High Demand</option>
                </select>

                {/* Reset Filters Link if active */}
                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition ml-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t.filters.resetFilters}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Expanded Filter Matrix Drawer */}
            {showFilterDrawer && (
              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 space-y-3 text-xs animate-in fade-in">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-2">{t.filters.dietaryLabel}</label>
                  <div className="flex flex-wrap gap-2">
                    {(['vegetarian', 'vegan', 'halal', 'glutenFree'] as const).map(diet => (
                      <button
                        key={diet}
                        onClick={() => setFilterDietary(prev => ({ ...prev, [diet]: !prev[diet] }))}
                        className={`px-3 py-1.5 rounded-xl border font-bold capitalize transition cursor-pointer ${
                          filterDietary[diet] 
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {diet === 'vegetarian' ? t.filters.vegetarian : diet === 'vegan' ? t.filters.vegan : diet === 'halal' ? t.filters.halal : t.filters.glutenFree}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>{t.filters.distanceRadius}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{maxDistanceKm} km</span>
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

          {/* OFFERS DISPLAY GRID */}
          {displayMode === 'GRID' ? (
            filteredOffers.length > 0 ? (
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
              <div className="p-12 text-center bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                <p className="text-base font-bold text-slate-800 dark:text-slate-200">{t.card.noItemsTitle}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {t.card.noItemsDesc}
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow-md transition cursor-pointer"
                >
                  {t.filters.resetFilters}
                </button>
              </div>
            )
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
          <ReviewModal />
        </div>
      )}

      {/* ORDERS TAB CONTENT */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t.orders.title}</h2>
          {orders.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.orders.emptyText}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">#{order.orderNumber}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        order.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{order.offerTitle}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{order.businessName} • {order.pickupWindow}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Review Button */}
                    <button
                      onClick={() => openReviewModal(order)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/15 hover:text-amber-500 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      <span>Review</span>
                    </button>

                    <button
                      onClick={() => {
                        const matchedOffer = offers.find(o => o.id === order.offerId);
                        if (matchedOffer) setChefRescueOffer(matchedOffer);
                        setIsChefModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      <span>{t.orders.cookWithChef}</span>
                    </button>

                    <div className="text-right pl-2">
                      <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{order.totalPrice.toLocaleString()} RWF</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{order.qrToken}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <ReviewModal />
        </div>
      )}

      {/* FAVORITES TAB CONTENT */}
      {activeTab === 'FAVORITES' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t.favorites.title}</h2>
          {favorites.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.favorites.emptyText}</p>
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

      {/* IMPACT TAB CONTENT */}
      {activeTab === 'IMPACT' && (
        <div className="space-y-4">
          <LoyaltyDashboard />
        </div>
      )}

    </div>
  );
}
