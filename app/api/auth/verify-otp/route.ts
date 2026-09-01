import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import VerificationCode from '@/lib/models/VerificationCode';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, code, type = 'EMAIL', role = 'CUSTOMER', fullName } = body;

    if (!identifier || !code) {
      return NextResponse.json({ error: 'Identifier and verification code are required' }, { status: 400 });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanCode = code.toString().trim();

    await connectToDatabase();

    // Find valid pending verification code
    const record = await VerificationCode.findOne({
      identifier: cleanIdentifier,
      expiresAt: { $gt: new Date() },
    });

    if (!record) {
      return NextResponse.json(
        { error: 'Verification code has expired or was not found. Please request a new one.' },
        { status: 400 }
      );
    }

    // Rate limit attempts
    if (record.attempts >= 4) {
      await VerificationCode.deleteOne({ _id: record._id });
      return NextResponse.json(
        { error: 'Too many incorrect attempts. Please request a new code.' },
        { status: 429 }
      );
    }

    // Increment attempts
    record.attempts += 1;
    await record.save();

    // Verify code hash
    const isValid = await bcrypt.compare(cleanCode, record.codeHash);
    if (!isValid) {
      const remaining = Math.max(0, 4 - record.attempts);
      return NextResponse.json(
        { error: `Invalid code. ${remaining} attempts remaining.` },
        { status: 400 }
      );
    }

    // Delete used verification code
    await VerificationCode.deleteOne({ _id: record._id });

    // Find or auto-register user (TGTG-style instant passwordless onboarding)
    let user = await User.findOne(
      type === 'EMAIL' ? { email: cleanIdentifier } : { phone: cleanIdentifier }
    );

    if (!user) {
      const generatedName =
        fullName && fullName.trim().length > 0
          ? fullName.trim()
          : cleanIdentifier.includes('@')
          ? cleanIdentifier.split('@')[0].replace(/[._-]/g, ' ')
          : 'Food Rescuer';

      const capitalizedName = generatedName
        .split(' ')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      user = await User.create({
        email: cleanIdentifier.includes('@') ? cleanIdentifier : `${cleanIdentifier}@phone.freshfind.rw`,
        phone: type === 'PHONE' ? cleanIdentifier : undefined,
        fullName: capitalizedName || 'Food Rescuer',
        role: role === 'BUSINESS_OWNER' ? 'BUSINESS_OWNER' : 'CUSTOMER',
        emailVerified: type === 'EMAIL',
        phoneVerified: type === 'PHONE',
        status: 'ACTIVE',
        wallet: { balance: 0, currency: 'RWF' },
        loyaltyAccount: { points: 0, badgeTier: 'Eco Novice', mealsRescued: 0, co2SavedKg: 0 },
      });
    } else {
      if (type === 'EMAIL' && !user.emailVerified) {
        user.emailVerified = true;
        await user.save();
      } else if (type === 'PHONE' && !user.phoneVerified) {
        user.phoneVerified = true;
        await user.save();
      }
    }

    // Issue JWT token
    const token = await signToken({
      userId: user.id,
      role: user.role as any,
      email: user.email,
    });

    const response = NextResponse.json(
      {
        message: 'Login successful',
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
    console.error('verify-otp error:', error);
    return NextResponse.json(
      { error: error.message || 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
