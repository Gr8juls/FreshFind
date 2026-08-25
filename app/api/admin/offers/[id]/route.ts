import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import connectToDatabase from '@/lib/mongodb';
import Offer from '@/lib/models/Offer';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;

    await connectToDatabase();

    // Set offer status to CANCELLED (soft delete)
    const updatedOffer = await Offer.findByIdAndUpdate(
      id,
      { $set: { status: 'CANCELLED', deletedAt: new Date() } },
      { new: true }
    );

    if (!updatedOffer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Offer taken down successfully',
      offer: updatedOffer,
    });
  } catch (err: any) {
    console.error('Admin offer delete error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
