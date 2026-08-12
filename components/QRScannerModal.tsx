'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Order } from '@/lib/mockData';
import { QrCode, X, CheckCircle2, AlertCircle, Sparkles, Camera, ShieldCheck } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRScannerModal({ isOpen, onClose }: QRScannerModalProps) {
  const { verifyAndCollectQR, orders } = useApp();
  const [qrInput, setQrInput] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string; order?: Order } | null>(null);

  if (!isOpen) return null;

  const handleVerify = (tokenToVerify?: string) => {
    const target = tokenToVerify || qrInput;
    if (!target.trim()) return;
    
    const res = verifyAndCollectQR(target);
    setResult(res);
  };

  const sampleQROrder = orders.find(o => o.status === 'PAID');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-brand-400" />
            <h3 className="text-lg font-bold text-slate-100">Merchant QR Scanner</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Simulated Camera Viewfinder */}
          <div className="relative h-52 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center text-center p-4">
            
            {/* Animated Scanning Line */}
            <div className="absolute inset-x-8 top-1/2 h-0.5 bg-brand-500 shadow-[0_0_15px_#10B981] animate-pulse" />
            
            <Camera className="w-8 h-8 text-slate-600 mb-2 animate-bounce" />
            <p className="text-xs text-slate-400 max-w-xs">
              Point merchant camera at customer order QR code to instantly verify & complete order.
            </p>

            {/* Quick Test Shortcut if paid orders exist */}
            {sampleQROrder && (
              <button
                onClick={() => {
                  setQrInput(sampleQROrder.qrToken);
                  handleVerify(sampleQROrder.qrToken);
                }}
                className="mt-3 text-[11px] font-bold text-brand-400 bg-brand-950/80 border border-brand-800/80 px-3 py-1 rounded-lg hover:bg-brand-900 transition"
              >
                ⚡ Auto-Scan Demo QR (#{sampleQROrder.orderNumber})
              </button>
            )}
          </div>

          {/* Verification Result Banner */}
          {result && (
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
              result.success 
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
                : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
            }`}>
              <div className="flex items-center space-x-2 font-bold text-sm">
                {result.success ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
                <span>{result.success ? 'Verification Successful!' : 'Scan Error'}</span>
              </div>
              <p>{result.message}</p>
              
              {result.order && (
                <div className="mt-2 pt-2 border-t border-emerald-800/60 text-[11px] text-emerald-200 space-y-1">
                  <div className="flex justify-between">
                    <span>Order Item:</span>
                    <span className="font-bold">{result.order.offerTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Qty:</span>
                    <span className="font-bold">{result.order.quantity} package(s)</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Manual Input Fallback */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Or Enter QR Code Token Manually</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                placeholder="e.g. QR-FF-901-KIGALI-BAKERY"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-brand-500"
              />
              <button
                onClick={() => handleVerify()}
                className="bg-brand-500 hover:bg-brand-400 text-slate-950 px-4 py-2 rounded-xl font-bold text-xs shadow-lg shadow-brand-500/20 transition"
              >
                Verify Code
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
