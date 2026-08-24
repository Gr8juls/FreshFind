import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;

    // Set offer status to CANCELLED or delete
    const updatedOffer = await prisma.offer.update({
      where: { id },
      data: { status: 'CANCELLED', deletedAt: new Date() },
    });

    return NextResponse.json({
      message: 'Offer taken down successfully',
      offer: updatedOffer,
    });
  } catch (err: any) {
    console.error('Admin offer delete error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
