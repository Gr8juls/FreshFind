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
        phone: user.phone || '',
        avatarUrl: user.avatarUrl || '',
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

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Sign in required' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, phone, avatarUrl } = body;

    // Strict limited-access whitelist: Only personal presentation info can be edited
    const updateFields: Record<string, any> = {};

    if (fullName !== undefined) {
      if (typeof fullName !== 'string' || fullName.trim().length < 2) {
        return NextResponse.json({ error: 'Full name must have at least 2 characters' }, { status: 400 });
      }
      if (fullName.trim().length > 70) {
        return NextResponse.json({ error: 'Full name cannot exceed 70 characters' }, { status: 400 });
      }
      updateFields.fullName = fullName.trim();
    }

    if (phone !== undefined) {
      if (typeof phone !== 'string') {
        return NextResponse.json({ error: 'Invalid phone format' }, { status: 400 });
      }
      const trimmedPhone = phone.trim();
      if (trimmedPhone.length > 25) {
        return NextResponse.json({ error: 'Phone number is too long' }, { status: 400 });
      }
      updateFields.phone = trimmedPhone;
    }

    if (avatarUrl !== undefined) {
      if (typeof avatarUrl !== 'string') {
        return NextResponse.json({ error: 'Invalid avatar URL' }, { status: 400 });
      }
      const trimmedAvatar = avatarUrl.trim();
      if (trimmedAvatar.length > 500) {
        return NextResponse.json({ error: 'Avatar URL is too long' }, { status: 400 });
      }
      updateFields.avatarUrl = trimmedAvatar;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: 'No valid editable fields provided' }, { status: 400 });
    }

    await connectToDatabase();
    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        phone: updatedUser.phone || '',
        avatarUrl: updatedUser.avatarUrl || '',
        role: updatedUser.role,
        walletBalance: updatedUser.wallet?.balance ?? 0,
        points: updatedUser.loyaltyAccount?.points ?? 0,
        mealsRescued: updatedUser.loyaltyAccount?.mealsRescued ?? 0,
        co2SavedKg: updatedUser.loyaltyAccount?.co2SavedKg ?? 0,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
