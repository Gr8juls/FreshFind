import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import connectToDatabase from '@/lib/mongodb';
import Dispute from '@/lib/models/Dispute';
import User from '@/lib/models/User';

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

    await connectToDatabase();

    const dispute = await Dispute.findById(id);

    if (!dispute) {
      return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    }

    // If refund is requested, credit user's embedded wallet atomically
    const targetUserId = userId || dispute.userId;
    if (status === 'RESOLVED' && typeof refundAmount === 'number' && refundAmount > 0) {
      await User.updateOne(
        { _id: targetUserId },
        {
          $inc: { 'wallet.balance': refundAmount },
          $setOnInsert: { 'wallet.currency': 'RWF' },
        }
      );
    }

    const updatedDispute = await Dispute.findByIdAndUpdate(
      id,
      {
        $set: {
          status: status || dispute.status,
          resolution: resolution || dispute.resolution,
        },
      },
      { new: true }
    );

    return NextResponse.json({
      message: 'Dispute updated successfully',
      dispute: updatedDispute,
    });
  } catch (err: any) {
    console.error('Admin dispute update error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
