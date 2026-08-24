'use client';

import React, { useState } from 'react';
import { Offer } from '@/lib/mockData';
import { useApp } from '@/lib/store';
import { MapPin, Clock, Star, Heart, Flame, Utensils, Coffee, Store, ShoppingBag, Sparkles, AlertCircle } from 'lucide-react';

interface OfferCardProps {
  offer: Offer;
  onSelect: (offer: Offer) => void;
}

export function OfferCard({ offer, onSelect }: OfferCardProps) {
  const { favorites, toggleFavorite } = useApp();
  const [imageError, setImageError] = useState(false);
  const isFav = favorites.includes(offer.businessId);

  const isSoldOut = offer.quantityAvailable <= 0;
  const discountPercent = Math.round(
    ((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100
  );

  const valueMultiplier = (offer.originalPrice / offer.discountedPrice).toFixed(1);

  const getCategoryIcon = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'bakery': return <Utensils className="w-8 h-8 text-emerald-400 opacity-60" />;
      case 'cafe': return <Coffee className="w-8 h-8 text-amber-400 opacity-60" />;
      case 'supermarket': return <ShoppingBag className="w-8 h-8 text-emerald-400 opacity-60" />;
      default: return <Store className="w-8 h-8 text-teal-400 opacity-60" />;
    }
  };

  return (
    <div className={`group relative glass-card rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col ${
      isSoldOut ? 'border-slate-800/60 opacity-85' : 'border-slate-800 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10'
    }`}>
      
      {/* Image / Fallback Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
        {!imageError && offer.imageUrl ? (
          <img
            src={offer.imageUrl}
            alt={offer.title}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 ${isSoldOut ? 'grayscale-[50%]' : 'group-hover:scale-105'}`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-950 p-6 flex flex-col items-center justify-center text-center space-y-2 border-b border-slate-800/80">
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
              {getCategoryIcon(offer.category)}
            </div>
            <span className="text-xs font-bold text-slate-300 line-clamp-1 max-w-[200px]">
              {offer.title}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5">
          {isSoldOut ? (
            <span className="bg-slate-800/90 text-slate-300 text-xs font-black px-2.5 py-1 rounded-lg shadow-lg border border-slate-700">
              Sold Out
            </span>
          ) : (
            <>
              <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-lg shadow-lg">
                -{discountPercent}% OFF
              </span>
              <span className="bg-slate-900/90 backdrop-blur-md text-emerald-400 text-[10px] font-extrabold px-2 py-1 rounded-lg border border-emerald-500/30 shadow-lg">
                Min. {valueMultiplier}x Value
              </span>
            </>
          )}

          {offer.aiDemandScore >= 90 && !isSoldOut && (
            <span className="bg-amber-500/95 backdrop-blur-md text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center space-x-1 shadow-lg">
              <Flame className="w-3 h-3 text-slate-950 fill-current" />
              <span>Fast Selling</span>
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(offer.businessId);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-rose-400 transition cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : 'text-slate-300'}`} />
        </button>

        {/* Distance & Pickup Time overlay */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-xs text-slate-300 font-medium">
          <div className="flex items-center space-x-1 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{offer.distanceKm} km</span>
          </div>
          <div className="flex items-center space-x-1 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{offer.pickupTiming === 'TOMORROW' ? 'Tomorrow' : 'Today'} {offer.pickupStart} - {offer.pickupEnd}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Merchant header */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                <Store className="w-3 h-3 text-emerald-400" />
              </div>
              <span className="text-xs font-medium text-slate-400 truncate max-w-[160px]">
                {offer.businessName}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{offer.rating}</span>
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
            {offer.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1">
            {offer.description}
          </p>

          {/* Dietary Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {offer.bagType && (
              <span className="text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-md flex items-center space-x-1">
                <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                <span>{offer.bagType}</span>
              </span>
            )}
            {offer.isVegetarian && (
              <span className="text-[10px] font-semibold bg-slate-900 text-slate-300 border border-slate-700/60 px-2 py-0.5 rounded-md">
                Vegetarian
              </span>
            )}
            {offer.isVegan && (
              <span className="text-[10px] font-semibold bg-slate-900 text-slate-300 border border-slate-700/60 px-2 py-0.5 rounded-md">
                Vegan
              </span>
            )}
            {offer.isHalal && (
              <span className="text-[10px] font-semibold bg-slate-900 text-slate-300 border border-slate-700/60 px-2 py-0.5 rounded-md">
                Halal
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Reservation CTA */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-black text-emerald-400">
                {offer.discountedPrice?.toLocaleString()} {offer.currency}
              </span>
              <span className="text-xs text-slate-500 line-through">
                {offer.originalPrice?.toLocaleString()}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              {isSoldOut ? (
                <span className="text-amber-400/90">Next drop: {offer.nextDropTime || 'Tomorrow 16:00'}</span>
              ) : (
                <span>{offer.quantityAvailable} surprise boxes left</span>
              )}
            </span>
          </div>

          <button
            onClick={() => onSelect(offer)}
            disabled={isSoldOut}
            className={`px-3.5 py-2 rounded-xl font-black text-xs transition transform cursor-pointer ${
              isSoldOut
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-95'
            }`}
          >
            {isSoldOut ? 'Sold Out' : 'Reserve Box'}
          </button>
        </div>
      </div>

    </div>
  );
}
