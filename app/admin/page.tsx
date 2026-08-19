'use client';

import React from 'react';
import { AdminView } from '@/components/AdminView';
import PortalLayout from '@/components/PortalLayout';

export default function AdminPortal() {
  return (
    <PortalLayout>
      <AdminView />
    </PortalLayout>
  );
}
