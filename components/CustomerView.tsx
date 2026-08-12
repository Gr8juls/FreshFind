'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Offer } from '@/lib/mockData';
import { OfferCard } from './OfferCard';
import { AIDemandForecastWidget } from './AIDemandForecastWidget';
import { 
  MapPin, 
  SlidersHorizontal, 
  Grid, 
  Map as MapIcon, 
  Leaf, 
  Heart, 
  ShoppingBag,
  PackageCheck
} from 'lucide-react';

interface CustomerViewProps {
  onSelectOffer: (offer: Offer) => void;
}

export function CustomerView({ onSelectOffer }: CustomerViewProps) {
  const { 
    offers, 
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
    favorites
  } = useApp();

  const [displayMode, setDisplayMode] = useState<'GRID' | 'MAP'>('GRID');
  const [activeTab, setActiveTab] = useState<'OFFERS' | 'ORDERS' | 'FAVORITES' | 'IMPACT'>('OFFERS');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

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

  return (
    <div className="space-y-8 pb-16">
      
      {/* HERO BANNER & USER IMPACT TRACKER */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-eco-card to-slate-950">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-brand-500/10 border border-brand-500/30 px-3 py-1 rounded-full text-xs font-bold text-brand-400">
              <Leaf className="w-3.5 h-3.5" />
              <span>Rescue Surplus Food • Save Up to 70%</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight leading-tight">
              Delicious Meals from Kigali's Top Spots Before Closing.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Every day, restaurants & bakeries prepare too much food. Save high-quality meals while reducing CO₂ footprint in Rwanda.
            </p>
          </div>

          {/* Environmental Impact Metrics Badge */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-black text-brand-400">{user.mealsRescued}</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Meals Saved</div>
            </div>
            <div className="text-center border-x border-slate-800 px-2">
              <div className="text-lg sm:text-xl font-black text-emerald-400">{user.co2SavedKg} kg</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">CO₂ Prevented</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-black text-amber-400">{user.badgeTier}</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Eco Status</div>
            </div>
          </div>

        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 overflow-x-auto">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('OFFERS')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              activeTab === 'OFFERS'
                ? 'bg-brand-500 text-slate-950 shadow-lg shadow-brand-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Explore Surplus Offers ({filteredOffers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition relative ${
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
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              activeTab === 'FAVORITES'
                ? 'bg-brand-500 text-slate-950 shadow-lg shadow-brand-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Saved Stores ({favorites.length})</span>
          </button>
        </div>

        {/* View Mode Toggle: Grid vs Map */}
        {activeTab === 'OFFERS' && (
          <div className="hidden sm:flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setDisplayMode('GRID')}
              className={`p-2 rounded-lg transition ${displayMode === 'GRID' ? 'bg-slate-800 text-brand-400' : 'text-slate-400'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDisplayMode('MAP')}
              className={`p-2 rounded-lg transition ${displayMode === 'MAP' ? 'bg-slate-800 text-brand-400' : 'text-slate-400'}`}
            >
              <MapIcon className="w-4 h-4" />
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
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
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
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
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
                      className={`px-3 py-1.5 rounded-lg border font-semibold ${filterDietary.vegetarian ? 'bg-emerald-950 text-emerald-400 border-emerald-500' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                    >
                      Vegetarian
                    </button>
                    <button
                      onClick={() => setFilterDietary(prev => ({ ...prev, vegan: !prev.vegan }))}
                      className={`px-3 py-1.5 rounded-lg border font-semibold ${filterDietary.vegan ? 'bg-teal-950 text-teal-400 border-teal-500' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                    >
                      Vegan
                    </button>
                    <button
                      onClick={() => setFilterDietary(prev => ({ ...prev, halal: !prev.halal }))}
                      className={`px-3 py-1.5 rounded-lg border font-semibold ${filterDietary.halal ? 'bg-amber-950 text-amber-400 border-amber-500' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                    >
                      Halal
                    </button>
                    <button
                      onClick={() => setFilterDietary(prev => ({ ...prev, glutenFree: !prev.glutenFree }))}
                      className={`px-3 py-1.5 rounded-lg border font-semibold ${filterDietary.glutenFree ? 'bg-indigo-950 text-indigo-400 border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
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
          {displayMode === 'GRID' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map(offer => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onSelect={onSelectOffer}
                />
              ))}
            </div>
          )}

          {/* MAP VIEW FALLBACK */}
          {displayMode === 'MAP' && (
            <div className="h-96 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center relative overflow-hidden">
              <div className="text-center space-y-2 p-6 z-10">
                <MapIcon className="w-12 h-12 text-brand-400 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-slate-200">Interactive Kigali Map</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Map view shows {filteredOffers.length} food rescue spots in Nyarutarama, Kiyovu, and Kimihurura.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ORDERS TAB CONTENT */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100">Your Active & Past Orders</h2>
          {orders.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
              <p className="text-sm text-slate-400">No orders placed yet. Explore surplus offers to reserve food!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(ord => (
                <div key={ord.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono bg-slate-800 text-brand-400 px-2 py-0.5 rounded font-bold">{ord.orderNumber}</span>
                      <span className="text-sm font-bold text-slate-200">{ord.offerTitle}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{ord.businessName} • {ord.quantity} package(s) • {ord.totalPrice.toLocaleString()} RWF</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {ord.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAVORITES TAB CONTENT */}
      {activeTab === 'FAVORITES' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100">Saved Stores & Bakeries</h2>
          {favorites.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
              <p className="text-sm text-slate-400">No saved stores yet. Click the heart icon on any offer to save!</p>
            </div>
          ) : (
            <p className="text-sm text-slate-300">You have {favorites.length} saved business(es).</p>
          )}
        </div>
      )}

    </div>
  );
}
