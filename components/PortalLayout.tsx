'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { MobileFrameContainer } from '@/components/MobileFrameContainer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { QRScannerModal } from '@/components/QRScannerModal';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { isCheckoutModalOpen, setIsCheckoutModalOpen, isQRScannerModalOpen, setIsQRScannerModalOpen } = useApp();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header Navbar */}
      <Navbar />

      {/* Main Content Area wrapped in Mobile Emulator Frame when enabled */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MobileFrameContainer
          onOpenCart={() => setIsCheckoutModalOpen(true)}
          onOpenQRScanner={() => setIsQRScannerModalOpen(true)}
        >
          {children}
        </MobileFrameContainer>
      </main>

      {/* Multi-Payment Gateway Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />

      {/* Merchant QR Code Scanner Modal */}
      <QRScannerModal
        isOpen={isQRScannerModalOpen}
        onClose={() => setIsQRScannerModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-300">FreshFind Platform</span>
            <span>•</span>
            <span>Food Rescue Marketplace & Eco Network</span>
          </div>
          <div>
            <span>© 2026 FreshFind Inc. Scalable NestJS & Prisma Architecture.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
