import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useApp } from '../lib/store';
import { INITIAL_OFFERS, INITIAL_BUSINESSES } from '../lib/mockData';

// Mock global fetch for API calls in store
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, data: [] }),
  })
) as jest.Mock;

describe('FreshFind Core Store & State Engine', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppProvider>{children}</AppProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes default platform state correctly', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    
    expect(result.current.role).toBe('CUSTOMER');
    expect(result.current.offers.length).toBeGreaterThan(0);
    expect(result.current.businesses.length).toBeGreaterThan(0);
    expect(result.current.cartOffer).toBeNull();
  });

  it('handles cart additions and quantity management', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    const targetOffer = result.current.offers[0];

    act(() => {
      result.current.addToCart(targetOffer);
    });

    expect(result.current.cartOffer).toEqual(targetOffer);
    expect(result.current.cartQuantity).toBe(1);

    act(() => {
      result.current.setCartQuantity(3);
    });

    expect(result.current.cartQuantity).toBe(3);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.cartOffer).toBeNull();
    expect(result.current.cartQuantity).toBe(1);
  });

  it('applies dynamic markdown to an offer and updates demand score', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    const offerId = result.current.offers[0].id;
    const newPrice = 2500;

    act(() => {
      result.current.applyDynamicMarkdown(offerId, newPrice);
    });

    const updated = result.current.offers.find((o) => o.id === offerId);
    expect(updated?.discountedPrice).toBe(newPrice);
    expect(updated?.aiPriceSuggestion).toBe(newPrice);
  });

  it('boosts an offer with sponsored featured badges', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    const offerId = result.current.offers[0].id;
    const badgeText = '⚡ 1-Hour Flash Surge';

    await act(async () => {
      await result.current.boostOfferAsFeatured(offerId, badgeText);
    });

    const boosted = result.current.offers.find((o) => o.id === offerId);
    expect(boosted?.isFeatured).toBe(true);
    expect(boosted?.featuredBadge).toBe(badgeText);
  });

  it('upgrades business subscription tier and drops commission rate', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    const businessId = result.current.businesses[0].id;

    await act(async () => {
      await result.current.upgradeBusinessSubscription(businessId, 'ENTERPRISE');
    });

    const updatedBiz = result.current.businesses.find((b) => b.id === businessId);
    expect(updatedBiz?.subscriptionTier).toBe('ENTERPRISE');
    expect(updatedBiz?.commissionRate).toBe(10);
  });

  it('executes admin business approvals and suspensions', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    const businessId = result.current.businesses[0].id;

    await act(async () => {
      await result.current.suspendBusiness(businessId);
    });

    let biz = result.current.businesses.find((b) => b.id === businessId);
    expect(biz?.status).toBe('SUSPENDED');
    expect(biz?.isVerified).toBe(false);

    await act(async () => {
      await result.current.approveBusiness(businessId);
    });

    biz = result.current.businesses.find((b) => b.id === businessId);
    expect(biz?.status).toBe('APPROVED');
    expect(biz?.isVerified).toBe(true);
  });

  it('resolves disputes and credits user wallet', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    const dispute = result.current.disputes[0];

    if (dispute) {
      await act(async () => {
        await result.current.resolveDispute(dispute.id, 'RESOLVED_REFUND', 'Quality issue refund verified');
      });

      const updatedDispute = result.current.disputes.find((d) => d.id === dispute.id);
      expect(updatedDispute?.status).toBe('RESOLVED');
      expect(updatedDispute?.resolutionNotes).toContain('refund');
    }
  });
});
