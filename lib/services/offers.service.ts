// lib/services/offers.service.ts
// Offers domain service — used by Next.js API routes with MongoDB/Mongoose.

import connectToDatabase from '@/lib/mongodb';
import Offer from '@/lib/models/Offer';
import Business from '@/lib/models/Business';
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
    await connectToDatabase();

    const query: any = {
      status: 'ACTIVE',
      quantityAvailable: { $gt: 0 },
      pickupEnd: { $gte: new Date() },
    };

    if (filters.category && filters.category !== 'All') {
      query.categoryName = filters.category;
    }
    if (filters.isVegetarian) query.isVegetarian = true;
    if (filters.isVegan) query.isVegan = true;
    if (filters.isHalal) query.isHalal = true;
    if (filters.isGlutenFree) query.isGlutenFree = true;

    const dbOffers = await Offer.find(query).sort({ createdAt: -1 }).lean();

    if (!dbOffers || dbOffers.length === 0) {
      return { source: 'mock', data: INITIAL_OFFERS };
    }

    // Fetch related businesses for names/logos
    const businessIds = Array.from(new Set(dbOffers.map((o) => o.businessId)));
    const businesses = await Business.find({ _id: { $in: businessIds } }).lean();
    const businessMap = new Map(businesses.map((b) => [(b as any)._id.toString(), b]));

    // Map DB shape → frontend Offer interface
    const mapped = dbOffers.map((o: any) => {
      const b: any = businessMap.get(o.businessId?.toString()) || {};
      return {
        id: o._id.toString(),
        businessId: o.businessId,
        businessName: b.name || 'Local Partner',
        businessLogo: b.logoUrl || '',
        title: o.title,
        description: o.description,
        category: o.categoryName || '',
        originalPrice: Number(o.originalPrice),
        discountedPrice: Number(o.discountedPrice),
        currency: 'RWF',
        quantityTotal: o.quantityTotal,
        quantityAvailable: o.quantityAvailable,
        pickupStart: new Date(o.pickupStart).toISOString(),
        pickupEnd: new Date(o.pickupEnd).toISOString(),
        imageUrl: o.images?.find((i: any) => i.isPrimary)?.imageUrl || o.images?.[0]?.imageUrl || '',
        distanceKm: 0,
        rating: b.rating || 4.8,
        isVegetarian: o.isVegetarian,
        isVegan: o.isVegan,
        isHalal: o.isHalal,
        isGlutenFree: o.isGlutenFree,
        aiDemandScore: Math.round((o.aiPredictedDemand || 0) * 100),
        aiPriceSuggestion: Number(o.aiSuggestedPrice || 0),
      };
    });

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
  await connectToDatabase();
  return Offer.findById(offerId).lean();
}

/**
 * Creates a new offer with an AI-computed demand score heuristic.
 */
export async function createOffer(
  businessId: string,
  data: {
    categoryId?: string;
    categoryName?: string;
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
  }
) {
  await connectToDatabase();
  const discountRatio = (data.originalPrice - data.discountedPrice) / data.originalPrice;
  const aiPredictedDemand = Math.min(0.99, 0.5 + discountRatio * 0.5);
  const aiSuggestedPrice = data.originalPrice * 0.35;

  return Offer.create({
    ...data,
    businessId,
    quantityAvailable: data.quantityTotal,
    aiPredictedDemand,
    aiSuggestedPrice,
  });
}
