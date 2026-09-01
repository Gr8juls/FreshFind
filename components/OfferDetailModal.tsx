'use client';

import React, { useState, useEffect } from 'react';
import { Offer } from '@/lib/mockData';
import { useApp } from '@/lib/store';
import { InlineAuthModal } from './auth/InlineAuthModal';

import { 
  X, 
  MapPin, 
  Clock, 
  Star, 
  ShoppingBag, 
  ShieldCheck, 
  Sparkles, 
  Minus, 
  Plus, 
  Timer
} from 'lucide-react';

interface OfferDetailModalProps {
  offer: Offer | null;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export function OfferDetailModal({ offer, onClose, onProceedToCheckout }: OfferDetailModalProps) {
  const { addToCart, cartQuantity, setCartQuantity, businesses, t, isAuthenticated } = useApp();
  const [timeLeft, setTimeLeft] = useState(899); // 14 mins 59 secs
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    onProceedToCheckout();
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    onProceedToCheckout();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8 transition-colors duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 dark:bg-slate-900/80 text-white hover:bg-black/80 dark:hover:text-white border border-white/20 dark:border-slate-700/80 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-60 w-full bg-slate-100 dark:bg-slate-950">
          <img
            src={offer.imageUrl}
            alt={offer.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          
          {/* Reservation Countdown Alert Bar */}
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-3 flex items-center justify-between shadow-xl text-white">
            <div className="flex items-center space-x-2 text-emerald-400 font-medium text-xs">
              <Timer className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>{t.modal.holdActive}</span>
              <span className="font-mono font-bold text-white text-sm">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[11px] text-slate-300">{t.modal.guaranteedLock}</span>
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
                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{offer.businessName}</h4>
                <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center text-amber-500 dark:text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current mr-1" />
                    {offer.rating}
                  </span>
                  <span>•</span>
                  <span>{business?.address}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">{offer.title}</h2>
              {offer.bagType && (
                <span className="text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  {offer.bagType}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">{offer.description}</p>
          </div>

          {/* Guaranteed Value & Pricing Insights */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
              <span className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>{t.modal.guaranteedValuePromise} ({valueMultiplier}x Value)</span>
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                Min. {offer.originalPrice.toLocaleString()} {offer.currency} Value
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {t.modal.valueDiscountNote.replace('~2.5 kg of CO₂', `~2.5 kg CO₂`)} ({discountPercent}% discount)
            </p>
          </div>

          {/* Pickup Window & Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-xs text-amber-600 dark:text-amber-400 font-bold">
                <Clock className="w-4 h-4" />
                <span>{t.modal.pickupTime} ({offer.pickupTiming === 'TOMORROW' ? t.card.tomorrow : t.card.today})</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                {offer.pickupStart} - {offer.pickupEnd}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.modal.arrivePrompt}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                <MapPin className="w-4 h-4" />
                <span>{t.modal.storeLocation}</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{business?.address}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{business?.phone}</p>
            </div>
          </div>

          {/* Quantity Selector & Price Summary */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-950 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.modal.qty}</span>
              <button
                onClick={() => setCartQuantity(Math.max(1, cartQuantity - 1))}
                aria-label="Decrease quantity"
                className="p-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer shadow-sm"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 w-4 text-center">{cartQuantity}</span>
              <button
                onClick={() => setCartQuantity(Math.min(offer.quantityAvailable, cartQuantity + 1))}
                aria-label="Increase quantity"
                className="p-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400 line-through">
                {(offer.originalPrice * cartQuantity).toLocaleString()} {offer.currency}
              </div>
              <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                {(offer.discountedPrice * cartQuantity).toLocaleString()} {offer.currency}
              </div>
            </div>
          </div>

        </div>

        {/* Footer Action */}
        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">{t.modal.refundGuarantee}</span>
          </div>

          <button
            onClick={handleReserve}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/20 transition transform active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.modal.reserveAndCheckout}</span>
          </button>
        </div>

      </div>

      {/* Inline Passwordless/Social Auth Modal for checkout */}
      <InlineAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        title={`Sign in to reserve from ${offer.businessName}`}
        subtitle="Quick passwordless login — never lose your meal reservation"
      />
    </div>
  );
}

