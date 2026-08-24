import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const { isVerified, status } = body;

    const updateData: any = {};
    if (typeof isVerified === 'boolean') updateData.isVerified = isVerified;
    if (status) updateData.status = status;

    const updatedBusiness = await prisma.business.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Business updated successfully',
      business: updatedBusiness,
    });
  } catch (err: any) {
    console.error('Admin business update error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
