// lib/services/payments.service.ts
// Payments gateway service — used by Next.js API routes.
// Replaces the dead backend/src/payments/payments.service.ts NestJS stub.
// Real Stripe / MTN MoMo SDK calls go here when you have live credentials.

import { prisma } from '@/lib/prisma';

/**
 * Processes an MTN Mobile Money payment for an order.
 * Currently simulates an instant approval (real impl: call MTN MoMo RequestToPay API).
 */
export async function processMTNMoMoPayment(
  orderId: string,
  phone: string,
  amount: number
): Promise<{ transactionRef: string }> {
  const transactionRef = `MOMO-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

  await prisma.payment.create({
    data: {
      orderId,
      methodType: 'MTN_MOMO',
      status: 'SUCCESSFUL', // TODO: Replace with PENDING + webhook callback in production
      amount,
      currency: 'RWF',
      transactionRef,
      providerMeta: JSON.stringify({ phone, status: 'APPROVED', provider: 'MTN_MOMO_SANDBOX' }),
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'PAID' },
  });

  return { transactionRef };
}

/**
 * Processes an Airtel Money payment for an order.
 */
export async function processAirtelMoneyPayment(
  orderId: string,
  phone: string,
  amount: number
): Promise<{ transactionRef: string }> {
  const transactionRef = `AIRTEL-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

  await prisma.payment.create({
    data: {
      orderId,
      methodType: 'AIRTEL_MONEY',
      status: 'SUCCESSFUL',
      amount,
      currency: 'RWF',
      transactionRef,
      providerMeta: JSON.stringify({ phone, status: 'APPROVED', provider: 'AIRTEL_SANDBOX' }),
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'PAID' },
  });

  return { transactionRef };
}

/**
 * Processes a Stripe card payment for an order.
 * Real impl: call stripe.paymentIntents.create() with the token.
 */
export async function processStripeCardPayment(
  orderId: string,
  stripeToken: string,
  amount: number
): Promise<{ transactionRef: string }> {
  const transactionRef = `STRIPE-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

  await prisma.payment.create({
    data: {
      orderId,
      methodType: 'STRIPE_CARD',
      status: 'SUCCESSFUL',
      amount,
      currency: 'RWF',
      transactionRef,
      providerMeta: JSON.stringify({
        stripeToken,
        chargeId: `ch_sandbox_${transactionRef}`,
      }),
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'PAID' },
  });

  return { transactionRef };
}

/**
 * Processes a wallet payment — deducts balance from the user's UserWallet.
 */
export async function processWalletPayment(
  orderId: string,
  userId: string,
  amount: number
): Promise<{ transactionRef: string }> {
  const transactionRef = `WALLET-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

  await prisma.$transaction(async (tx) => {
    const wallet = await tx.userWallet.findUnique({ where: { userId } });
    if (!wallet || Number(wallet.balance) < amount) {
      throw new Error('Insufficient wallet balance.');
    }

    await tx.userWallet.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    });

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type: 'PAYMENT',
        reference: transactionRef,
        description: `Payment for order`,
      },
    });

    await tx.payment.create({
      data: {
        orderId,
        methodType: 'WALLET',
        status: 'SUCCESSFUL',
        amount,
        currency: 'RWF',
        transactionRef,
        providerMeta: JSON.stringify({ walletId: wallet.id }),
      },
    });

    await tx.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
    });
  });

  return { transactionRef };
}
