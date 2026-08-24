import { NextResponse } from 'next/server';
import { verifyQRPickup } from '@/lib/services/orders.service';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { BUSINESS_ROLES } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    let merchantUserId = 'merchant-default';
    if (token) {
      const payload = await verifyToken(token);
      if (payload && BUSINESS_ROLES.includes(payload.role)) {
        merchantUserId = payload.userId;
      }
    }

    const { qrToken } = await request.json();

    if (!qrToken) {
      return NextResponse.json({ error: 'QR token is required' }, { status: 400 });
    }

    const result = await verifyQRPickup(merchantUserId, qrToken.trim());
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('QR verification error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'QR verification failed' },
      { status: 400 }
    );
  }
}
