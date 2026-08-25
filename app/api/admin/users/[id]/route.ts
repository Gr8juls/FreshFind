import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import connectToDatabase from '@/lib/mongodb';
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
    const { role, status, walletCredit } = body;

    await connectToDatabase();

    const updateData: Record<string, any> = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    // If wallet credit is specified, atomically increment embedded wallet balance
    if (typeof walletCredit === 'number' && walletCredit > 0) {
      await User.updateOne(
        { _id: id },
        {
          $inc: { 'wallet.balance': walletCredit },
          $set: { ...updateData, 'wallet.currency': 'RWF' },
        }
      );
    } else if (Object.keys(updateData).length > 0) {
      await User.updateOne({ _id: id }, { $set: updateData });
    }

    const updatedUser = await User.findById(id).lean();

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (err: any) {
    console.error('Admin user update error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
