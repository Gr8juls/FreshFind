'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LogoConceptA, LogoConceptB, FreshFindWordmark } from '@/components/BrandLogos';
import { ArrowLeft, Check, Sparkles, Moon, Sun, ShoppingBag, Smartphone } from 'lucide-react';

export default function LogoPreviewPage() {
  const [selectedConcept, setSelectedConcept] = useState<'A' | 'B'>('A');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');

  return (
    <div className={`min-h-screen transition-colors duration-300 ${previewTheme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Header Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 backdrop-blur-md bg-white/70 dark:bg-slate-950/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-emerald-500 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to App
          </Link>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <h1 className="text-lg font-bold">Brand Identity Laboratory & Logo Comparison</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewTheme(t => t === 'dark' ? 'light' : 'dark')}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            {previewTheme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            {previewTheme === 'dark' ? 'Test Light Mode' : 'Test Dark Mode'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        
        {/* Intro Banner */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Handcrafted Vectors • Zero Generic AI Clipart
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Two Authentic Directions for FreshFind
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Built to pass the <strong>Kraft Bag Test</strong>, <strong>App Icon Test</strong>, and <strong>16px Favicon Test</strong>. Compare the two bespoke directions below.
          </p>
        </div>

        {/* Concept Cards Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Concept A Card */}
          <div 
            onClick={() => setSelectedConcept('A')}
            className={`cursor-pointer rounded-2xl border-2 p-8 transition-all relative ${
              selectedConcept === 'A' 
                ? 'border-emerald-500 bg-emerald-500/5 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500' 
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50'
            }`}
          >
            {selectedConcept === 'A' && (
              <span className="absolute top-4 right-4 bg-emerald-500 text-slate-950 text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> Selected
              </span>
            )}
            <div className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase mb-2">
              Direction 1 • Swiss Modernist
            </div>
            <h3 className="text-2xl font-black mb-2">The "Discovery Monogram" (FF + Rescue Tote)</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              A disciplined, geometric mark combining an interlocking double-F monogram with the contour of a carryout food bag and a pinpoint discovery seed. Inspired by high-trust tech brands like <strong>Wise</strong>, <strong>Deliveroo</strong>, and <strong>Linear</strong>.
            </p>

            {/* Showcase Stage */}
            <div className="bg-slate-100 dark:bg-slate-950 rounded-xl p-8 flex flex-col items-center justify-center gap-6 border border-slate-200 dark:border-slate-800 min-h-[220px]">
              <LogoConceptA className="w-24 h-24" />
              <FreshFindWordmark concept="A" />
            </div>

            {/* Strengths */}
            <div className="mt-6 space-y-2">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">Design Strengths:</div>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
                <li>Instant visual clarity at small sizes (e.g. mobile headers & favicon)</li>
                <li>Looks authoritative and institutional — builds high consumer payment trust</li>
                <li>Monogram is easy to embroider on merchant aprons and courier uniforms</li>
              </ul>
            </div>
          </div>

          {/* Concept B Card */}
          <div 
            onClick={() => setSelectedConcept('B')}
            className={`cursor-pointer rounded-2xl border-2 p-8 transition-all relative ${
              selectedConcept === 'B' 
                ? 'border-amber-500 bg-amber-500/5 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500' 
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50'
            }`}
          >
            {selectedConcept === 'B' && (
              <span className="absolute top-4 right-4 bg-amber-500 text-slate-950 text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> Selected
              </span>
            )}
            <div className="text-xs font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase mb-2">
              Direction 2 • Kigali Roots & Artisanal
            </div>
            <h3 className="text-2xl font-black mb-2">The "Kigali Dawn & Bowl" (Terraced Hills & Morning Bake)</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              Rooted in Rwanda’s <em>"Land of a Thousand Hills"</em> and the warmth of morning bakery ovens. Two sweeping terraced lines form both rolling green hills and an artisanal bowl, with a warm amber morning sun rising behind.
            </p>

            {/* Showcase Stage */}
            <div className="bg-slate-100 dark:bg-slate-950 rounded-xl p-8 flex flex-col items-center justify-center gap-6 border border-slate-200 dark:border-slate-800 min-h-[220px]">
              <LogoConceptB className="w-24 h-24" />
              <FreshFindWordmark concept="B" />
            </div>

            {/* Strengths */}
            <div className="mt-6 space-y-2">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">Design Strengths:</div>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
                <li>Deeply authentic local story that connects directly with Kigali cafe culture</li>
                <li>Warm and appetizing — golden amber triggers hunger and bakery freshness</li>
                <li>Feels community-first, artisanal, and environmentally celebratory</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Real-World Stress Tests Section */}
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-2xl font-bold tracking-tight">Real-World Application Tests</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            How currently selected <strong>Concept {selectedConcept}</strong> performs under real physical & digital constraints:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Test 1: Kraft Paper Bag Stamping */}
            <div className="rounded-2xl bg-[#D2B48C]/20 border border-[#bfa27d]/40 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-[#795548] flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5" /> Kraft Paper Bag (1-Color Stamp)
              </div>
              <div className="mt-8 mb-4 p-6 bg-[#C4A47C]/40 rounded-xl border border-[#9b7e5a]/30 shadow-inner flex flex-col items-center">
                {selectedConcept === 'A' ? (
                  <LogoConceptA className="w-16 h-16 text-[#3E2723]" variant="monochrome" />
                ) : (
                  <LogoConceptB className="w-16 h-16 text-[#3E2723]" variant="monochrome" />
                )}
                <span className="text-sm font-black tracking-wider text-[#3E2723] uppercase mt-2">
                  FRESHFIND
                </span>
                <span className="text-[9px] font-bold text-[#5D4037] tracking-widest uppercase">
                  Kigali Surplus Rescue
                </span>
              </div>
              <p className="text-xs text-[#5D4037]">
                Clear silhouette, zero fine detail loss when stamped with single ink.
              </p>
            </div>

            {/* Test 2: Mobile App Icon */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center justify-center text-center">
              <div className="self-start text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-4">
                <Smartphone className="w-3.5 h-3.5" /> Mobile App Icon (60px)
              </div>
              <div className="w-20 h-20 rounded-[22px] bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center mb-3">
                {selectedConcept === 'A' ? (
                  <LogoConceptA className="w-12 h-12" />
                ) : (
                  <LogoConceptB className="w-12 h-12" />
                )}
              </div>
              <span className="text-xs font-semibold text-slate-300">FreshFind</span>
              <p className="text-xs text-slate-500 mt-2">
                High glanceability on iOS & Android home screens.
              </p>
            </div>

            {/* Test 3: Micro Favicon Test (16px & 32px) */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900/40">
              <div className="self-start text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                Micro Scale Test (Browser Tab)
              </div>
              <div className="flex items-center justify-center gap-6 my-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-300 dark:border-slate-700">
                    {selectedConcept === 'A' ? (
                      <LogoConceptA className="w-5 h-5" />
                    ) : (
                      <LogoConceptB className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">32×32px</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-300 dark:border-slate-700">
                    {selectedConcept === 'A' ? (
                      <LogoConceptA className="w-4 h-4" />
                    ) : (
                      <LogoConceptB className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">16×16px</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Readable at micro resolution without turning into an unreadable smudge.
              </p>
            </div>

          </div>
        </div>

        {/* Integration Call to action */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold">Ready to apply your favorite mark across the app?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              We can update the Navbar, mobile navigation header, PWA manifest, and checkout seals immediately.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => alert(`Concept ${selectedConcept} chosen! Let Antigravity know in chat to wire it everywhere.`)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
            >
              Choose Concept {selectedConcept}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
