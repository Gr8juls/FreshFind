import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import Favorite from '@/lib/models/Favorite';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ favorites: [] });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ favorites: [] });
    }

    await connectToDatabase();

    const favorites = await Favorite.find({ userId: payload.userId }).select('businessId').lean();

    return NextResponse.json({ favorites: favorites.map((f) => f.businessId) });
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { businessId } = await request.json();
    if (!businessId) {
      return NextResponse.json({ error: 'businessId required' }, { status: 400 });
    }

    await connectToDatabase();

    // Toggle favorite
    const existing = await Favorite.findOne({ userId: payload.userId, businessId });

    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return NextResponse.json({ favorited: false, businessId });
    } else {
      await Favorite.create({ userId: payload.userId, businessId });
      return NextResponse.json({ favorited: true, businessId });
    }
  } catch (error: any) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
