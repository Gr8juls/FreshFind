import { NextResponse } from 'next/server';
import { reserveOffer } from '@/lib/services/orders.service';
import {
  processMTNMoMoPayment,
  processAirtelMoneyPayment,
  processStripeCardPayment,
  processWalletPayment,
} from '@/lib/services/payments.service';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    let userId = 'guest-checkout';
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }

    const body = await request.json();
    const {
      offerId,
      quantity,
      paymentMethod,
      phone,
      stripeToken,
      couponId,
    } = body;

    if (!offerId || !quantity || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required order parameters' }, { status: 400 });
    }

    // 1. Transactionally reserve offer & create initial order
    const { order, qrToken, orderNumber } = await reserveOffer(
      userId,
      offerId,
      Number(quantity),
      couponId
    );

    const totalAmount = Number(order.totalAmount);
    let paymentResult: { transactionRef: string } | null = null;

    // 2. Process corresponding payment method
    switch (paymentMethod) {
      case 'MTN_MOMO':
        paymentResult = await processMTNMoMoPayment(order.id, phone || '+250788000000', totalAmount);
        break;
      case 'AIRTEL_MONEY':
        paymentResult = await processAirtelMoneyPayment(order.id, phone || '+250722000000', totalAmount);
        break;
      case 'STRIPE_CARD':
        paymentResult = await processStripeCardPayment(order.id, stripeToken || 'tok_visa', totalAmount);
        break;
      case 'WALLET':
        paymentResult = await processWalletPayment(order.id, userId, totalAmount);
        break;
      default:
        throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }

    return NextResponse.json(
      {
        message: 'Order created and paid successfully',
        order: {
          id: order.id,
          orderNumber,
          totalPrice: totalAmount,
          status: 'PAID',
          qrToken,
          pickupWindow: `${order.reservedUntil.toISOString()}`,
          paymentMethod,
          transactionRef: paymentResult?.transactionRef,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
