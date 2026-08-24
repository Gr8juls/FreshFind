'use client';

import React, { useState, useEffect } from 'react';
import { Offer } from '@/lib/mockData';
import { useApp } from '@/lib/store';
import { 
  X, 
  MapPin, 
  Clock, 
  Star, 
  ShoppingBag, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Minus, 
  Plus, 
  Leaf,
  Timer,
  Bike
} from 'lucide-react';

interface OfferDetailModalProps {
  offer: Offer | null;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export function OfferDetailModal({ offer, onClose, onProceedToCheckout }: OfferDetailModalProps) {
  const { addToCart, cartQuantity, setCartQuantity, businesses } = useApp();
  const [timeLeft, setTimeLeft] = useState(899); // 14 mins 59 secs

  useEffect(() => {
    if (!offer) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [offer]);

  if (!offer) return null;

  const business = businesses.find(b => b.id === offer.businessId);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const discountPercent = Math.round(
    ((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100
  );

  const valueMultiplier = (offer.originalPrice / offer.discountedPrice).toFixed(1);

  const handleReserve = () => {
    addToCart(offer);
    onProceedToCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700/80 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 w-full bg-slate-950">
          <img
            src={offer.imageUrl}
            alt={offer.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
          
          {/* Reservation Countdown Alert Bar */}
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between shadow-xl">
            <div className="flex items-center space-x-2 text-emerald-400 font-medium text-xs">
              <Timer className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Surprise Bag Hold Active:</span>
              <span className="font-mono font-bold text-slate-100 text-sm">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Guaranteed item lock</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Header */}
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <img
                src={offer.businessLogo}
                alt={offer.businessName}
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
              />
              <div>
                <h4 className="text-sm font-semibold text-slate-300">{offer.businessName}</h4>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span className="flex items-center text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current mr-1" />
                    {offer.rating}
                  </span>
                  <span>•</span>
                  <span>{business?.address}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              <h2 className="text-2xl font-black text-slate-100">{offer.title}</h2>
              {offer.bagType && (
                <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  {offer.bagType}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mt-2">{offer.description}</p>
          </div>

          {/* TGTG Guaranteed Value & Pricing Insights */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
              <span className="flex items-center space-x-1.5 text-emerald-400">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Guaranteed Value Promise ({valueMultiplier}x Value)</span>
              </span>
              <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Min. {offer.originalPrice.toLocaleString()} RWF Value
              </span>
            </div>
            <p className="text-xs text-slate-300">
              You pay only <strong className="text-emerald-400">{offer.discountedPrice.toLocaleString()} RWF</strong> ({discountPercent}% discount). By rescuing this package, you avoid ~<strong className="text-slate-100">2.5 kg of CO₂</strong> emissions!
            </p>
          </div>

          {/* Pickup Window & Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold">
                <Clock className="w-4 h-4" />
                <span>Pickup Time ({offer.pickupTiming === 'TOMORROW' ? 'Tomorrow' : 'Today'})</span>
              </div>
              <p className="text-base font-bold text-slate-100">
                {offer.pickupStart} - {offer.pickupEnd}
              </p>
              <p className="text-[11px] text-slate-400">Arrive at store before the window closes.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold">
                <MapPin className="w-4 h-4" />
                <span>Store Location & Contact</span>
              </div>
              <p className="text-sm font-bold text-slate-100 truncate">{business?.address}</p>
              <p className="text-[11px] text-slate-400">{business?.phone}</p>
            </div>
          </div>

          {/* Quantity Selector & Price Summary */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3 bg-slate-950 px-3 py-2 rounded-2xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-400">Qty:</span>
              <button
                onClick={() => setCartQuantity(Math.max(1, cartQuantity - 1))}
                className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold text-slate-100 w-4 text-center">{cartQuantity}</span>
              <button
                onClick={() => setCartQuantity(Math.min(offer.quantityAvailable, cartQuantity + 1))}
                className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400 line-through">
                {(offer.originalPrice * cartQuantity).toLocaleString()} RWF
              </div>
              <div className="text-xl font-black text-emerald-400">
                {(offer.discountedPrice * cartQuantity).toLocaleString()} RWF
              </div>
            </div>
          </div>

        </div>

        {/* Footer Action */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Automatic Refund Guarantee</span>
          </div>

          <button
            onClick={handleReserve}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 transition transform active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Reserve & Checkout</span>
          </button>
        </div>

      </div>
    </div>
  );
}
