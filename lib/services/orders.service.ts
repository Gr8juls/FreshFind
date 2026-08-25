// lib/services/orders.service.ts
// Orders & QR verification service — MongoDB/Mongoose for Next.js API routes.

import connectToDatabase from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Offer from '@/lib/models/Offer';
import User from '@/lib/models/User';
import * as crypto from 'crypto';

/**
 * Reserves an offer for a user.
 * Atomically decrements inventory, creates an Order + QR pickup code.
 * Returns the new Order plus the QR token for the receipt screen.
 */
export async function reserveOffer(
  userId: string,
  offerId: string,
  quantity: number,
  couponId?: string
) {
  await connectToDatabase();

  // Atomically decrement stock if sufficient available
  const offer = await Offer.findOneAndUpdate(
    { _id: offerId, status: 'ACTIVE', quantityAvailable: { $gte: quantity } },
    { $inc: { quantityAvailable: -quantity } },
    { new: true }
  );

  if (!offer) {
    // Check if offer exists to give clear error message
    const existing = await Offer.findById(offerId);
    if (!existing || existing.status !== 'ACTIVE') {
      throw new Error('Offer is no longer available.');
    }
    throw new Error(`Only ${existing.quantityAvailable} left in stock.`);
  }

  const reservedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15-minute hold
  const orderNumber = `FF-${Date.now().toString().slice(-6)}`;
  const subtotal = Number(offer.discountedPrice) * quantity;
  const qrToken = `QR-FF-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  const order = await Order.create({
    orderNumber,
    userId,
    status: 'RESERVED',
    subtotal,
    totalAmount: subtotal,
    reservedUntil,
    ...(couponId ? { couponId } : {}),
    items: [
      {
        offerId,
        quantity,
        unitPrice: offer.discountedPrice,
        totalPrice: subtotal,
      },
    ],
    qrCode: {
      qrToken,
      qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?data=${qrToken}&size=200x200`,
      isScanned: false,
      createdAt: new Date(),
    },
  });

  return { order, qrToken, orderNumber };
}

/**
 * Verifies a QR code scanned by a merchant and marks the order as COMPLETED.
 * Logs the environmental impact on completion.
 */
export async function verifyQRPickup(merchantUserId: string, qrToken: string) {
  await connectToDatabase();

  const order = await Order.findOne({ 'qrCode.qrToken': qrToken });

  if (!order) throw new Error('QR Code not found.');
  if (order.qrCode?.isScanned) throw new Error('QR Code has already been redeemed.');
  if (order.status === 'CANCELLED' || order.status === 'EXPIRED') {
    throw new Error('This order has been cancelled or expired.');
  }

  const foodWeightKg = order.items.reduce((acc, item) => acc + item.quantity * 1.2, 0);
  const co2SavedKg = order.items.reduce((acc, item) => acc + item.quantity * 2.5, 0);
  const totalItems = order.items.reduce((acc, i) => acc + i.quantity, 0);

  await Order.updateOne(
    { _id: order._id },
    {
      $set: {
        status: 'COMPLETED',
        collectedAt: new Date(),
        'qrCode.isScanned': true,
        'qrCode.scannedAt': new Date(),
        'qrCode.scannedBy': merchantUserId,
        impact: {
          foodWeightKg,
          co2SavedKg,
          createdAt: new Date(),
        },
      },
    }
  );

  // Update loyalty account for customer
  try {
    await User.updateOne(
      { _id: order.userId },
      {
        $inc: {
          'loyaltyAccount.points': totalItems * 50,
          'loyaltyAccount.mealsRescued': totalItems,
          'loyaltyAccount.co2SavedKg': totalItems * 2.5,
        },
      }
    );
  } catch (loyaltyErr) {
    console.error('[OrdersService] Loyalty update failed (non-critical):', loyaltyErr);
  }

  return {
    success: true,
    message: `Order #${order.orderNumber} verified and marked as COMPLETED.`,
    orderNumber: order.orderNumber,
  };
}
