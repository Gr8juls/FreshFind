// NestJS Clean Architecture Service for Offers Domain — MongoDB/Mongoose
import { Injectable, NotFoundException } from '@nestjs/common';
import Offer from '../../../lib/models/Offer';

@Injectable()
export class OffersService {
  async findNearbyOffers(lat: number, lng: number, radiusKm: number = 10, filters?: any) {
    const query: Record<string, any> = {
      status: 'ACTIVE',
      quantityAvailable: { $gt: 0 },
      pickupEnd: { $gte: new Date() },
    };

    if (filters?.category) query.categoryName = filters.category;
    if (filters?.isVegetarian) query.isVegetarian = true;
    if (filters?.isVegan) query.isVegan = true;
    if (filters?.isHalal) query.isHalal = true;
    if (filters?.isGlutenFree) query.isGlutenFree = true;

    return Offer.find(query).sort({ createdAt: -1 }).lean();
  }

  async createOffer(businessId: string, data: any) {
    // Dynamic AI Demand calculation
    const discountRatio = (data.originalPrice - data.discountedPrice) / data.originalPrice;
    const aiDemandScore = Math.min(0.99, 0.5 + discountRatio * 0.5);
    const aiSuggestedPrice = data.originalPrice * 0.3;

    return Offer.create({
      ...data,
      businessId,
      aiPredictedDemand: aiDemandScore,
      aiSuggestedPrice,
    });
  }
}
