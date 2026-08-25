import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import connectToDatabase from '@/lib/mongodb';
import Business from '@/lib/models/Business';

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

    await connectToDatabase();

    const updateData: Record<string, any> = {};
    if (typeof isVerified === 'boolean') updateData.isVerified = isVerified;
    if (status) updateData.status = status;

    const updatedBusiness = await Business.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedBusiness) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Business updated successfully',
      business: updatedBusiness,
    });
  } catch (err: any) {
    console.error('Admin business update error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
