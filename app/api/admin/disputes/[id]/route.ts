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
    const { status, resolution, refundAmount, userId } = body;

    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!dispute) {
      return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    }

    const updatedDispute = await prisma.$transaction(async (tx) => {
      // If refund is requested and amount > 0, credit user's wallet
      const targetUserId = userId || dispute.userId;
      if (status === 'RESOLVED' && typeof refundAmount === 'number' && refundAmount > 0) {
        const wallet = await tx.userWallet.upsert({
          where: { userId: targetUserId },
          create: {
            userId: targetUserId,
            balance: refundAmount,
            currency: 'RWF',
          },
          update: {
            balance: { increment: refundAmount },
          },
        });

        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            amount: refundAmount,
            type: 'REFUND',
            reference: `REFUND-DISPUTE-${dispute.id.slice(0, 8)}`,
            description: `Dispute refund for Order #${dispute.order.orderNumber} resolved by ${payload?.email}`,
          },
        });
      }

      return await tx.dispute.update({
        where: { id },
        data: {
          status: status || dispute.status,
          resolution: resolution || dispute.resolution,
        },
      });
    });

    return NextResponse.json({
      message: 'Dispute updated successfully',
      dispute: updatedDispute,
    });
  } catch (err: any) {
    console.error('Admin dispute update error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
