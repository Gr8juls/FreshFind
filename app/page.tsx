'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Offer } from '@/lib/mockData';
import { Navbar } from '@/components/Navbar';
import { CustomerView } from '@/components/CustomerView';
import { BusinessView } from '@/components/BusinessView';
import { AdminView } from '@/components/AdminView';
import { OfferDetailModal } from '@/components/OfferDetailModal';
import { CheckoutModal } from '@/components/CheckoutModal';
import { QRScannerModal } from '@/components/QRScannerModal';
import { MobileFrameContainer } from '@/components/MobileFrameContainer';

export default function Home() {
  const { role } = useApp();

  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header Navbar */}
      <Navbar
        onOpenCart={() => setIsCheckoutOpen(true)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
      />

      {/* Main Content Area wrapped in Mobile Emulator Frame when enabled */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MobileFrameContainer
          onOpenCart={() => setIsCheckoutOpen(true)}
          onOpenQRScanner={() => setIsQRScannerOpen(true)}
        >
          {role === 'CUSTOMER' && (
            <CustomerView
              onSelectOffer={(offer) => setSelectedOffer(offer)}
            />
          )}

          {role === 'BUSINESS_OWNER' && (
            <BusinessView
              onOpenQRScanner={() => setIsQRScannerOpen(true)}
            />
          )}

          {role === 'ADMIN' && (
            <AdminView />
          )}
        </MobileFrameContainer>
      </main>

      {/* Offer Detail Reservation Modal */}
      <OfferDetailModal
        offer={selectedOffer}
        onClose={() => setSelectedOffer(null)}
        onProceedToCheckout={() => {
          setSelectedOffer(null);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Multi-Payment Gateway Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Merchant QR Code Scanner Modal */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-xs text-slate-500">
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
