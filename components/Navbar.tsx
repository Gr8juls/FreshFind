'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { 
  ShoppingBag, 
  Leaf, 
  Smartphone, 
  Monitor, 
  Wallet, 
  QrCode,
  Search
} from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenQRScanner: () => void;
}

export function Navbar({ onOpenCart, onOpenQRScanner }: NavbarProps) {
  const { 
    role, setRole, 
    viewFrame, setViewFrame, 
    user, 
    cartOffer, 
    cartQuantity,
    searchQuery, setSearchQuery
  } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Leaf className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-brand-400 bg-clip-text text-transparent">
                FreshFind
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Food Rescue Marketplace
              </span>
            </div>
          </div>

          {/* Search bar (Desktop Customer mode) */}
          {role === 'CUSTOMER' && (
            <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bakeries, cafes, meals, or places near Kigali..."
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          )}

          {/* Controls & Role Selectors */}
          <div className="flex items-center space-x-3">
            
            {/* View Mode Toggle (Desktop vs Mobile Frame) */}
            <div className="hidden lg:flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewFrame('DESKTOP')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  viewFrame === 'DESKTOP' ? 'bg-brand-500 text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Web</span>
              </button>
              <button
                onClick={() => setViewFrame('MOBILE_EMULATOR')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  viewFrame === 'MOBILE_EMULATOR' ? 'bg-brand-500 text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile App</span>
              </button>
            </div>

            {/* Role Switcher */}
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-brand-400 focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="CUSTOMER">Customer View</option>
                <option value="BUSINESS_OWNER">Business Portal</option>
                <option value="ADMIN">Admin Panel</option>
              </select>
            </div>

            {/* Customer Cart & Wallet Controls */}
            {role === 'CUSTOMER' && (
              <>
                <div className="hidden sm:flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300">
                  <Wallet className="w-3.5 h-3.5 text-brand-400" />
                  <span>{user.walletBalance.toLocaleString()} RWF</span>
                </div>

                <button
                  onClick={onOpenCart}
                  className="relative p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition"
                >
                  <ShoppingBag className="w-5 h-5 text-brand-400" />
                  {cartOffer && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {cartQuantity}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Merchant QR Scanner Launcher */}
            {role === 'BUSINESS_OWNER' && (
              <button
                onClick={onOpenQRScanner}
                className="flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-slate-950 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-lg shadow-brand-500/20 transition"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan Customer QR</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
