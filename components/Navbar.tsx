'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';
import { 
  ShoppingBag, 
  Leaf, 
  Smartphone, 
  Monitor, 
  Wallet, 
  QrCode,
  Search,
  LogOut,
  LogIn,
  User,
  ShieldCheck,
  Store
} from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { 
    viewFrame, setViewFrame, 
    user, 
    isAuthenticated,
    logout,
    cartOffer, 
    cartQuantity,
    searchQuery, setSearchQuery,
    setIsCheckoutModalOpen,
    setIsQRScannerModalOpen
  } = useApp();

  let activeRole = user.role || 'CUSTOMER';
  if (pathname.includes('/business')) activeRole = 'BUSINESS_OWNER';
  if (pathname.includes('/admin')) activeRole = 'ADMIN';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <Link href="/" className="flex items-center space-x-3 cursor-pointer">
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
          </Link>

          {/* Search bar (Desktop Customer mode) */}
          {activeRole === 'CUSTOMER' && (
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

          {/* Controls & User Session */}
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

            {/* Merchant Quick Portal Link if Business Owner or Admin */}
            {isAuthenticated && (user.role === 'BUSINESS_OWNER' || user.role === 'ADMIN') && !pathname.startsWith('/business') && (
              <Link
                href="/business"
                className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-brand-500/30 text-brand-400 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Business Portal</span>
              </Link>
            )}

            {/* Admin Quick Link if Admin */}
            {isAuthenticated && user.role === 'ADMIN' && !pathname.startsWith('/admin') && (
              <Link
                href="/admin"
                className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-purple-500/30 text-purple-400 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Customer Cart & Wallet Controls */}
            {activeRole === 'CUSTOMER' && (
              <>
                <div className="hidden sm:flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300">
                  <Wallet className="w-3.5 h-3.5 text-brand-400" />
                  <span>{user.walletBalance.toLocaleString()} RWF</span>
                </div>

                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
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
            {activeRole === 'BUSINESS_OWNER' && (
              <button
                onClick={() => setIsQRScannerModalOpen(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-slate-950 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-lg shadow-brand-500/20 transition"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan Customer QR</span>
              </button>
            )}

            {/* Authentication Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-200">{user.fullName || user.email}</span>
                  <span className="text-[10px] font-medium text-brand-400">
                    {user.role === 'BUSINESS_OWNER' ? 'Merchant' : user.role === 'ADMIN' ? 'Admin' : 'Customer'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <Link
                  href="/login"
                  className="flex items-center space-x-1.5 bg-brand-500 hover:bg-brand-400 text-slate-950 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-lg shadow-brand-500/20 transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
