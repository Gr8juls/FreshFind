import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error, payload } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const { role, status, walletCredit } = body;

    const updateData: any = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    // If wallet credit is specified, update or create wallet and log transaction
    if (typeof walletCredit === 'number' && walletCredit > 0) {
      await prisma.$transaction(async (tx) => {
        const wallet = await tx.userWallet.upsert({
          where: { userId: id },
          create: {
            userId: id,
            balance: walletCredit,
            currency: 'RWF',
          },
          update: {
            balance: { increment: walletCredit },
          },
        });

        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            amount: walletCredit,
            type: 'DEPOSIT',
            reference: `ADMIN-CREDIT-${Date.now()}`,
            description: `Admin manual wallet top-up by ${payload?.email}`,
          },
        });

        if (Object.keys(updateData).length > 0) {
          await tx.user.update({
            where: { id },
            data: updateData,
          });
        }
      });
    } else if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id },
        data: updateData,
      });
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id },
      include: { wallet: true },
    });

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (err: any) {
    console.error('Admin user update error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
