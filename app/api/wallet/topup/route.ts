import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

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

    const result = await prisma.$transaction(async (tx) => {
      const wallet = await tx.userWallet.upsert({
        where: { userId: payload.userId },
        create: {
          userId: payload.userId,
          balance: numAmount,
          currency: 'RWF',
        },
        update: {
          balance: { increment: numAmount },
        },
      });

      const txRecord = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount: numAmount,
          type: 'DEPOSIT',
          reference: `TOPUP-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
          description: `Self wallet top-up via ${method || 'Mobile Money'}`,
        },
      });

      return { balance: Number(wallet.balance), transaction: txRecord };
    });

    return NextResponse.json({
      message: 'Wallet credited successfully',
      newBalance: result.balance,
      transaction: result.transaction,
    });
  } catch (error: any) {
    console.error('Wallet topup error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
