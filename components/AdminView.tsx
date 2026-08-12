'use client';

import React from 'react';
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
  Lock
} from 'lucide-react';

export function AdminView() {
  const { businesses, approveBusiness, user } = useApp();

  return (
    <div className="space-y-8 pb-16">
      
      {/* Admin Command Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100">FreshFind Platform Super-Admin</h1>
              <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                System Command Center
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Platform verification, analytics, merchant auditing, and compliance.</p>
          </div>
        </div>
      </div>

      {/* Platform Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Registered Users</span>
          <p className="text-2xl font-black text-brand-400">14,280 Users</p>
          <span className="text-[10px] text-emerald-400 font-semibold">+1,240 this week</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Active Food Merchants</span>
          <p className="text-2xl font-black text-indigo-400">{businesses.length} Verified Stores</p>
          <span className="text-[10px] text-slate-400">Kigali & Musanze Regions</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Platform GMV Revenue</span>
          <p className="text-2xl font-black text-amber-400">18.4M RWF</p>
          <span className="text-[10px] text-slate-400">15% platform commission</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Platform CO₂ Saved</span>
          <p className="text-2xl font-black text-emerald-400">14.8 Tons</p>
          <span className="text-[10px] text-slate-400">5,920 meals rescued</span>
        </div>
      </div>

      {/* Merchant Approval & Verification Queue */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Merchant Store Verification Queue</h3>
            <p className="text-xs text-slate-400">Review health department permits & verify store legitimacy before public offer listing.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Business Profile</th>
                <th className="p-3">Category</th>
                <th className="p-3">Location</th>
                <th className="p-3">Verification Status</th>
                <th className="p-3 rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {businesses.map(business => (
                <tr key={business.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 flex items-center space-x-3">
                    <img src={business.logoUrl} className="w-9 h-9 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-slate-100">{business.name}</p>
                      <p className="text-[10px] text-slate-400">{business.phone}</p>
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-slate-300">{business.category}</td>
                  <td className="p-3 text-slate-300">{business.address}</td>
                  <td className="p-3">
                    {business.isVerified ? (
                      <span className="bg-emerald-950 text-emerald-400 font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center w-max space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified & Approved</span>
                      </span>
                    ) : (
                      <span className="bg-amber-950 text-amber-400 font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center w-max space-x-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Pending Approval</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {!business.isVerified ? (
                      <button
                        onClick={() => approveBusiness(business.id)}
                        className="bg-brand-500 hover:bg-brand-400 text-slate-950 px-3 py-1.5 rounded-xl font-bold transition"
                      >
                        Approve Store
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-medium">Approved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
