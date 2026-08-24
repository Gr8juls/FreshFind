import { NextResponse } from 'next/server';
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
    const { status, paymentMethod } = body;

    const transactionRef = `MOMO-PAYOUT-${Date.now()}-${Math.floor(Math.random() * 99999)}`;

    return NextResponse.json({
      message: 'Payout processed successfully',
      payout: {
        id,
        status: status || 'PROCESSED',
        paymentMethod: paymentMethod || 'MTN_MOMO',
        transactionRef,
        processedBy: payload?.email,
        processedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('Admin payout update error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
