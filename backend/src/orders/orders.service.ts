// NestJS Clean Architecture Service for Orders & QR Verification
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async reserveOffer(userId: string, offerId: string, quantity: number) {
    return this.prisma.$transaction(async (tx: any) => {
      const offer = await tx.offer.findUnique({ where: { id: offerId } });
      if (!offer || offer.quantityAvailable < quantity) {
        throw new BadRequestException('Requested quantity unavailable');
      }

      // Decrement inventory safely within transaction
      await tx.offer.update({
        where: { id: offerId },
        data: { quantityAvailable: { decrement: quantity } },
      });

      const reservedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
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
          items: {
            create: {
              offerId,
              quantity,
              unitPrice: offer.discountedPrice,
              totalPrice: subtotal,
            }
          }
        }
      });

      // Generate unique cryptographic QR token
      const qrToken = `QR-FF-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      await tx.qRPickupCode.create({
        data: {
          orderId: order.id,
          qrToken,
          qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?data=${qrToken}&size=200x200`,
        }
      });

      return order;
    });
  }

  async verifyQRPickup(merchantUserId: string, qrToken: string) {
    const qrRecord = await this.prisma.qRPickupCode.findUnique({
      where: { qrToken },
      include: { order: { include: { items: { include: { offer: true } } } } }
    });

    if (!qrRecord) throw new NotFoundException('QR Code not found');
    if (qrRecord.isScanned) throw new BadRequestException('QR Code already redeemed');

    // Mark as collected
    await this.prisma.$transaction([
      this.prisma.qRPickupCode.update({
        where: { id: qrRecord.id },
        data: { isScanned: true, scannedAt: new Date(), scannedBy: merchantUserId },
      }),
      this.prisma.order.update({
        where: { id: qrRecord.orderId },
        data: { status: 'COMPLETED', collectedAt: new Date() },
      }),
      // Log environmental impact metrics
      this.prisma.environmentalImpact.create({
        data: {
          orderId: qrRecord.orderId,
          foodWeightKg: qrRecord.order.items.reduce((acc: number, item: any) => acc + (item.quantity * 1.2), 0),
          co2SavedKg: qrRecord.order.items.reduce((acc: number, item: any) => acc + (item.quantity * 2.5), 0),
        }
      })
    ]);

    return { success: true, message: 'Order verified and completed successfully.' };
  }
}
