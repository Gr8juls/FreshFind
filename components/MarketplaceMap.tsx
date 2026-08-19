'use client';

import React, { useState } from 'react';
import { Offer, Business } from '@/lib/mockData';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Star, 
  ShoppingBag, 
  Store, 
  Sparkles, 
  Layers, 
  Utensils, 
  Coffee,
  X,
  Compass,
  ArrowRight
} from 'lucide-react';

interface MarketplaceMapProps {
  offers: Offer[];
  businesses: Business[];
  onSelectOffer: (offer: Offer) => void;
  maxDistanceKm: number;
  setMaxDistanceKm: (dist: number) => void;
}

export function MarketplaceMap({
  offers,
  businesses,
  onSelectOffer,
  maxDistanceKm,
  setMaxDistanceKm
}: MarketplaceMapProps) {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(businesses[0]?.id || null);
  const [mapLayer, setMapLayer] = useState<'STANDARD' | 'SATELLITE' | 'ECO'>('ECO');

  // Relative SVG mapping for Kigali coordinates:
  // Center approx lat: -1.948, lng: 30.075
  const getPinPosition = (lat: number = -1.948, lng: number = 30.075) => {
    // Map bounding box: lat [-1.970, -1.925], lng [30.040, 30.120]
    const minLat = -1.970;
    const maxLat = -1.925;
    const minLng = 30.040;
    const maxLng = 30.120;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return {
      left: `${Math.max(8, Math.min(92, x))}%`,
      top: `${Math.max(12, Math.min(88, y))}%`,
    };
  };

  const selectedBusiness = businesses.find(b => b.id === selectedBusinessId);
  const activeOffer = offers.find(o => o.businessId === selectedBusinessId) || offers[0];

  return (
    <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 bg-slate-950 shadow-2xl h-[580px] flex flex-col font-sans">
      
      {/* Top Map HUD Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* District & Location Badge */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 px-3.5 py-2 rounded-2xl flex items-center space-x-2 shadow-xl">
          <Navigation className="w-4 h-4 text-brand-400 animate-pulse" />
          <div>
            <div className="text-[11px] font-bold text-slate-100 flex items-center space-x-1.5">
              <span>Kigali Urban Radius</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            </div>
            <p className="text-[10px] text-slate-400">Showing verified surplus food partners</p>
          </div>
        </div>

        {/* Radius Filter Slider */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 px-4 py-2 rounded-2xl flex items-center space-x-3 shadow-xl">
          <span className="text-xs font-semibold text-slate-300">Distance:</span>
          <input
            type="range"
            min={1}
            max={10}
            value={maxDistanceKm}
            onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
            className="w-24 sm:w-32 accent-brand-500 cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-brand-400 min-w-[42px]">{maxDistanceKm} km</span>
        </div>

        {/* Map Layers */}
        <div className="pointer-events-auto flex items-center bg-slate-900/90 backdrop-blur-xl p-1 rounded-2xl border border-slate-700/80 shadow-xl">
          {(['ECO', 'STANDARD', 'SATELLITE'] as const).map(layer => (
            <button
              key={layer}
              onClick={() => setMapLayer(layer)}
              className={`px-3 py-1 text-[10px] font-bold rounded-xl transition cursor-pointer ${
                mapLayer === layer 
                  ? 'bg-brand-500 text-slate-950 font-extrabold shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>

      </div>

      {/* Interactive Map Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-slate-950">
        
        {/* Stylized Vector Map Background (Kigali Roadways & Topography) */}
        <svg className="w-full h-full object-cover opacity-35" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <defs>
            <radialGradient id="kigaliCenter" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid & Hills */}
          <rect width="1000" height="600" fill="url(#kigaliCenter)" />
          
          {/* Main Kigali Arteries (KG/KN Boulevards) */}
          <path d="M50 300 C 250 280, 450 320, 950 290" stroke="#334155" strokeWidth="6" fill="none" />
          <path d="M200 50 C 250 200, 300 450, 350 550" stroke="#334155" strokeWidth="4" fill="none" />
          <path d="M500 50 C 480 250, 520 400, 580 550" stroke="#334155" strokeWidth="5" fill="none" />
          <path d="M750 80 C 700 250, 820 420, 900 550" stroke="#334155" strokeWidth="3" fill="none" />

          {/* Secondary Street Meshes */}
          <path d="M 120 180 Q 280 220 400 160 T 700 220 T 920 180" stroke="#1E293B" strokeWidth="2.5" fill="none" />
          <path d="M 100 420 Q 300 380 520 430 T 880 400" stroke="#1E293B" strokeWidth="2.5" fill="none" />
          
          {/* Kigali District Areas & Radials */}
          <circle cx="500" cy="300" r="140" stroke="#059669" strokeWidth="1" strokeDasharray="6 6" fill="none" opacity="0.4" />
          <circle cx="500" cy="300" r="260" stroke="#059669" strokeWidth="1" strokeDasharray="8 8" fill="none" opacity="0.2" />

          {/* District Labels */}
          <text x="360" y="160" fill="#64748B" fontSize="13" fontWeight="bold" letterSpacing="2">NYARUTARAMA</text>
          <text x="460" y="240" fill="#64748B" fontSize="13" fontWeight="bold" letterSpacing="2">KACYIRU</text>
          <text x="240" y="340" fill="#64748B" fontSize="13" fontWeight="bold" letterSpacing="2">KIYOVU (CBD)</text>
          <text x="540" y="360" fill="#64748B" fontSize="13" fontWeight="bold" letterSpacing="2">KIMIHURURA</text>
          <text x="740" y="320" fill="#64748B" fontSize="13" fontWeight="bold" letterSpacing="2">REMERA</text>
        </svg>

        {/* User Location Radar Pin */}
        <div 
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: '38%', top: '56%' }}
        >
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 animate-ping absolute" />
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <span className="absolute top-5 bg-slate-900/90 text-blue-300 font-bold text-[9px] px-1.5 py-0.5 rounded-md border border-blue-500/30 whitespace-nowrap shadow-md">
              You are here (Kiyovu)
            </span>
          </div>
        </div>

        {/* Interactive Store Partner Pins */}
        {businesses.map((b) => {
          const offer = offers.find(o => o.businessId === b.id);
          const isSelected = selectedBusinessId === b.id;
          const pos = getPinPosition(b.lat, b.lng);

          const getCategoryIcon = (cat: string) => {
            switch (cat?.toLowerCase()) {
              case 'bakery': return <Utensils className="w-3.5 h-3.5" />;
              case 'cafe': return <Coffee className="w-3.5 h-3.5" />;
              case 'supermarket': return <ShoppingBag className="w-3.5 h-3.5" />;
              default: return <Store className="w-3.5 h-3.5" />;
            }
          };

          return (
            <div
              key={b.id}
              onClick={() => setSelectedBusinessId(b.id)}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 cursor-pointer group hover:scale-110"
              style={pos}
            >
              <div className="relative flex flex-col items-center">
                
                {/* Discount Badge on top of pin */}
                {offer && (
                  <span className="mb-1 bg-gradient-to-r from-brand-600 to-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-lg whitespace-nowrap border border-emerald-300">
                    -{Math.round(((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100)}%
                  </span>
                )}

                {/* Pin Head */}
                <div className={`p-2 rounded-2xl border transition-all duration-300 shadow-2xl flex items-center justify-center ${
                  isSelected
                    ? 'bg-brand-500 text-slate-950 border-white scale-125 shadow-brand-500/50 ring-4 ring-brand-500/20'
                    : 'bg-slate-900 text-brand-400 border-slate-700 hover:border-brand-400'
                }`}>
                  {getCategoryIcon(b.category)}
                </div>

                {/* Mini Store Label */}
                <span className={`mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md backdrop-blur-md whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-slate-900 text-brand-300 border border-brand-500/60 shadow-lg'
                    : 'bg-slate-950/80 text-slate-300 border border-slate-800'
                }`}>
                  {b.name.split(' ')[0]}
                </span>
              </div>
            </div>
          );
        })}

      </div>

      {/* Selected Store Floating Bottom Card */}
      {selectedBusiness && (
        <div className="absolute bottom-4 left-4 right-4 z-30 pointer-events-auto max-w-xl mx-auto">
          <div className="glass-card p-4 rounded-3xl border border-slate-700/80 bg-slate-900/95 backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <img
                src={selectedBusiness.logoUrl}
                alt={selectedBusiness.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-500/40 flex-shrink-0"
              />
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <h4 className="font-extrabold text-slate-100 text-sm sm:text-base line-clamp-1">
                    {selectedBusiness.name}
                  </h4>
                  <span className="flex items-center text-amber-400 text-xs font-bold">
                    <Star className="w-3 h-3 fill-current mr-0.5" />
                    {selectedBusiness.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{selectedBusiness.address}, {selectedBusiness.district}</p>
                <div className="flex items-center space-x-2 text-[11px] text-slate-300 pt-0.5">
                  <span className="text-brand-400 font-semibold">{selectedBusiness.distanceKm} km away (~{Math.round(selectedBusiness.distanceKm * 12)} mins walk)</span>
                  <span>•</span>
                  <span className="text-amber-400 font-medium">{selectedBusiness.openingHours}</span>
                </div>
              </div>
            </div>

            {/* Action Offer Preview & Reserve */}
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
              {activeOffer && (
                <div className="text-right mr-2 hidden sm:block">
                  <p className="text-[10px] text-slate-400">Chef's Surprise Bag</p>
                  <p className="text-xs font-black text-brand-400 font-mono">
                    {activeOffer.discountedPrice.toLocaleString()} RWF
                  </p>
                </div>
              )}

              <button
                onClick={() => activeOffer && onSelectOffer(activeOffer)}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-brand-500/25 transition cursor-pointer w-full sm:w-auto"
              >
                <span>Reserve Surprise Bag</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
