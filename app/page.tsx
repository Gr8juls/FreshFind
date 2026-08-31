'use client';

import React, { useState } from 'react';
import { Offer } from '@/lib/mockData';
import { CustomerView } from '@/components/CustomerView';
import { OfferDetailModal } from '@/components/OfferDetailModal';
import PortalLayout from '@/components/PortalLayout';
import { useApp } from '@/lib/store';

export default function CustomerPortal() {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const { setIsCheckoutModalOpen } = useApp();

  return (
    <PortalLayout>
      <CustomerView
        onSelectOffer={(offer) => setSelectedOffer(offer)}
      />

      <OfferDetailModal
        offer={selectedOffer}
        onClose={() => setSelectedOffer(null)}
        onProceedToCheckout={() => {
          setSelectedOffer(null);
          setIsCheckoutModalOpen(true);
        }}
      />
    </PortalLayout>
  );
}
