'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChefHat, 
  Clock, 
  UtensilsCrossed, 
  Flame, 
  CheckCircle2, 
  Leaf, 
  Lightbulb, 
  Share2, 
  Timer, 
  X,
  Play,
  RotateCcw
} from 'lucide-react';
import { useApp } from '@/lib/store';

export function AIChefRescueModal() {
  const { isChefModalOpen, setIsChefModalOpen, chefRescueOffer, offers } = useApp();

  const [selectedOfferId, setSelectedOfferId] = useState<string>(chefRescueOffer?.id || offers[0]?.id || '');
  const [customIngredients, setCustomIngredients] = useState<string>('');
  const [mealType, setMealType] = useState<'DINNER' | 'BREAKFAST' | 'DESSERT' | 'ANY'>('ANY');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [activeRecipeIndex, setActiveRecipeIndex] = useState<number>(0);
  const [activeTimerSeconds, setActiveTimerSeconds] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    if (chefRescueOffer?.id) {
      setSelectedOfferId(chefRescueOffer.id);
    }
  }, [chefRescueOffer]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && activeTimerSeconds && activeTimerSeconds > 0) {
      interval = setInterval(() => {
        setActiveTimerSeconds((prev) => (prev ? prev - 1 : 0));
      }, 1000);
    } else if (activeTimerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, activeTimerSeconds]);

  if (!isChefModalOpen) return null;

  const currentOffer = offers.find(o => o.id === selectedOfferId) || chefRescueOffer || offers[0];

  const handleGenerateRecipes = async () => {
    setIsLoading(true);
    setRecipes([]);

    const items = customIngredients.trim()
      ? customIngredients.split(',').map(s => s.trim())
      : currentOffer?.aiTags || [currentOffer?.title || 'Bakery Surprise Pastries', 'Bread Loaf'];

    try {
      const res = await fetch('/api/ai/chef-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          bagTitle: currentOffer?.title,
          mealType,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.recipes && data.recipes.length > 0) {
          setRecipes(data.recipes);
          setActiveRecipeIndex(0);
        }
      }
    } catch (e) {
      console.error('Failed to generate recipes:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const activeRecipe = recipes[activeRecipeIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">
              <ChefHat className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-slate-100">&ldquo;Chef Rescue&rdquo; Zero-Waste AI Assistant</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  AI Culinary Co-Pilot
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transform rescued surprise bags into delicious meals with zero waste &amp; professional revival tricks.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsChefModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Input / Selection Area */}
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Pick Rescued Bag */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Choose Rescued Mystery Bag</label>
              <select
                value={selectedOfferId}
                onChange={(e) => setSelectedOfferId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {offers.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.businessName} - {o.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Meal Type */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Desired Meal Preference</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['ANY', 'BREAKFAST', 'DINNER', 'DESSERT'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMealType(type)}
                    className={`py-2 rounded-xl font-bold border transition cursor-pointer text-center ${
                      mealType === type ? 'bg-amber-950/80 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {type === 'ANY' ? 'Any' : type === 'BREAKFAST' ? 'Breakfast' : type === 'DINNER' ? 'Dinner' : 'Dessert'}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Optional Extra Ingredients */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">
              Add extra kitchen ingredients on hand (optional):
            </label>
            <input
              type="text"
              value={customIngredients}
              onChange={(e) => setCustomIngredients(e.target.value)}
              placeholder="e.g. 2 eggs, ripe bananas, milk, tomatoes, garlic..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleGenerateRecipes}
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'AI Chef Cooking Recipes...' : 'Generate Zero-Waste Recipes with AI'}</span>
          </button>
        </div>

        {/* RECIPES DISPLAY AREA */}
        {recipes.length > 0 && activeRecipe && (
          <div className="space-y-4 bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 animate-in fade-in">
            
            {/* Recipe Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex space-x-2">
                {recipes.map((r, idx) => (
                  <button
                    key={r.title + idx}
                    onClick={() => setActiveRecipeIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      activeRecipeIndex === idx ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Recipe {idx + 1}: {r.title.slice(0, 22)}...
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center space-x-1">
                <Leaf className="w-3.5 h-3.5" />
                <span>Zero Food Waste</span>
              </span>
            </div>

            {/* Active Recipe Header */}
            <div>
              <h4 className="text-base sm:text-lg font-black text-slate-100">{activeRecipe.title}</h4>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Prep: {activeRecipe.prepTime} | Cook: {activeRecipe.cookTime}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>Difficulty: {activeRecipe.difficulty}</span>
                </span>
                <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
                  <span>Serves {activeRecipe.servings} people</span>
                </span>
              </div>
            </div>

            {/* Chef Secret Revival Box */}
            {activeRecipe.chefRevivalSecret && (
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-amber-400">
                  <Lightbulb className="w-4 h-4" />
                  <span>Chef Revival Trick (How to make it taste fresh-baked):</span>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  {activeRecipe.chefRevivalSecret}
                </p>
              </div>
            )}

            {/* Ingredients & Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              
              {/* Ingredients Checklist */}
              <div className="space-y-2 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ingredients Checklist</span>
                </span>
                <ul className="space-y-1.5">
                  {activeRecipe.ingredients?.map((ing: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2 text-slate-300">
                      <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step-by-Step Cooking */}
              <div className="space-y-2 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                  <Timer className="w-3.5 h-3.5 text-orange-400" />
                  <span>Step-by-Step Instructions</span>
                </span>
                <ol className="space-y-2">
                  {activeRecipe.steps?.map((step: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2 text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-[11px] leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

            </div>

            {/* Cooking Timer Tool */}
            <div className="flex items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-center space-x-2">
                <Timer className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-slate-200">10-Minute Cooking Timer:</span>
                <span className="font-mono text-base font-black text-amber-400">
                  {activeTimerSeconds !== null
                    ? `${Math.floor(activeTimerSeconds / 60)}:${(activeTimerSeconds % 60).toString().padStart(2, '0')}`
                    : '10:00'}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    if (activeTimerSeconds === null) setActiveTimerSeconds(600);
                    setIsTimerRunning(!isTimerRunning);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1 transition cursor-pointer"
                >
                  <Play className="w-3 h-3" />
                  <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setActiveTimerSeconds(600);
                  }}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Eco Impact Footer */}
            {activeRecipe.ecoSaving && (
              <p className="text-[11px] text-emerald-400 font-semibold text-center pt-1">
                🌱 {activeRecipe.ecoSaving}
              </p>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
