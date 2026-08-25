import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    await connectToDatabase();

    // wallet and loyaltyAccount are embedded sub-documents — no populate needed
    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        walletBalance: user.wallet?.balance ?? 0,
        points: user.loyaltyAccount?.points ?? 0,
        mealsRescued: user.loyaltyAccount?.mealsRescued ?? 0,
        co2SavedKg: user.loyaltyAccount?.co2SavedKg ?? 0,
      },
    });
  } catch (error) {
    console.error('Session fetch error:', error);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
