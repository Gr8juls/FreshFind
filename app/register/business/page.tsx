import React from 'react';
import { PortalLayout } from '@/components/PortalLayout';
import { MerchantOnboardingWizard } from '@/components/MerchantOnboardingWizard';

export default function BusinessRegisterPage() {
  return (
    <PortalLayout>
      <MerchantOnboardingWizard />
    </PortalLayout>
  );
}
