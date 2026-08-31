'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { Offer } from '@/lib/mockData';
import { OfferCard } from '@/components/OfferCard';
import { OfferDetailModal } from '@/components/OfferDetailModal';
import { formatDistance } from '@/lib/geolocation';
import { 
  Store, 
  MapPin, 
  Clock, 
  Phone, 
  Star, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Bell, 
  BellRing, 
  Check, 
  ChevronLeft, 
  Share2, 
  ShoppingBag,
  Award,
  Users
} from 'lucide-react';

interface StoreProfilePageProps {
  slug: string;
}

export function StoreProfilePage({ slug }: StoreProfilePageProps) {
  const { 
    businesses, 
    offers, 
    favorites, 
    toggleFavorite, 
    reviews, 
    subscribeToDropAlert, 
    isSubscribedToDrop,
    setIsCheckoutModalOpen
  } = useApp();

  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isNotifying, setIsNotifying] = useState(false);
  const [copied, setCopied] = useState(false);

  // Find business by slug or fallback
  const business = businesses.find(b => b.slug === slug) || businesses[0];
  const storeOffers = offers.filter(o => o.businessId === business.id);
  const storeReviews = reviews.filter(r => r.businessId === business.id);
  const isFav = favorites.includes(business.id);
  const isSubscribed = isSubscribedToDrop(business.id);

  const handleNotifyToggle = async () => {
    setIsNotifying(true);
    await subscribeToDropAlert(business.id, business.name);
    setTimeout(() => setIsNotifying(false), 1200);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${business.name} — FreshFind Kigali`,
      text: `Rescue surprise bags at ${business.name} up to 70% off!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (e) {}
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Back button navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition shadow-sm cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-500 transition cursor-pointer shadow-sm"
            aria-label="Share store"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => toggleFavorite(business.id)}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-500 transition cursor-pointer shadow-sm"
            aria-label="Favorite store"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Store Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="relative h-48 sm:h-64 w-full bg-slate-950">
          <img
            src={business.bannerUrl || 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=800'}
            alt={business.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* Store Info Overlay */}
        <div className="p-6 sm:p-8 relative -mt-16 sm:-mt-20 z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="flex items-end space-x-4">
            <img
              src={business.logoUrl || 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=150'}
              alt={business.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-white dark:border-slate-900 shadow-2xl bg-slate-800"
            />

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{business.name}</h1>
                {business.isVerified && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Partner</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 line-clamp-1 max-w-md">{business.description}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium pt-1">
                <span className="flex items-center space-x-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{business.rating}</span>
                  <span className="text-slate-400 font-normal">({business.totalReviews || storeReviews.length} reviews)</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{formatDistance(business.distanceKm)} ({business.district})</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Notify CTA */}
          <button
            onClick={handleNotifyToggle}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center space-x-2 transition cursor-pointer shadow-lg shrink-0 ${
              isSubscribed
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isSubscribed ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Drop Notifications Active</span>
              </>
            ) : isNotifying ? (
              <>
                <BellRing className="w-4 h-4 animate-bounce text-amber-300" />
                <span>Enabling Alerts...</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                <span>Notify on New Drops</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Store Details Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pickup Windows</span>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{business.openingHours}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Address</span>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{business.address}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-3 shadow-sm">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Direct Phone</span>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{business.phone}</p>
          </div>
        </div>
      </div>

      {/* Active Surprise Food Drops */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Active Surprise Bags ({storeOffers.length})</h2>
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Up to 70% off regular menu</span>
        </div>

        {storeOffers.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No active drops right now</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Click "Notify on New Drops" above to be alerted when stock is added!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {storeOffers.map(offer => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onSelect={(off) => setSelectedOffer(off)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reviews & Ratings Section */}
      <div id="reviews" className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Food Rescuer Reviews</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Verified reviews from Kigali community members</p>
          </div>
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 font-black text-sm">
            <Star className="w-4 h-4 fill-current" />
            <span>{business.rating} / 5.0</span>
          </div>
        </div>

        {storeReviews.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">Be the first to leave a review after your next pickup!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {storeReviews.map(rev => (
              <div key={rev.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={rev.userAvatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'}
                      alt={rev.userName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{rev.userName}</h4>
                        {rev.verifiedRescue && (
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            Verified Rescue
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{rev.createdAt} • {rev.offerTitle || 'Surprise Bag'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map(st => (
                      <Star key={st} className={`w-3.5 h-3.5 ${st <= rev.rating ? 'fill-current text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{rev.comment}</p>

                {rev.tags && rev.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rev.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Offer Detail Modal */}
      {selectedOffer && (
        <OfferDetailModal
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
          onProceedToCheckout={() => {
            setSelectedOffer(null);
            setIsCheckoutModalOpen(true);
          }}
        />
      )}

    </div>
  );
}
