'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Leaf, 
  ArrowRight, 
  Layers, 
  Tag, 
  Check, 
  X,
  Zap
} from 'lucide-react';
import { useApp } from '@/lib/store';

const PRESET_DEMOS = [
  {
    id: 'BAKERY',
    label: '🥐 Bakery & Pastry Surplus',
    imageUrl: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Fresh croissants, baguettes, and cinnamon rolls left after 5 PM.',
  },
  {
    id: 'BUFFET',
    label: '🍲 Hotel Hot Buffet Surplus',
    imageUrl: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Banquet trays of grilled tilapia, pilau rice, and roasted vegetables.',
  },
  {
    id: 'GROCERY',
    label: '🥑 Fresh Produce & Deli',
    imageUrl: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Ripe organic avocados, tree tomatoes, artisanal cheese & loaves.',
  },
  {
    id: 'CAFE',
    label: '🥪 Cafe Sandwiches & Drinks',
    imageUrl: 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Smoked chicken focaccias, fruit cups, and iced coffees.',
  },
];

interface AISnapAndListModalProps {
  onApplyToListing: (offerData: any) => void;
}

export function AISnapAndListModal({ onApplyToListing }: AISnapAndListModalProps) {
  const { isSnapListModalOpen, setIsSnapListModalOpen, businesses } = useApp();
  const activeMerchant = businesses[0];

  const [selectedPreset, setSelectedPreset] = useState<string>('BAKERY');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customNotes, setCustomNotes] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);

  if (!isSnapListModalOpen) return null;

  const currentImage = customImage || PRESET_DEMOS.find(p => p.id === selectedPreset)?.imageUrl;

  const handleRunAIScan = async () => {
    setIsScanning(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/ai/vision-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presetType: customImage ? undefined : selectedPreset,
          customDescription: customNotes || undefined,
          imageBase64: customImage || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          // Simulate 1.5s visual scanning delight
          setTimeout(() => {
            setScanResult(data.data);
            setIsScanning(false);
          }, 1200);
          return;
        }
      }
    } catch (e) {
      console.error('Vision scan failed:', e);
    }
    setIsScanning(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result as string);
        setSelectedPreset('CUSTOM');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyToOfferBuilder = () => {
    if (!scanResult) return;
    onApplyToListing({
      title: scanResult.title,
      bagType: scanResult.bagType,
      category: scanResult.category,
      originalPrice: scanResult.originalPrice,
      discountedPrice: scanResult.discountedPrice,
      description: scanResult.description,
      isVegetarian: scanResult.isVegetarian,
      isVegan: scanResult.isVegan,
      isHalal: scanResult.isHalal,
      isGlutenFree: scanResult.isGlutenFree,
      imageUrl: currentImage,
    });
    setIsSnapListModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30">
              <Camera className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-slate-100">AI Vision &ldquo;Snap &amp; List&rdquo;</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Multimodal 2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Snap food photos at closing time. AI detects items, allergens, pricing, and generates instant listings.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSnapListModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Preset Selector or Camera Upload */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            1. Select Surplus Sample or Upload Photo
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_DEMOS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setSelectedPreset(preset.id);
                  setCustomImage(null);
                  setScanResult(null);
                }}
                className={`p-2.5 rounded-2xl border text-left transition text-xs font-semibold cursor-pointer ${
                  selectedPreset === preset.id && !customImage
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="truncate">{preset.label}</div>
              </button>
            ))}
          </div>

          {/* Upload Button */}
          <div className="flex items-center space-x-3">
            <label className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-800/80 border border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl text-xs font-bold text-slate-300 transition cursor-pointer">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Upload Custom Food Photo</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Visual Scanner Area with Neon Laser Scan Effect */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-52 flex items-center justify-center group">
          <img
            src={currentImage}
            alt="Surplus Food Preview"
            className={`w-full h-full object-cover transition duration-500 ${isScanning ? 'brightness-75 blur-[1px]' : ''}`}
          />

          {/* Laser Scanning Animation Overlay */}
          {isScanning && (
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg shadow-emerald-500/80 animate-bounce" />
              <div className="bg-slate-950/70 backdrop-blur-sm p-3 mx-auto rounded-full flex items-center space-x-2 border border-emerald-500/50">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                <span className="text-xs font-black text-emerald-300">
                  AI Analyzing Food Geometry, Ingredients &amp; Freshness...
                </span>
              </div>
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-lg shadow-teal-500/80" />
            </div>
          )}

          {!isScanning && !scanResult && (
            <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] text-slate-300 flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Ready for AI Scan</span>
            </div>
          )}
        </div>

        {/* Scan Action Button */}
        {!scanResult && (
          <button
            onClick={handleRunAIScan}
            disabled={isScanning}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isScanning ? 'Processing AI Vision...' : 'Analyze Food with AI (1-Click)'}</span>
          </button>
        )}

        {/* AI SCAN RESULT REVIEW CARD */}
        {scanResult && (
          <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h4 className="font-extrabold text-slate-100 text-sm">AI Food Recognition Results</h4>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Confidence: {scanResult.aiDemandScore}%
              </span>
            </div>

            {/* Generated Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold">Suggested Title:</span>
                <p className="text-slate-100 font-black text-sm">{scanResult.title}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold">Smart Pricing &amp; Rescue Value:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-black text-emerald-400">
                    {scanResult.discountedPrice.toLocaleString()} RWF
                  </span>
                  <span className="text-slate-500 line-through">
                    {scanResult.originalPrice.toLocaleString()} RWF
                  </span>
                  <span className="bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded-md text-[10px]">
                    70% OFF
                  </span>
                </div>
              </div>
            </div>

            {/* Detected Items Tags */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400">Identified Food Items:</span>
              <div className="flex flex-wrap gap-1.5">
                {scanResult.detectedItems?.map((item: string) => (
                  <span key={item} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold">
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Dietary & Allergen Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {scanResult.isVegetarian && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800/50">
                  🌱 Vegetarian
                </span>
              )}
              {scanResult.isHalal && (
                <span className="px-2 py-0.5 rounded-md bg-teal-950 text-teal-400 text-[10px] font-bold border border-teal-800/50">
                  ☪️ Halal Certified
                </span>
              )}
              {scanResult.isGlutenFree && (
                <span className="px-2 py-0.5 rounded-md bg-amber-950 text-amber-400 text-[10px] font-bold border border-amber-800/50">
                  🌾 Gluten-Free
                </span>
              )}
            </div>

            {/* Rationale Quote */}
            <p className="text-[11px] text-slate-400 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
              💡 {scanResult.aiMarkdownRationale}
            </p>

            {/* Import Button */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setScanResult(null)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Re-Scan
              </button>
              <button
                onClick={handleApplyToOfferBuilder}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <span>Import to Listing Builder</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
