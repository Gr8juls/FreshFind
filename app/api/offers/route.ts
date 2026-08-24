import { NextResponse } from 'next/server';
import { findActiveOffers, createOffer } from '@/lib/services/offers.service';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { BUSINESS_ROLES } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const isVegetarian = searchParams.get('vegetarian') === 'true';
    const isVegan = searchParams.get('vegan') === 'true';
    const isHalal = searchParams.get('halal') === 'true';
    const isGlutenFree = searchParams.get('glutenFree') === 'true';
    const maxDistanceKm = searchParams.get('distance') ? Number(searchParams.get('distance')) : undefined;

    const result = await findActiveOffers({
      category,
      isVegetarian,
      isVegan,
      isHalal,
      isGlutenFree,
      maxDistanceKm,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching offers:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !BUSINESS_ROLES.includes(payload.role)) {
      return NextResponse.json({ error: 'Forbidden: Business owner privileges required' }, { status: 403 });
    }

    const body = await request.json();
    const {
      businessId,
      categoryId,
      title,
      description,
      originalPrice,
      discountedPrice,
      quantityTotal,
      pickupStart,
      pickupEnd,
      pickupInstructions,
      isVegetarian,
      isVegan,
      isHalal,
      isGlutenFree,
    } = body;

    if (!businessId || !title || !originalPrice || !discountedPrice || !quantityTotal) {
      return NextResponse.json({ error: 'Missing required offer fields' }, { status: 400 });
    }

    const newOffer = await createOffer(businessId, {
      categoryId: categoryId || 'cat-general',
      title,
      description: description || '',
      originalPrice: Number(originalPrice),
      discountedPrice: Number(discountedPrice),
      quantityTotal: Number(quantityTotal),
      pickupStart: pickupStart ? new Date(pickupStart) : new Date(),
      pickupEnd: pickupEnd ? new Date(pickupEnd) : new Date(Date.now() + 4 * 60 * 60 * 1000),
      pickupInstructions,
      isVegetarian: Boolean(isVegetarian),
      isVegan: Boolean(isVegan),
      isHalal: Boolean(isHalal),
      isGlutenFree: Boolean(isGlutenFree),
    });

    return NextResponse.json({ message: 'Offer created successfully', offer: newOffer }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating offer:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
