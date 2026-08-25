// NestJS Clean Architecture Service for Payments Gateway — MongoDB/Mongoose
import { Injectable, BadRequestException } from '@nestjs/common';
import Payment from '../../../lib/models/Payment';
import Order from '../../../lib/models/Order';

@Injectable()
export class PaymentsService {
  async processMTNMoMoPayment(orderId: string, phone: string, amount: number) {
    // Initiate MTN MoMo API Request (RequestToPay)
    const transactionRef = `MOMO-${Date.now()}`;

    const payment = await Payment.create({
      orderId,
      methodType: 'MTN_MOMO',
      status: 'SUCCESSFUL', // Simulated instant callback approval
      amount,
      currency: 'RWF',
      transactionRef,
      providerMeta: JSON.stringify({ phone, status: 'APPROVED' }),
    });

    await Order.updateOne(
      { _id: orderId },
      { $set: { status: 'PAID' } }
    );

    return payment;
  }

  async processStripeCardPayment(orderId: string, stripeToken: string, amount: number) {
    const transactionRef = `STRIPE-${Date.now()}`;

    const payment = await Payment.create({
      orderId,
      methodType: 'STRIPE_CARD',
      status: 'SUCCESSFUL',
      amount,
      currency: 'RWF',
      transactionRef,
      providerMeta: JSON.stringify({ stripeToken, chargeId: 'ch_test_123' }),
    });

    await Order.updateOne(
      { _id: orderId },
      { $set: { status: 'PAID' } }
    );

    return payment;
  }
}
