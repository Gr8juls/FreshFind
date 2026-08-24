// lib/services/orders.service.ts
// Orders & QR verification service — used by Next.js API routes.
// Replaces the dead backend/src/orders/orders.service.ts NestJS stub.

import { prisma } from '@/lib/prisma';
import * as crypto from 'crypto';

/**
 * Reserves an offer for a user within a DB transaction.
 * Atomically decrements inventory, creates an Order + QR pickup code.
 * Returns the new Order plus the QR token for the receipt screen.
 */
export async function reserveOffer(
  userId: string,
  offerId: string,
  quantity: number,
  couponId?: string
) {
  return prisma.$transaction(async (tx) => {
    const offer = await tx.offer.findUnique({ where: { id: offerId } });

    if (!offer || offer.status !== 'ACTIVE') {
      throw new Error('Offer is no longer available.');
    }
    if (offer.quantityAvailable < quantity) {
      throw new Error(`Only ${offer.quantityAvailable} left in stock.`);
    }

    // Decrement inventory atomically
    await tx.offer.update({
      where: { id: offerId },
      data: { quantityAvailable: { decrement: quantity } },
    });

    const reservedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15-minute hold
    const orderNumber = `FF-${Date.now().toString().slice(-6)}`;
    const subtotal = Number(offer.discountedPrice) * quantity;

    const order = await tx.order.create({
      data: {
        orderNumber,
        userId,
        status: 'RESERVED',
        subtotal,
        totalAmount: subtotal,
        reservedUntil,
        ...(couponId ? { couponId } : {}),
        items: {
          create: {
            offerId,
            quantity,
            unitPrice: offer.discountedPrice,
            totalPrice: subtotal,
          },
        },
      },
      include: {
        items: { include: { offer: { include: { business: true } } } },
      },
    });

    // Generate a cryptographically unique QR token
    const qrToken = `QR-FF-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    await tx.qRPickupCode.create({
      data: {
        orderId: order.id,
        qrToken,
        qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?data=${qrToken}&size=200x200`,
      },
    });

    return { order, qrToken, orderNumber };
  });
}

/**
 * Verifies a QR code scanned by a merchant and marks the order as COMPLETED.
 * Logs the environmental impact on completion.
 */
export async function verifyQRPickup(merchantUserId: string, qrToken: string) {
  const qrRecord = await prisma.qRPickupCode.findUnique({
    where: { qrToken },
    include: {
      order: {
        include: {
          items: { include: { offer: true } },
        },
      },
    },
  });

  if (!qrRecord) throw new Error('QR Code not found.');
  if (qrRecord.isScanned) throw new Error('QR Code has already been redeemed.');
  if (qrRecord.order.status === 'CANCELLED' || qrRecord.order.status === 'EXPIRED') {
    throw new Error('This order has been cancelled or expired.');
  }

  await prisma.$transaction([
    prisma.qRPickupCode.update({
      where: { id: qrRecord.id },
      data: { isScanned: true, scannedAt: new Date(), scannedBy: merchantUserId },
    }),
    prisma.order.update({
      where: { id: qrRecord.orderId },
      data: { status: 'COMPLETED', collectedAt: new Date() },
    }),
    prisma.environmentalImpact.create({
      data: {
        orderId: qrRecord.orderId,
        foodWeightKg: qrRecord.order.items.reduce(
          (acc, item) => acc + item.quantity * 1.2,
          0
        ),
        co2SavedKg: qrRecord.order.items.reduce(
          (acc, item) => acc + item.quantity * 2.5,
          0
        ),
      },
    }),
  ]);

  // Update loyalty account for the customer
  try {
    const totalItems = qrRecord.order.items.reduce((acc, i) => acc + i.quantity, 0);
    await prisma.loyaltyAccount.upsert({
      where: { userId: qrRecord.order.userId },
      create: {
        userId: qrRecord.order.userId,
        points: totalItems * 50,
        mealsRescued: totalItems,
        co2SavedKg: totalItems * 2.5,
      },
      update: {
        points: { increment: totalItems * 50 },
        mealsRescued: { increment: totalItems },
        co2SavedKg: { increment: totalItems * 2.5 },
      },
    });
  } catch (loyaltyErr) {
    console.error('[OrdersService] Loyalty update failed (non-critical):', loyaltyErr);
  }

  return {
    success: true,
    message: `Order #${qrRecord.order.orderNumber} verified and marked as COMPLETED.`,
    orderNumber: qrRecord.order.orderNumber,
  };
}
