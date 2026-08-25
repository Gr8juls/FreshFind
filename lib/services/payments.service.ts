// lib/services/payments.service.ts
// Payments gateway service — MongoDB/Mongoose for Next.js API routes.

import connectToDatabase from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';

/**
 * Processes an MTN Mobile Money payment for an order.
 */
export async function processMTNMoMoPayment(
  orderId: string,
  phone: string,
  amount: number
): Promise<{ transactionRef: string }> {
  await connectToDatabase();
  const transactionRef = `MOMO-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

  await Payment.create({
    orderId,
    methodType: 'MTN_MOMO',
    status: 'SUCCESSFUL',
    amount,
    currency: 'RWF',
    transactionRef,
    providerMeta: JSON.stringify({ phone, status: 'APPROVED', provider: 'MTN_MOMO_SANDBOX' }),
  });

  await Order.updateOne({ _id: orderId }, { $set: { status: 'PAID' } });

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
  await connectToDatabase();
  const transactionRef = `AIRTEL-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

  await Payment.create({
    orderId,
    methodType: 'AIRTEL_MONEY',
    status: 'SUCCESSFUL',
    amount,
    currency: 'RWF',
    transactionRef,
    providerMeta: JSON.stringify({ phone, status: 'APPROVED', provider: 'AIRTEL_SANDBOX' }),
  });

  await Order.updateOne({ _id: orderId }, { $set: { status: 'PAID' } });

  return { transactionRef };
}

/**
 * Processes a Stripe card payment for an order.
 */
export async function processStripeCardPayment(
  orderId: string,
  stripeToken: string,
  amount: number
): Promise<{ transactionRef: string }> {
  await connectToDatabase();
  const transactionRef = `STRIPE-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

  await Payment.create({
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
  });

  await Order.updateOne({ _id: orderId }, { $set: { status: 'PAID' } });

  return { transactionRef };
}

/**
 * Processes a wallet payment — deducts balance from the user's embedded wallet.
 */
export async function processWalletPayment(
  orderId: string,
  userId: string,
  amount: number
): Promise<{ transactionRef: string }> {
  await connectToDatabase();
  const transactionRef = `WALLET-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

  // Find user and check wallet balance
  const user = await User.findById(userId);
  if (!user || (user.wallet?.balance ?? 0) < amount) {
    throw new Error('Insufficient wallet balance.');
  }

  // Deduct balance
  await User.updateOne(
    { _id: userId },
    { $inc: { 'wallet.balance': -amount } }
  );

  await Payment.create({
    orderId,
    methodType: 'WALLET',
    status: 'SUCCESSFUL',
    amount,
    currency: 'RWF',
    transactionRef,
    providerMeta: JSON.stringify({ userId }),
  });

  await Order.updateOne({ _id: orderId }, { $set: { status: 'PAID' } });

  return { transactionRef };
}
