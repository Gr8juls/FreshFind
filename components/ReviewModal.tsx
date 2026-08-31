'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { POPULAR_REVIEW_TAGS } from '@/lib/reviews';
import { Star, X, CheckCircle, Sparkles, Store, ShieldCheck, Heart } from 'lucide-react';

export function ReviewModal() {
  const { isReviewModalOpen, closeReviewModal, reviewTargetOrder, submitReview, businesses, user } = useApp();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Generous Portion 🥐', 'Super Fresh 🥗']);
  const [comment, setComment] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isReviewModalOpen || !reviewTargetOrder) return null;

  const business = businesses.find(b => b.name === reviewTargetOrder.businessName);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTargetOrder || !business) return;

    submitReview({
      businessId: business.id,
      orderId: reviewTargetOrder.id,
      userName: user.fullName || 'Food Rescue Hero',
      userAvatar: user.avatarUrl,
      rating,
      comment: comment.trim() || 'Great surprise bag rescue! Fresh, tasty, and helped prevent food waste.',
      tags: selectedTags,
      offerTitle: reviewTargetOrder.offerTitle,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      closeReviewModal();
      setComment('');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-6 text-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-950/80">Verified Rescue</span>
              <h3 className="text-lg font-black leading-tight text-slate-950">How was your Surprise Bag?</h3>
            </div>
          </div>

          <button
            onClick={closeReviewModal}
            className="p-2 rounded-full bg-black/10 hover:bg-black/20 text-slate-950 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white">Review Submitted! ⭐</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Thank you for helping the Kigali community discover sustainable food rescue partners. +25 Eco Points added!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Store & Order info pill */}
            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center overflow-hidden">
                {business?.logoUrl ? (
                  <img src={business.logoUrl} alt={business.name} className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{reviewTargetOrder.businessName}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{reviewTargetOrder.offerTitle}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Rescued
              </span>
            </div>

            {/* Interactive Stars */}
            <div className="text-center space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Your Rating
              </label>
              <div className="flex items-center justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1.5 transition transform hover:scale-125 focus:outline-none cursor-pointer"
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          active
                            ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-xs font-extrabold text-amber-500 dark:text-amber-400">
                {rating === 5 && 'Outstanding Food & Experience! 🌟'}
                {rating === 4 && 'Great value, really fresh! 🥐'}
                {rating === 3 && 'Good rescue, average portion. 👍'}
                {rating === 2 && 'Could be better. 😕'}
                {rating === 1 && 'Disappointed with rescue. ⚠️'}
              </p>
            </div>

            {/* Quick Feedback Tags */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                What did you like most?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_REVIEW_TAGS.map((tag) => {
                  const selected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                        selected
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Detailed Feedback (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What was inside your surprise box? How fresh was it? Help other food rescuers in Kigali!"
                rows={3}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verified Buyer Review</span>
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={closeReviewModal}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-extrabold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition transform active:scale-95 cursor-pointer"
                >
                  Post Review ⭐
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
