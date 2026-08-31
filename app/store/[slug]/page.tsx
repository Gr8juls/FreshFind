import React from 'react';
import { PortalLayout } from '@/components/PortalLayout';
import { StoreProfilePage } from '@/components/StoreProfilePage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function StorePage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <PortalLayout>
      <StoreProfilePage slug={slug} />
    </PortalLayout>
  );
}
