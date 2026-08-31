'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { PortalLayout } from '@/components/PortalLayout';
import { EcoPassportCard } from '@/components/EcoPassportCard';
import { 
  User, 
  Wallet, 
  Award, 
  PackageCheck, 
  Bell, 
  CreditCard, 
  Settings, 
  Globe, 
  Moon, 
  Sun, 
  ChevronRight, 
  Plus, 
  ShieldCheck, 
  Sparkles, 
  LogOut,
  Clock,
  MapPin,
  Heart
} from 'lucide-react';

export default function ProfilePage() {
  const { 
    user, 
    orders, 
    favorites, 
    businesses, 
    theme, 
    toggleTheme, 
    language, 
    setLanguage, 
    t, 
    logout,
    addWalletBalance,
    dropSubscriptions
  } = useApp();

  const [activeTab, setActiveTab] = useState<'PASSPORT' | 'ORDERS' | 'ALERTS' | 'PAYMENT' | 'SETTINGS'>('PASSPORT');
  const [topupAmount, setTopupAmount] = useState<number>(5000);
  const [topupSuccess, setTopupSuccess] = useState(false);

  const handleTopup = async () => {
    await addWalletBalance(topupAmount);
    setTopupSuccess(true);
    setTimeout(() => setTopupSuccess(false), 2000);
  };

  return (
    <PortalLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Profile Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user.avatarUrl || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'}
                alt={user.fullName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-slate-950 rounded-full text-[10px] font-black">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{user.fullName}</h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.email} • {user.phone}</p>
              <div className="flex items-center space-x-3 mt-2 text-xs font-bold">
                <span className="text-amber-500 flex items-center space-x-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>{user.badgeTier}</span>
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-600 dark:text-emerald-400">{user.points} Eco Points</span>
              </div>
            </div>
          </div>

          {/* Wallet summary pill */}
          <div className="flex flex-col items-start sm:items-end p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 w-full sm:w-auto">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Eco-Wallet Balance</span>
            <span className="text-2xl font-black text-slate-900 dark:text-emerald-300">{user.walletBalance.toLocaleString()} RWF</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">MTN MoMo Linked</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('PASSPORT')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'PASSPORT'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Eco Passport</span>
          </button>

          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'ORDERS'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Pickups ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ALERTS')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'ALERTS'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Drop Alerts ({dropSubscriptions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('PAYMENT')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'PAYMENT'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Wallet &amp; MoMo</span>
          </button>

          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'SETTINGS'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </button>
        </div>

        {/* Tab 1: Eco Passport */}
        {activeTab === 'PASSPORT' && (
          <div className="space-y-6">
            <EcoPassportCard user={user} />
          </div>
        )}

        {/* Tab 2: Orders & Pickups */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Your Food Rescue Orders</h2>
            {orders.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">No past orders yet. Start exploring surprise bags!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">#{order.orderNumber}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          order.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{order.offerTitle}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{order.businessName} • {order.pickupWindow}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-base font-black text-slate-900 dark:text-slate-100">{order.totalPrice.toLocaleString()} RWF</p>
                      <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500">QR: {order.qrToken}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Drop Alerts */}
        {activeTab === 'ALERTS' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Active Flash Drop Subscriptions</h2>
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                You will receive instant push notifications whenever these stores add new surprise food bags:
              </p>

              {businesses.slice(0, 3).map(b => (
                <div key={b.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={b.logoUrl} alt={b.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{b.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{b.category} • {b.address}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                    🔔 Active Alert
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Wallet & Topup */}
        {activeTab === 'PAYMENT' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Eco-Wallet &amp; Payment Methods</h2>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 gap-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Current Balance</h3>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{user.walletBalance.toLocaleString()} RWF</p>
                </div>

                <div className="flex items-center space-x-2">
                  {[2000, 5000, 10000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setTopupAmount(amt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        topupAmount === amt
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      +{amt.toLocaleString()} RWF
                    </button>
                  ))}
                  <button
                    onClick={handleTopup}
                    className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition cursor-pointer"
                  >
                    {topupSuccess ? 'Topup Done! ✓' : 'Instant Topup'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Linked Payment Accounts</h4>
                
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-500 flex items-center justify-center font-black text-xs">
                      MTN
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">MTN Mobile Money Rwanda</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{user.phone} • Default</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Connected</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center font-black text-xs">
                      AIR
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Airtel Money Rwanda</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">+250 733 444 555</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Backup</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 5: Preferences */}
        {activeTab === 'SETTINGS' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">App Preferences</h2>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
              
              {/* Theme switch */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Display Theme</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Switch between Dark Mode and Light Mode</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center space-x-2 border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                  <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
              </div>

              {/* Language selection */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Language</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Choose your preferred marketplace language</p>
                </div>
                <div className="flex space-x-1.5">
                  {(['EN', 'FR', 'RW'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                        language === lang
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout CTA */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-rose-500">Sign Out</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Sign out of your FreshFind account</p>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer border border-rose-500/30"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
}
