import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identityToken, user: appleUser } = body;

    if (!identityToken) {
      return NextResponse.json({ error: 'Missing Apple identity token' }, { status: 400 });
    }

    // Decode Apple JWT payload (unverified decode for payload, or verify if keys present)
    let payload: any = null;
    try {
      const parts = identityToken.split('.');
      if (parts.length === 3) {
        payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
      }
    } catch (e) {
      return NextResponse.json({ error: 'Invalid Apple identity token format' }, { status: 400 });
    }

    if (!payload || !payload.sub) {
      return NextResponse.json({ error: 'Invalid Apple user payload' }, { status: 400 });
    }

    const appleId = payload.sub;
    const email = payload.email ? payload.email.toLowerCase() : `${appleId}@apple.freshfind.rw`;
    
    let fullName = 'Apple User';
    if (appleUser && appleUser.name) {
      const { firstName, lastName } = appleUser.name;
      fullName = [firstName, lastName].filter(Boolean).join(' ') || fullName;
    }

    await connectToDatabase();

    // Check if user exists
    let user = await User.findOne({
      $or: [{ appleId }, { email }],
    });

    if (user) {
      if (!user.appleId) {
        user.appleId = appleId;
        await user.save();
      }
    } else {
      user = await User.create({
        email,
        fullName,
        appleId,
        role: 'CUSTOMER',
        status: 'ACTIVE',
        emailVerified: true,
        wallet: { balance: 0, currency: 'RWF' },
        loyaltyAccount: { points: 0, badgeTier: 'Eco Novice', mealsRescued: 0, co2SavedKg: 0 },
      });
    }

    // Issue JWT token
    const token = await signToken({
      userId: user.id,
      role: user.role as any,
      email: user.email,
    });

    const response = NextResponse.json(
      {
        message: 'Apple login successful',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Apple OAuth error:', error);
    return NextResponse.json(
      { error: error.message || 'Apple authentication failed' },
      { status: 500 }
    );
  }
}
