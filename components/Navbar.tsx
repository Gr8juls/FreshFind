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
  ShieldCheck,
  Store,
  Sun,
  Moon,
  MapPin,
  Globe
} from 'lucide-react';
import { Language } from '@/lib/translations';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { 
    theme, toggleTheme,
    language, setLanguage, t,
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
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Platform Name */}
          <Link href="/" className="flex items-center space-x-2.5 cursor-pointer shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-emerald-400 flex items-center justify-center shadow-md shadow-brand-500/20">
              <Leaf className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-brand-600 dark:from-white dark:via-slate-200 dark:to-brand-400 bg-clip-text text-transparent">
                FreshFind
              </span>
              <span className="hidden lg:inline-block ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                {t.nav.brandSubtitle}
              </span>
            </div>
          </Link>

          {/* Integrated Search Bar (Customer Mode) */}
          {activeRole === 'CUSTOMER' && (
            <div className="hidden md:flex flex-1 max-w-md relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.nav.searchPlaceholder}
                className="w-full bg-slate-100/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Location & Impact Quick Badge */}
          {activeRole === 'CUSTOMER' && (
            <div className="hidden xl:flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/90 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800">
                <MapPin className="w-3.5 h-3.5 text-brand-500" />
                <span>{t.nav.location}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-500/30">
                <Leaf className="w-3.5 h-3.5" />
                <span>{user.mealsRescued || 18} {t.nav.savedMeals} • {user.co2SavedKg || 45}kg CO₂</span>
              </div>
            </div>
          )}

          {/* Controls & User Session */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* Language Switcher Pill */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-extrabold">
              <Globe className="w-3.5 h-3.5 ml-1.5 mr-1 text-emerald-600 dark:text-emerald-400 hidden sm:inline" />
              {(['EN', 'FR', 'RW'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                    language === lang 
                      ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                  title={lang === 'EN' ? 'English' : lang === 'FR' ? 'Français' : 'Ikinyarwanda'}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Theme Toggle (Dark / Light Mode) */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-700 transition cursor-pointer shadow-sm"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 -rotate-12 hover:rotate-0" />
              )}
            </button>

            {/* View Mode Toggle (Desktop vs Mobile Frame) */}
            <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setViewFrame('DESKTOP')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  viewFrame === 'DESKTOP' 
                    ? 'bg-brand-500 text-slate-950 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>{t.nav.web}</span>
              </button>
              <button
                onClick={() => setViewFrame('MOBILE_EMULATOR')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  viewFrame === 'MOBILE_EMULATOR' 
                    ? 'bg-brand-500 text-slate-950 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{t.nav.mobile}</span>
              </button>
            </div>

            {/* Merchant Quick Portal Link */}
            {isAuthenticated && (user.role === 'BUSINESS_OWNER' || user.role === 'ADMIN') && !pathname.startsWith('/business') && (
              <Link
                href="/business"
                className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-brand-500/30 text-brand-600 dark:text-brand-400 px-2.5 py-1.5 rounded-xl text-xs font-bold transition"
              >
                <Store className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.nav.merchantPortal}</span>
              </Link>
            )}

            {/* Admin Quick Link */}
            {isAuthenticated && user.role === 'ADMIN' && !pathname.startsWith('/admin') && (
              <Link
                href="/admin"
                className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-purple-500/30 text-purple-600 dark:text-purple-400 px-2.5 py-1.5 rounded-xl text-xs font-bold transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.nav.adminPanel}</span>
              </Link>
            )}

            {/* Customer Cart & Wallet Controls */}
            {activeRole === 'CUSTOMER' && (
              <>
                <div className="hidden sm:flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Wallet className="w-3.5 h-3.5 text-brand-500" />
                  <span>{user.walletBalance?.toLocaleString() || 0} RWF</span>
                </div>

                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  aria-label="View Cart"
                  className="relative p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-slate-800 dark:text-brand-400" />
                  {cartOffer && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center shadow-md animate-pulse">
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
                className="flex items-center space-x-1.5 bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-slate-950 px-3 py-1.5 rounded-xl font-black text-xs shadow-md shadow-brand-500/20 transition cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan QR</span>
              </button>
            )}

            {/* Authentication & Profile Link */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer group"
                >
                  <img
                    src={user.avatarUrl || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-xl object-cover border border-emerald-500/50 group-hover:border-emerald-500"
                  />
                  <div className="hidden sm:flex flex-col items-start leading-tight">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-500 transition-colors">{user.fullName || user.email}</span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {user.role === 'BUSINESS_OWNER' ? t.nav.merchantRole : user.role === 'ADMIN' ? t.nav.adminRole : t.nav.shopperRole}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  title={t.nav.signOut}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <Link
                  href="/login"
                  className="flex items-center space-x-1.5 bg-brand-500 hover:bg-brand-400 text-slate-950 px-3.5 py-1.5 rounded-xl font-extrabold text-xs shadow-md shadow-brand-500/20 transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t.nav.signIn}</span>
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
