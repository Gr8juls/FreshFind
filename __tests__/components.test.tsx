import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { OfferCard } from '../components/OfferCard';
import { AISmartSearchBar } from '../components/AISmartSearchBar';
import { NativeEcoAdBanner } from '../components/NativeEcoAdBanner';
import { AppProvider } from '../lib/store';
import { INITIAL_OFFERS } from '../lib/mockData';

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<AppProvider>{ui}</AppProvider>);
};

describe('FreshFind UI Components', () => {
  describe('OfferCard Component', () => {
    it('renders offer title, merchant name, and discounted pricing correctly', () => {
      const mockOffer = INITIAL_OFFERS[0];
      const onSelect = jest.fn();

      renderWithProvider(<OfferCard offer={mockOffer} onSelect={onSelect} />);

      expect(screen.getByText(mockOffer.title)).toBeInTheDocument();
      expect(screen.getByText(mockOffer.businessName)).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(`${mockOffer.discountedPrice.toLocaleString()}\\s*RWF`))
      ).toBeInTheDocument();
    });

    it('displays discount percentage tag', () => {
      const mockOffer = INITIAL_OFFERS[0];
      const discount = Math.round(
        ((mockOffer.originalPrice - mockOffer.discountedPrice) / mockOffer.originalPrice) * 100
      );

      renderWithProvider(<OfferCard offer={mockOffer} onSelect={jest.fn()} />);

      expect(screen.getByText(new RegExp(`-${discount}% OFF`))).toBeInTheDocument();
    });

    it('shows featured badge when isFeatured is true', () => {
      const featuredOffer = {
        ...INITIAL_OFFERS[0],
        isFeatured: true,
        featuredBadge: '🔥 Top 1-Hour Flash Deal',
      };

      renderWithProvider(<OfferCard offer={featuredOffer} onSelect={jest.fn()} />);

      expect(screen.getByText('🔥 Top 1-Hour Flash Deal')).toBeInTheDocument();
    });
  });

  describe('AISmartSearchBar Component', () => {
    it('renders search input and prompt suggestion chips', () => {
      renderWithProvider(<AISmartSearchBar />);

      expect(
        screen.getByPlaceholderText(/Ask AI: e.g. 'Cheap halal dinner/i)
      ).toBeInTheDocument();

      expect(screen.getByText(/Vegan Dinner/i)).toBeInTheDocument();
      expect(screen.getByText(/Top Flash Deals/i)).toBeInTheDocument();
    });

    it('updates text input when user types', () => {
      renderWithProvider(<AISmartSearchBar />);
      const input = screen.getByPlaceholderText(/Ask AI: e.g. 'Cheap halal dinner/i) as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'croissants in nyarutarama' } });
      expect(input.value).toBe('croissants in nyarutarama');
    });
  });

  describe('NativeEcoAdBanner Component', () => {
    it('renders sponsor name and environmental call to action', () => {
      renderWithProvider(<NativeEcoAdBanner adIndex={0} />);

      expect(screen.getByText(/Rwanda Green Fund/i)).toBeInTheDocument();
      expect(screen.getByText(/Explore Grants/i)).toBeInTheDocument();
    });
  });
});
