import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        const userLoyalty = await prisma.loyaltyAccount.findUnique({
          where: { userId: payload.userId },
          include: {
            user: {
              select: { fullName: true, email: true },
            },
          },
        });

        if (userLoyalty) {
          return NextResponse.json({
            id: userLoyalty.id,
            points: userLoyalty.points,
            badgeTier: userLoyalty.badgeTier,
            mealsRescued: userLoyalty.mealsRescued,
            co2SavedKg: userLoyalty.co2SavedKg,
            user: {
              fullName: userLoyalty.user.fullName || userLoyalty.user.email,
            },
          });
        }
      }
    }

    // Default fallback for guest/unauthenticated preview
    return NextResponse.json({
      id: 'guest-loyalty',
      points: 480,
      badgeTier: 'Waste Warrior 🌿',
      mealsRescued: 18,
      co2SavedKg: 45.2,
      user: {
        fullName: 'Eco Hero',
      },
    });
  } catch (error) {
    console.error('Error fetching loyalty account:', error);
    return NextResponse.json({
      id: 'guest-loyalty',
      points: 480,
      badgeTier: 'Waste Warrior 🌿',
      mealsRescued: 18,
      co2SavedKg: 45.2,
      user: {
        fullName: 'Eco Hero',
      },
    });
  }
}
