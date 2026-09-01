import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { signToken } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';

const googleClientId =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  process.env.GOOGLE_CLIENT_ID ||
  '864785534805-lauq3vrp0d618jqp97b9tfadgjkjtspf.apps.googleusercontent.com';

const googleAuthClient = new OAuth2Client(googleClientId);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { credential } = body;

    if (!credential) {
      return NextResponse.json({ error: 'Missing Google ID token credential' }, { status: 400 });
    }

    // Verify token with Google's public keys
    const ticket = await googleAuthClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ error: 'Invalid Google account information' }, { status: 400 });
    }

    const email = payload.email.toLowerCase();
    const googleId = payload.sub;
    const fullName = payload.name || payload.given_name || email.split('@')[0];
    const avatarUrl = payload.picture;

    await connectToDatabase();

    // Check if user exists by googleId or email
    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (user) {
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (!user.avatarUrl && avatarUrl) {
        user.avatarUrl = avatarUrl;
        updated = true;
      }
      if (!user.emailVerified) {
        user.emailVerified = true;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    } else {
      // Auto-create new customer with Google profile
      user = await User.create({
        email,
        fullName,
        googleId,
        avatarUrl,
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
        message: 'Google login successful',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          avatarUrl: user.avatarUrl,
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
    console.error('Google OAuth error:', error);
    return NextResponse.json(
      { error: error.message || 'Google authentication failed' },
      { status: 500 }
    );
  }
}
