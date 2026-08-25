import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';

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

    const { amount, method } = await request.json();
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      return NextResponse.json({ error: 'Valid positive amount is required' }, { status: 400 });
    }

    await connectToDatabase();

    // wallet is an embedded sub-document on User — use $inc for atomic update
    const user = await User.findOneAndUpdate(
      { _id: payload.userId },
      {
        $inc: { 'wallet.balance': numAmount },
        // Ensure wallet exists with defaults if user has none (new users)
        $setOnInsert: { 'wallet.currency': 'RWF' },
      },
      { new: true, upsert: false }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If wallet didn't exist yet, initialize it
    if (!user.wallet) {
      await User.updateOne(
        { _id: payload.userId },
        { $set: { wallet: { balance: numAmount, currency: 'RWF' } } }
      );
    }

    const transactionRef = `TOPUP-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

    return NextResponse.json({
      message: 'Wallet credited successfully',
      newBalance: user.wallet?.balance ?? numAmount,
      transaction: {
        reference: transactionRef,
        amount: numAmount,
        type: 'DEPOSIT',
        description: `Self wallet top-up via ${method || 'Mobile Money'}`,
      },
    });
  } catch (error: any) {
    console.error('Wallet topup error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
