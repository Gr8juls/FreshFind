'use client';

import React from 'react';
import { BusinessView } from '@/components/BusinessView';
import PortalLayout from '@/components/PortalLayout';
import { useApp } from '@/lib/store';

export default function BusinessPortal() {
  const { setIsQRScannerModalOpen } = useApp();

  return (
    <PortalLayout>
      <BusinessView
        onOpenQRScanner={() => setIsQRScannerModalOpen(true)}
      />
    </PortalLayout>
  );
}
