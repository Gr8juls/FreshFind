'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { 
  Home, 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Wifi, 
  Battery, 
  Signal, 
  QrCode,
  Leaf
} from 'lucide-react';

interface MobileFrameContainerProps {
  children: React.ReactNode;
  onOpenCart: () => void;
  onOpenQRScanner: () => void;
}

export function MobileFrameContainer({ children, onOpenCart, onOpenQRScanner }: MobileFrameContainerProps) {
  const { viewFrame, role, user, cartOffer, cartQuantity } = useApp();

  if (viewFrame !== 'MOBILE_EMULATOR') {
    return <>{children}</>;
  }

  return (
    <div className="py-8 flex justify-center items-center min-h-[85vh] bg-slate-950">
      
      {/* Mobile Device Frame Container */}
      <div className="relative w-full max-w-[400px] h-[830px] bg-slate-900 rounded-[50px] border-[10px] border-slate-800 shadow-2xl shadow-brand-500/10 overflow-hidden flex flex-col">
        
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 z-50 flex items-center justify-between px-6 pt-2">
          <span className="text-[10px] font-mono font-bold text-slate-300">09:41</span>
          <div className="w-20 h-4 bg-black rounded-full flex items-center justify-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-slate-800" />
            <div className="w-2 h-2 rounded-full bg-brand-500/40" />
          </div>
          <div className="flex items-center space-x-1 text-slate-300">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3 h-3" />
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 pt-8 pb-16 overflow-y-auto px-4 scrollbar-none bg-slate-900 text-slate-100">
          {children}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 z-40 flex items-center justify-around px-2">
          
          <button className="flex flex-col items-center justify-center space-y-0.5 text-brand-400">
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-bold">Home</span>
          </button>

          <button className="flex flex-col items-center justify-center space-y-0.5 text-slate-400 hover:text-slate-200">
            <Search className="w-5 h-5" />
            <span className="text-[9px] font-medium">Explore</span>
          </button>

          {role === 'BUSINESS_OWNER' ? (
            <button
              onClick={onOpenQRScanner}
              className="w-10 h-10 rounded-full bg-brand-500 text-slate-950 flex items-center justify-center shadow-lg shadow-brand-500/30 transform -translate-y-2"
            >
              <QrCode className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onOpenCart}
              className="relative w-10 h-10 rounded-full bg-brand-500 text-slate-950 flex items-center justify-center shadow-lg shadow-brand-500/30 transform -translate-y-2"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartOffer && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-950 text-brand-400 text-[9px] font-bold rounded-full flex items-center justify-center border border-brand-500">
                  {cartQuantity}
                </span>
              )}
            </button>
          )}

          <button className="flex flex-col items-center justify-center space-y-0.5 text-slate-400 hover:text-slate-200">
            <Heart className="w-5 h-5" />
            <span className="text-[9px] font-medium">Saved</span>
          </button>

          <button className="flex flex-col items-center justify-center space-y-0.5 text-slate-400 hover:text-slate-200">
            <User className="w-5 h-5" />
            <span className="text-[9px] font-medium">Profile</span>
          </button>

        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-700 rounded-full z-50" />

      </div>

    </div>
  );
}
