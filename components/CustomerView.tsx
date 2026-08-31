'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Offer } from '@/lib/mockData';
import { OfferCard } from './OfferCard';
import { MarketplaceMap } from './MarketplaceMap';
import { AIChefRescueModal } from './AIChefRescueModal';
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
  Award
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
    language,
    setLanguage,
    t,
    setIsChefModalOpen,
    setChefRescueOffer
  } = useApp();

  const [displayMode, setDisplayMode] = useState<'GRID' | 'MAP'>('GRID');
  const [activeTab, setActiveTab] = useState<'OFFERS' | 'ORDERS' | 'FAVORITES' | 'IMPACT'>('OFFERS');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  
  // Filtering states
  const [timingFilter, setTimingFilter] = useState<'ALL' | 'TODAY' | 'TOMORROW'>('ALL');
  const [hideSoldOut, setHideSoldOut] = useState(false);

  // Review modal state
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
    maxDistanceKm < 10;

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setTimingFilter('ALL');
    setHideSoldOut(false);
    setSearchQuery('');
    setFilterDietary({ vegetarian: false, vegan: false, halal: false, glutenFree: false });
    setMaxDistanceKm(10);
  };

  // Check if any favorited store has active bags
  const favoriteActiveBags = offers.filter(o => favorites.includes(o.businessId) && o.quantityAvailable > 0);

  return (
    <div className="space-y-6 pb-16 font-sans">
      
      {/* Review Success Toast */}
      {reviewSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-semibold">Thank you for rating food freshness &amp; supporting Kigali artisans!</span>
        </div>
      )}

      {/* HERO BANNER & INTRO */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-200 dark:border-slate-800 p-6 sm:p-7 bg-gradient-to-r from-white via-emerald-50/40 to-slate-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 transition-colors duration-200">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2.5 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.hero.valueBadge}</span>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-300 space-x-1">
                <Globe className="w-3 h-3 text-emerald-500" />
                {(['EN', 'FR', 'RW'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-1.5 py-0.5 rounded cursor-pointer transition ${language === lang ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {t.hero.subtitle}
            </p>
          </div>

          {/* Environmental Impact Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-white/80 dark:bg-slate-950/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
            <div className="text-center">
              <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">{user.mealsRescued}</div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{t.hero.bagsRescued}</div>
            </div>
            <div className="text-center border-x border-slate-200 dark:border-slate-800 px-2">
              <div className="text-base sm:text-lg font-black text-teal-600 dark:text-teal-400">{user.co2SavedKg} kg</div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{t.hero.co2Avoided}</div>
            </div>
            <div className="text-center">
              <div className="text-base sm:text-lg font-black text-amber-500 dark:text-amber-400">480 pts</div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{t.hero.ecoPoints}</div>
            </div>
          </div>

        </div>
      </div>

      {/* Favorite Store Drop Alert Banner (if available) */}
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
          
          {/* UNIFIED FILTER TOOLBAR */}
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

            {/* Row 2: Timing & Quick Toggles */}
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

              {/* Reset Filters Link if active */}
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t.filters.resetFilters}</span>
                </button>
              )}
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
                  
                  <div className="flex items-center space-x-3">
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

                    <div className="text-right">
                      <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{order.totalPrice.toLocaleString()} RWF</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{order.qrToken}</p>
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
