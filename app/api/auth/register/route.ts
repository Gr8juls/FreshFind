import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { REGISTERABLE_ROLES } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { email, password, fullName, role } = await request.json();

    if (!email || !password || !fullName || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Security: only allow safe public-facing roles — prevents self-promotion to ADMIN
    if (!REGISTERABLE_ROLES.includes(role)) {
      return NextResponse.json(
        { error: `Role '${role}' cannot be self-assigned. Allowed: ${REGISTERABLE_ROLES.join(', ')}` },
        { status: 403 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user in DB with wallet and loyalty account
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role,
        wallet: { create: { balance: 0, currency: 'RWF' } },
        loyaltyAccount: {
          create: { points: 0, badgeTier: 'Eco Novice', mealsRescued: 0, co2SavedKg: 0 },
        },
      },
    });

    // Generate JWT
    const token = await signToken({ userId: user.id, role: user.role as any, email: user.email });

    const response = NextResponse.json(
      { message: 'User registered successfully', user: { id: user.id, email: user.email, role: user.role } },
      { status: 201 }
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
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
