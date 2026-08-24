// lib/services/offers.service.ts
// Offers domain service — used by Next.js API routes.
// Replaces the dead backend/src/offers/offers.service.ts NestJS stub.

import { prisma } from '@/lib/prisma';
import { INITIAL_OFFERS } from '@/lib/mockData';

export interface OffersFilter {
  category?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isHalal?: boolean;
  isGlutenFree?: boolean;
  maxDistanceKm?: number;
}

/**
 * Fetches all active offers from the database.
 * Falls back to mock data if the DB has no offers yet (dev convenience).
 */
export async function findActiveOffers(filters: OffersFilter = {}) {
  try {
    const where: any = {
      status: 'ACTIVE',
      quantityAvailable: { gt: 0 },
      pickupEnd: { gte: new Date() },
    };

    if (filters.category && filters.category !== 'All') {
      where.category = { name: filters.category };
    }
    if (filters.isVegetarian) where.isVegetarian = true;
    if (filters.isVegan) where.isVegan = true;
    if (filters.isHalal) where.isHalal = true;
    if (filters.isGlutenFree) where.isGlutenFree = true;

    const dbOffers = await prisma.offer.findMany({
      where,
      include: {
        business: { include: { location: true } },
        images: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (dbOffers.length === 0) {
      // Return structured mock data so the UI never shows an empty list during dev
      return { source: 'mock', data: INITIAL_OFFERS };
    }

    // Map DB shape → frontend Offer interface
    const mapped = dbOffers.map((o) => ({
      id: o.id,
      businessId: o.businessId,
      businessName: o.business.name,
      businessLogo: o.business.logoUrl || '',
      title: o.title,
      description: o.description,
      category: o.category?.name || '',
      originalPrice: Number(o.originalPrice),
      discountedPrice: Number(o.discountedPrice),
      currency: 'RWF',
      quantityTotal: o.quantityTotal,
      quantityAvailable: o.quantityAvailable,
      pickupStart: o.pickupStart.toISOString(),
      pickupEnd: o.pickupEnd.toISOString(),
      imageUrl: o.images.find((i) => i.isPrimary)?.imageUrl || o.images[0]?.imageUrl || '',
      distanceKm: 0, // computed on frontend from geo coords
      rating: o.business.rating,
      isVegetarian: o.isVegetarian,
      isVegan: o.isVegan,
      isHalal: o.isHalal,
      isGlutenFree: o.isGlutenFree,
      aiDemandScore: Math.round((o.aiPredictedDemand || 0) * 100),
      aiPriceSuggestion: Number(o.aiSuggestedPrice || 0),
    }));

    return { source: 'db', data: mapped };
  } catch (err) {
    console.error('[OffersService] findActiveOffers error, falling back to mock:', err);
    return { source: 'mock', data: INITIAL_OFFERS };
  }
}

/**
 * Fetches a single offer by ID from the database.
 */
export async function findOfferById(offerId: string) {
  return prisma.offer.findUnique({
    where: { id: offerId },
    include: {
      business: { include: { location: true } },
      images: true,
      category: true,
    },
  });
}

/**
 * Creates a new offer with an AI-computed demand score heuristic.
 */
export async function createOffer(businessId: string, data: {
  categoryId: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  quantityTotal: number;
  pickupStart: Date;
  pickupEnd: Date;
  pickupInstructions?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isHalal?: boolean;
  isGlutenFree?: boolean;
}) {
  const discountRatio = (data.originalPrice - data.discountedPrice) / data.originalPrice;
  const aiPredictedDemand = Math.min(0.99, 0.5 + discountRatio * 0.5);
  const aiSuggestedPrice = data.originalPrice * 0.35;

  return prisma.offer.create({
    data: {
      ...data,
      businessId,
      quantityAvailable: data.quantityTotal,
      aiPredictedDemand,
      aiSuggestedPrice,
    },
  });
}
