'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { 
  ShieldCheck, 
  Store, 
  Users, 
  TrendingUp, 
  Leaf, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  DollarSign, 
  BarChart2,
  Lock,
  Sliders,
  RefreshCw,
  Eye,
  Trash2,
  Send,
  ShieldAlert,
  CreditCard,
  Clock,
  Activity,
  FileText,
  ArrowUpRight,
  Search,
  PlusCircle,
  Check,
  Ban,
  Phone,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { UserRole } from '@/lib/store';

type AdminTab = 'STORES' | 'USERS' | 'DISPUTES' | 'CATALOG' | 'PAYOUTS' | 'SETTINGS_LOGS';

export function AdminView() {
  const { 
    businesses, 
    offers,
    orders,
    users, 
    disputes, 
    payouts, 
    auditLogs, 
    systemSettings,
    approveBusiness,
    suspendBusiness,
    reactivateBusiness,
    updateBusinessCommission,
    updateUserRole,
    updateUserStatus,
    creditUserWallet,
    resolveDispute,
    deleteOfferByAdmin,
    processMerchantPayout,
    updateSystemSettings,
    user
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('STORES');
  const [storeFilter, setStoreFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'SUSPENDED'>('ALL');
  const [userSearch, setUserSearch] = useState('');
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [disputeNotes, setDisputeNotes] = useState('');
  
  // Wallet credit modal state
  const [creditModalUser, setCreditModalUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [creditAmount, setCreditAmount] = useState<number>(5000);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // ─── Client-side role guard (defence-in-depth after all hooks) ───
  const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <ShieldCheck className="w-16 h-16 text-rose-500/60" />
        <h2 className="text-2xl font-black text-slate-100">Access Denied</h2>
        <p className="text-sm text-slate-400 max-w-xs">
          You do not have permission to view this page. Admin or Super-Admin role required.
        </p>
        <Link href="/" className="mt-2 px-5 py-2.5 bg-brand-500 text-slate-950 rounded-xl font-bold text-sm hover:bg-brand-400 transition">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  // Filtered lists
  const filteredBusinesses = businesses.filter(b => {
    if (storeFilter === 'PENDING') return !b.isVerified || b.status === 'PENDING_APPROVAL';
    if (storeFilter === 'APPROVED') return b.isVerified && b.status !== 'SUSPENDED';
    if (storeFilter === 'SUSPENDED') return b.status === 'SUSPENDED';
    return true;
  });

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.phone.includes(userSearch)
  );

  // Financial aggregates
  const totalGMV = orders.reduce((sum, o) => sum + (o.status === 'PAID' || o.status === 'COMPLETED' ? o.totalPrice : 0), 0) + 18450000;
  const platformRevenue = Math.round(totalGMV * (systemSettings.platformCommissionRate / 100));
  const pendingDisputesCount = disputes.filter(d => d.status === 'OPEN' || d.status === 'UNDER_REVIEW').length;
  const pendingApprovalsCount = businesses.filter(b => !b.isVerified || b.status === 'PENDING_APPROVAL').length;
  const pendingPayoutsCount = payouts.filter(p => p.status === 'PENDING').length;

  return (
    <div className="space-y-8 pb-20 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-brand-500/50 text-brand-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Admin Command Header & Super-Rights Bar */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-start sm:items-center space-x-4 relative z-10">
          <div className="p-3.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">Super-Admin Command Center</h1>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Full Root Authority
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block mr-1" />
                Live System Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Logged in as <strong className="text-slate-200">{user.email}</strong>. Unrestricted access to merchant approvals, RBAC, dispute refunds, payouts, & system configs.
            </p>
          </div>
        </div>

        {/* Impersonation & Quick Context Switchers */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <Link
            href="/business"
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-brand-500/40 text-slate-200 hover:text-brand-300 px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-sm"
          >
            <Store className="w-3.5 h-3.5 text-brand-400" />
            <span>Open Merchant Portal</span>
          </Link>

          <Link
            href="/"
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/40 text-slate-200 hover:text-indigo-300 px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
            <span>View Marketplace</span>
          </Link>
        </div>
      </div>

      {/* Platform Macro Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Gross Merchandise (GMV)</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-400">{(totalGMV / 1000000).toFixed(2)}M RWF</p>
          <span className="text-[10px] text-emerald-400 font-semibold">+18.4% this month</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Platform Net Take ({systemSettings.platformCommissionRate}%)</span>
            <TrendingUp className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-brand-400">{(platformRevenue / 1000000).toFixed(2)}M RWF</p>
          <span className="text-[10px] text-slate-400">Active commission pool</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Total Registered Users</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-indigo-400">{users.length + 14280}</p>
          <span className="text-[10px] text-indigo-300 font-medium">Across Rwanda</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Pending Store Audits</span>
            <Store className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-purple-400">{pendingApprovalsCount} Stores</p>
          <span className="text-[10px] text-amber-400 font-semibold">{pendingApprovalsCount > 0 ? 'Requires review' : 'All clear'}</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Open User Disputes</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-rose-400">{pendingDisputesCount}</p>
          <span className="text-[10px] text-rose-300 font-semibold">{pendingDisputesCount > 0 ? 'Immediate action' : '0 unresolved'}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('STORES')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'STORES' 
              ? 'bg-brand-500 text-slate-950 shadow-lg shadow-brand-500/20' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Merchant Stores ({businesses.length})</span>
          {pendingApprovalsCount > 0 && (
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {pendingApprovalsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('USERS')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'USERS' 
              ? 'bg-brand-500 text-slate-950 shadow-lg shadow-brand-500/20' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User & Access Control ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('DISPUTES')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'DISPUTES' 
              ? 'bg-brand-500 text-slate-950 shadow-lg shadow-brand-500/20' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Dispute Resolution ({disputes.length})</span>
          {pendingDisputesCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
              {pendingDisputesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('CATALOG')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'CATALOG' 
              ? 'bg-brand-500 text-slate-950 shadow-lg shadow-brand-500/20' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Food Catalog & AI Moderation ({offers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('PAYOUTS')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'PAYOUTS' 
              ? 'bg-brand-500 text-slate-950 shadow-lg shadow-brand-500/20' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Merchant Payouts ({payouts.length})</span>
          {pendingPayoutsCount > 0 && (
            <span className="bg-indigo-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {pendingPayoutsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('SETTINGS_LOGS')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'SETTINGS_LOGS' 
              ? 'bg-brand-500 text-slate-950 shadow-lg shadow-brand-500/20' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Settings & Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: MERCHANT STORE GOVERNANCE ================= */}
      {activeTab === 'STORES' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-100">Merchant Store Governance & Verification</h2>
              <p className="text-xs text-slate-400 mt-0.5">Audit merchant licenses, manage store operational status, and configure custom commission rates.</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['ALL', 'PENDING', 'APPROVED', 'SUSPENDED'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setStoreFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    storeFilter === f ? 'bg-brand-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Merchant Profile</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Tax TIN / Phone</th>
                  <th className="p-3.5">Commission Rate</th>
                  <th className="p-3.5">Compliance Status</th>
                  <th className="p-3.5 rounded-r-xl text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredBusinesses.map(business => (
                  <tr key={business.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3.5 flex items-center space-x-3">
                      <img src={business.logoUrl} alt={business.name} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                      <div>
                        <p className="font-bold text-slate-100 text-sm">{business.name}</p>
                        <p className="text-[11px] text-slate-400">{business.address}, {business.district}</p>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="bg-slate-800 text-slate-300 font-semibold px-2.5 py-1 rounded-lg border border-slate-700">
                        {business.category}
                      </span>
                    </td>

                    <td className="p-3.5 space-y-0.5">
                      <p className="font-mono text-slate-300 text-[11px]">{business.tinNumber || 'TIN-NOT-SET'}</p>
                      <p className="text-slate-500 text-[10px]">{business.phone}</p>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={business.commissionRate || 15}
                        onChange={(e) => {
                          updateBusinessCommission(business.id, Number(e.target.value));
                          showToast(`Updated commission for ${business.name} to ${e.target.value}%`);
                        }}
                        className="bg-slate-900 border border-slate-700 text-brand-400 font-bold rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-brand-500"
                      >
                        <option value={10}>10% (Preferred)</option>
                        <option value={12}>12% (Standard)</option>
                        <option value={15}>15% (Default)</option>
                        <option value={20}>20% (Premium Support)</option>
                      </select>
                    </td>

                    <td className="p-3.5">
                      {business.status === 'SUSPENDED' ? (
                        <span className="bg-rose-950/80 text-rose-400 border border-rose-800 font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center w-max space-x-1">
                          <Ban className="w-3 h-3" />
                          <span>Suspended</span>
                        </span>
                      ) : business.isVerified ? (
                        <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center w-max space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approved & Active</span>
                        </span>
                      ) : (
                        <span className="bg-amber-950/80 text-amber-400 border border-amber-800 font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center w-max space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Pending Audit</span>
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right space-x-2">
                      {!business.isVerified || business.status === 'PENDING_APPROVAL' ? (
                        <button
                          onClick={() => {
                            approveBusiness(business.id);
                            showToast(`Approved ${business.name}! Store is now live on marketplace.`);
                          }}
                          className="bg-brand-500 hover:bg-brand-400 text-slate-950 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer shadow-sm"
                        >
                          Approve Store
                        </button>
                      ) : business.status === 'SUSPENDED' ? (
                        <button
                          onClick={() => {
                            reactivateBusiness(business.id);
                            showToast(`Reactivated ${business.name}.`);
                          }}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer"
                        >
                          Reactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            suspendBusiness(business.id);
                            showToast(`Suspended ${business.name}.`);
                          }}
                          className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer"
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: USER & RBAC ACCESS CONTROL ================= */}
      {activeTab === 'USERS' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-100">User Directory & Role-Based Access (RBAC)</h2>
              <p className="text-xs text-slate-400 mt-0.5">Promote users to Administrator, assign Merchant rights, adjust account statuses, and credit Eco-Wallets.</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name, email, phone..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">User Profile</th>
                  <th className="p-3.5">Assigned Role (RBAC)</th>
                  <th className="p-3.5">Account Status</th>
                  <th className="p-3.5">Eco-Wallet Balance</th>
                  <th className="p-3.5">Rescue Activity</th>
                  <th className="p-3.5 rounded-r-xl text-right">Super-Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-100 text-sm">{u.fullName}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{u.phone}</p>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={u.role}
                        onChange={(e) => {
                          updateUserRole(u.id, e.target.value as UserRole);
                          showToast(`Updated role of ${u.fullName} to ${e.target.value}`);
                        }}
                        className="bg-slate-900 border border-slate-700 text-slate-200 font-bold rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-brand-500"
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="BUSINESS_OWNER">Business Owner</option>
                        <option value="BUSINESS_MANAGER">Business Manager</option>
                        <option value="BUSINESS_STAFF">Business Staff</option>
                        <option value="ADMIN">Administrator</option>
                        <option value="SUPER_ADMIN">Super Administrator</option>
                      </select>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={u.status}
                        onChange={(e) => {
                          updateUserStatus(u.id, e.target.value as any);
                          showToast(`Updated status of ${u.fullName} to ${e.target.value}`);
                        }}
                        className={`border font-bold rounded-lg px-2.5 py-1 text-xs focus:outline-none ${
                          u.status === 'ACTIVE' 
                            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400' 
                            : u.status === 'SUSPENDED' 
                            ? 'bg-rose-950/60 border-rose-800 text-rose-400' 
                            : 'bg-amber-950/60 border-amber-800 text-amber-400'
                        }`}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="PENDING_VERIFICATION">Pending Verification</option>
                      </select>
                    </td>

                    <td className="p-3.5">
                      <p className="font-mono font-bold text-brand-400">{u.walletBalance.toLocaleString()} RWF</p>
                    </td>

                    <td className="p-3.5">
                      <p className="font-semibold text-slate-300">{u.totalOrders} Meals Rescued</p>
                      <p className="text-[10px] text-slate-500">Joined {u.createdAt}</p>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setCreditModalUser({ id: u.id, name: u.fullName, email: u.email })}
                        className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center space-x-1 ml-auto"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Credit Wallet</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: DISPUTE RESOLUTION ================= */}
      {activeTab === 'DISPUTES' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-extrabold text-slate-100">Dispute Audit & Customer Refund Desk</h2>
              <p className="text-xs text-slate-400 mt-0.5">Audit customer complaints, review evidence, and issue instant wallet refunds or dispute rejections.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 overflow-x-auto space-y-3">
              {disputes.map(d => (
                <div 
                  key={d.id} 
                  onClick={() => setSelectedDisputeId(d.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-3 ${
                    selectedDisputeId === d.id 
                      ? 'bg-slate-900 border-brand-500/60 shadow-lg' 
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-slate-300">{d.orderNumber}</span>
                      <span className="text-slate-500 text-xs">•</span>
                      <span className="text-xs font-semibold text-slate-200">{d.businessName}</span>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      d.status === 'RESOLVED' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                        : d.status === 'REJECTED' 
                        ? 'bg-slate-800 text-slate-400 border border-slate-700' 
                        : 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse'
                    }`}>
                      {d.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-slate-300 font-medium">{d.reason}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                    <span>Customer: <strong className="text-slate-300">{d.customerName}</strong> ({d.customerEmail})</span>
                    <span className="font-bold text-brand-400 font-mono">{d.amount.toLocaleString()} RWF</span>
                  </div>

                  {d.resolutionNotes && (
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                      <strong className="text-emerald-400">Resolution Log:</strong> {d.resolutionNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Action Panel for Selected Dispute */}
            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>Admin Dispute Decision</span>
              </h3>

              {selectedDisputeId ? (
                (() => {
                  const current = disputes.find(d => d.id === selectedDisputeId);
                  if (!current) return <p className="text-xs text-slate-500">Select a dispute from the queue.</p>;

                  return (
                    <div className="space-y-4">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                        <p className="text-slate-400">Order: <strong className="text-slate-200">{current.orderNumber}</strong></p>
                        <p className="text-slate-400">Disputed Sum: <strong className="text-brand-400 font-mono">{current.amount.toLocaleString()} RWF</strong></p>
                        <p className="text-slate-400">Merchant: <strong className="text-slate-200">{current.businessName}</strong></p>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Resolution Audit Notes:
                        </label>
                        <textarea
                          rows={3}
                          value={disputeNotes}
                          onChange={(e) => setDisputeNotes(e.target.value)}
                          placeholder="State reason for refund approval or dispute denial..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <button
                          disabled={current.status === 'RESOLVED'}
                          onClick={() => {
                            resolveDispute(current.id, 'RESOLVED_REFUND', disputeNotes);
                            showToast(`Approved full refund of ${current.amount.toLocaleString()} RWF for ${current.customerName}!`);
                            setDisputeNotes('');
                          }}
                          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Approve & Issue Full Refund
                        </button>

                        <button
                          disabled={current.status === 'REJECTED'}
                          onClick={() => {
                            resolveDispute(current.id, 'REJECTED', disputeNotes);
                            showToast(`Dispute #${current.orderNumber} rejected.`);
                            setDisputeNotes('');
                          }}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
                        >
                          Reject Dispute
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs">
                  Click any dispute on the left to inspect evidence and execute a decision.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: FOOD CATALOG & AI MODERATION ================= */}
      {activeTab === 'CATALOG' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-extrabold text-slate-100">Live Food Rescue Catalog & AI Moderation</h2>
              <p className="text-xs text-slate-400 mt-0.5">Inspect merchant listings, review AI dynamic markdown suggestions, and takedown non-compliant items.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {offers.map(offer => (
              <div key={offer.id} className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative h-40">
                    <img src={offer.imageUrl} alt={offer.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700 text-[10px] font-bold text-slate-200 flex items-center space-x-1">
                      <Store className="w-3 h-3 text-brand-400" />
                      <span>{offer.businessName}</span>
                    </div>

                    <div className="absolute top-3 right-3 bg-indigo-950/90 border border-indigo-700 px-2.5 py-1 rounded-xl text-[10px] font-bold text-indigo-300 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span>AI Demand: {offer.aiDemandScore}%</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-sm text-slate-100">{offer.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{offer.description}</p>
                    
                    <div className="flex items-center justify-between text-xs pt-2">
                      <div>
                        <span className="font-extrabold text-brand-400 text-sm">{offer.discountedPrice.toLocaleString()} RWF</span>
                        <span className="text-slate-500 line-through ml-2 text-[11px]">{offer.originalPrice.toLocaleString()} RWF</span>
                      </div>
                      <span className="bg-slate-800 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        {offer.quantityAvailable} of {offer.quantityTotal} left
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Pickup: {offer.pickupStart} - {offer.pickupEnd}</span>
                  <button
                    onClick={() => {
                      deleteOfferByAdmin(offer.id);
                      showToast(`Removed offer "${offer.title}" by admin moderation.`);
                    }}
                    className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Takedown</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: MERCHANT PAYOUTS ================= */}
      {activeTab === 'PAYOUTS' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-extrabold text-slate-100">Merchant MoMo & Bank Payout Ledger</h2>
              <p className="text-xs text-slate-400 mt-0.5">Authorize automatic settlement of merchant net earnings after platform commission deduction.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Merchant Partner</th>
                  <th className="p-3.5">Settlement Period</th>
                  <th className="p-3.5">Gross Sales</th>
                  <th className="p-3.5">Platform Cut</th>
                  <th className="p-3.5">Net Payout</th>
                  <th className="p-3.5">Payout Method</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {payouts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-100 text-sm">{p.businessName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{p.payoutPhone}</p>
                    </td>

                    <td className="p-3.5 text-slate-300 font-medium">
                      {p.period}
                    </td>

                    <td className="p-3.5 font-mono text-slate-300">
                      {p.grossSales.toLocaleString()} RWF
                    </td>

                    <td className="p-3.5 font-mono text-rose-400">
                      -{p.commissionAmount.toLocaleString()} RWF
                    </td>

                    <td className="p-3.5 font-mono font-bold text-brand-400 text-sm">
                      {p.netPayout.toLocaleString()} RWF
                    </td>

                    <td className="p-3.5">
                      <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded-md text-[10px] font-bold">
                        {p.paymentMethod}
                      </span>
                    </td>

                    <td className="p-3.5">
                      {p.status === 'PROCESSED' ? (
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                          Paid • {p.transactionRef}
                        </span>
                      ) : (
                        <span className="bg-amber-950 text-amber-400 border border-amber-800 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                          Pending Approval
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right">
                      {p.status === 'PENDING' ? (
                        <button
                          onClick={() => {
                            processMerchantPayout(p.id);
                            showToast(`Processed payout of ${p.netPayout.toLocaleString()} RWF to ${p.businessName}!`);
                          }}
                          className="bg-brand-500 hover:bg-brand-400 text-slate-950 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer"
                        >
                          Execute MoMo Payout
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-medium">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 6: SETTINGS & AUDIT TRAIL ================= */}
      {activeTab === 'SETTINGS_LOGS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Global System Settings */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
            <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-brand-400" />
              <span>Platform Global Settings</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Default Platform Commission (%):
                </label>
                <input
                  type="number"
                  min={5}
                  max={30}
                  value={systemSettings.platformCommissionRate}
                  onChange={(e) => updateSystemSettings({ platformCommissionRate: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Cart Reservation Lock Timer (minutes):
                </label>
                <input
                  type="number"
                  min={5}
                  max={60}
                  value={systemSettings.reservationHoldMinutes}
                  onChange={(e) => updateSystemSettings({ reservationHoldMinutes: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Auto-Approve Verified Stores</span>
                  <input
                    type="checkbox"
                    checked={systemSettings.autoApproveVerifiedMerchants}
                    onChange={(e) => updateSystemSettings({ autoApproveVerifiedMerchants: e.target.checked })}
                    className="w-4 h-4 accent-brand-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">SMS / WhatsApp Push Notifications</span>
                  <input
                    type="checkbox"
                    checked={systemSettings.smsNotificationsEnabled}
                    onChange={(e) => updateSystemSettings({ smsNotificationsEnabled: e.target.checked })}
                    className="w-4 h-4 accent-brand-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-rose-400 font-semibold">Emergency Maintenance Mode</span>
                  <input
                    type="checkbox"
                    checked={systemSettings.maintenanceMode}
                    onChange={(e) => updateSystemSettings({ maintenanceMode: e.target.checked })}
                    className="w-4 h-4 accent-rose-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Audit Trail */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                <span>Live Administrative Audit Trail</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Immutable System Logs</span>
            </div>

            <div className="overflow-y-auto max-h-96 space-y-2.5 pr-2">
              {auditLogs.map(log => (
                <div key={log.id} className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        log.severity === 'CRITICAL' 
                          ? 'bg-rose-950 text-rose-400 border border-rose-800' 
                          : log.severity === 'WARNING' 
                          ? 'bg-amber-950 text-amber-400 border border-amber-800' 
                          : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                      }`}>
                        {log.type}
                      </span>
                      <span className="font-mono text-slate-200 font-bold">{log.action}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">Target: <strong className="text-slate-300">{log.target}</strong> by {log.actor}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Credit Wallet Modal */}
      {creditModalUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-brand-400" />
              <span>Credit User Eco-Wallet</span>
            </h3>
            
            <p className="text-xs text-slate-400">
              Inject promotional credits or dispute compensation directly into <strong className="text-slate-200">{creditModalUser.name}</strong> ({creditModalUser.email}).
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Credit Amount (RWF):</label>
              <input
                type="number"
                step={1000}
                value={creditAmount}
                onChange={(e) => setCreditAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-brand-400 font-mono font-bold focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setCreditModalUser(null)}
                className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  creditUserWallet(creditModalUser.id, creditAmount);
                  showToast(`Successfully credited ${creditAmount.toLocaleString()} RWF to ${creditModalUser.name}!`);
                  setCreditModalUser(null);
                }}
                className="w-1/2 bg-brand-500 hover:bg-brand-400 text-slate-950 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Confirm Credit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
