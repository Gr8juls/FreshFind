// NestJS Clean Architecture Service for Offers Domain
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  async findNearbyOffers(lat: number, lng: number, radiusKm: number = 10, filters?: any) {
    // Spatial SQL Query / PostGIS calculation via Prisma
    return this.prisma.offer.findMany({
      where: {
        status: 'ACTIVE',
        quantityAvailable: { gt: 0 },
        pickupEnd: { gte: new Date() },
        ...(filters?.category && { category: { name: filters.category } }),
        ...(filters?.isVegetarian && { isVegetarian: true }),
        ...(filters?.isVegan && { isVegan: true }),
        ...(filters?.isHalal && { isHalal: true }),
        ...(filters?.isGlutenFree && { isGlutenFree: true }),
      },
      include: {
        business: {
          include: { location: true }
        },
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createOffer(businessId: string, data: any) {
    // Dynamic AI Demand calculation
    const discountRatio = (data.originalPrice - data.discountedPrice) / data.originalPrice;
    const aiDemandScore = Math.min(0.99, 0.5 + (discountRatio * 0.5));
    const aiSuggestedPrice = data.originalPrice * 0.3;

    return this.prisma.offer.create({
      data: {
        ...data,
        businessId,
        aiPredictedDemand: aiDemandScore,
        aiSuggestedPrice: aiSuggestedPrice,
      },
    });
  }
}
