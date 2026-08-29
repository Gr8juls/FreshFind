'use client';

import React, { useState } from 'react';
import { Search, Sparkles, X, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { useApp } from '@/lib/store';

const QUICK_AI_PROMPTS = [
  { label: '🌱 Vegan Dinner < 5,000 RWF', query: 'vegan dinner under 5000 rwf tonight' },
  { label: '🥐 Fresh Bakery Tomorrow', query: 'bakery breakfast pastries tomorrow' },
  { label: '🔥 Top Flash Deals > 70% Off', query: 'highest discount flash deals' },
  { label: '🏨 Hotel Buffet Feasts', query: 'hotel banquet buffet dinner tonight' },
];

export function AISmartSearchBar() {
  const {
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setFilterDietary,
  } = useApp();

  const [naturalInput, setNaturalInput] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  const handleAISearch = async (queryText: string) => {
    const text = queryText || naturalInput;
    if (!text.trim()) return;

    setIsSearchingAI(true);
    try {
      const res = await fetch('/api/ai/smart-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.filters) {
          const { category, dietary, keywords, explanation } = data.filters;
          if (category) setSelectedCategory(category);
          if (dietary) setFilterDietary(dietary);
          if (keywords !== undefined) setSearchQuery(keywords);
          setAiExplanation(explanation || `AI applied optimal search filters for "${text}"`);
        }
      }
    } catch (err) {
      console.error('AI search failed, falling back to text match:', err);
      setSearchQuery(text);
    } finally {
      setIsSearchingAI(false);
    }
  };

  const handleClearAIFilters = () => {
    setNaturalInput('');
    setSearchQuery('');
    setSelectedCategory('All');
    setFilterDietary({ vegetarian: false, vegan: false, halal: false, glutenFree: false });
    setAiExplanation(null);
  };

  return (
    <div className="space-y-3">
      {/* Search Input Box with Glassmorphism */}
      <div className="relative flex items-center bg-slate-900/90 border border-slate-800 focus-within:border-emerald-500/80 rounded-2xl p-1.5 transition-all shadow-xl shadow-slate-950/50 backdrop-blur-xl">
        <div className="flex items-center justify-center pl-3 pr-2 text-emerald-400">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>

        <input
          type="text"
          value={naturalInput}
          onChange={(e) => setNaturalInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAISearch(naturalInput)}
          placeholder="Ask AI: e.g. 'Cheap halal dinner under 5000 RWF tonight in Nyarutarama'..."
          className="w-full bg-transparent px-2 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none"
        />

        {naturalInput && (
          <button
            onClick={() => setNaturalInput('')}
            className="p-1.5 text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => handleAISearch(naturalInput)}
          disabled={isSearchingAI || !naturalInput.trim()}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs flex items-center space-x-1.5 transition disabled:opacity-50 cursor-pointer shadow-md shadow-emerald-500/20"
        >
          {isSearchingAI ? (
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Thinking...</span>
            </span>
          ) : (
            <>
              <span>Find Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* AI Explanation Banner if active */}
      {aiExplanation && (
        <div className="flex items-center justify-between p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{aiExplanation}</span>
          </div>
          <button
            onClick={handleClearAIFilters}
            className="text-[11px] font-bold text-emerald-400 hover:text-emerald-200 underline ml-2 cursor-pointer"
          >
            Reset
          </button>
        </div>
      )}

      {/* Quick AI Query Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1 shrink-0">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>AI Suggestions:</span>
        </span>
        {QUICK_AI_PROMPTS.map((prompt) => (
          <button
            key={prompt.label}
            onClick={() => {
              setNaturalInput(prompt.query);
              handleAISearch(prompt.query);
            }}
            className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition whitespace-nowrap text-xs font-medium cursor-pointer shadow-sm"
          >
            {prompt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
