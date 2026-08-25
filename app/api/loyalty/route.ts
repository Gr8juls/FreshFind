import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        await connectToDatabase();

        // loyaltyAccount is embedded inside User
        const user = await User.findById(payload.userId)
          .select('fullName email loyaltyAccount')
          .lean();

        if (user && user.loyaltyAccount) {
          const la = user.loyaltyAccount;
          return NextResponse.json({
            id: (user as any)._id.toString(),
            points: la.points,
            badgeTier: la.badgeTier,
            mealsRescued: la.mealsRescued,
            co2SavedKg: la.co2SavedKg,
            user: {
              fullName: user.fullName || user.email,
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
