// NestJS Clean Architecture Service for Orders & QR Verification — MongoDB/Mongoose
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import mongoose from 'mongoose';
import Offer from '../../../lib/models/Offer';
import Order from '../../../lib/models/Order';

@Injectable()
export class OrdersService {
  async reserveOffer(userId: string, offerId: string, quantity: number) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Atomically decrement quantity if sufficient stock exists
      const offer = await Offer.findOneAndUpdate(
        { _id: offerId, quantityAvailable: { $gte: quantity } },
        { $inc: { quantityAvailable: -quantity } },
        { new: true, session }
      );

      if (!offer) {
        throw new BadRequestException('Requested quantity unavailable');
      }

      const reservedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
      const orderNumber = `FF-${Date.now().toString().slice(-6)}`;
      const subtotal = offer.discountedPrice * quantity;

      // Generate unique cryptographic QR token
      const qrToken = `QR-FF-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

      const [order] = await Order.create(
        [
          {
            orderNumber,
            userId,
            status: 'RESERVED',
            subtotal,
            totalAmount: subtotal,
            reservedUntil,
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
          },
        ],
        { session }
      );

      await session.commitTransaction();
      return order;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  async verifyQRPickup(merchantUserId: string, qrToken: string) {
    const order = await Order.findOne({ 'qrCode.qrToken': qrToken });

    if (!order) throw new NotFoundException('QR Code not found');
    if (order.qrCode?.isScanned) throw new BadRequestException('QR Code already redeemed');

    // Calculate environmental impact
    const foodWeightKg = order.items.reduce((acc, item) => acc + item.quantity * 1.2, 0);
    const co2SavedKg = order.items.reduce((acc, item) => acc + item.quantity * 2.5, 0);

    await Order.updateOne(
      { _id: order._id },
      {
        $set: {
          status: 'COMPLETED',
          collectedAt: new Date(),
          'qrCode.isScanned': true,
          'qrCode.scannedAt': new Date(),
          'qrCode.scannedBy': merchantUserId,
          impact: { foodWeightKg, co2SavedKg, createdAt: new Date() },
        },
      }
    );

    return { success: true, message: 'Order verified and completed successfully.' };
  }
}
