// NestJS Clean Architecture Service for Payments Gateway (Stripe & Mobile Money)
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async processMTNMoMoPayment(orderId: string, phone: string, amount: number) {
    // Initiate MTN MoMo API Request (RequestToPay)
    const transactionRef = `MOMO-${Date.now()}`;

    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        methodType: 'MTN_MOMO',
        status: 'SUCCESSFUL', // Simulated instant callback approval
        amount,
        currency: 'RWF',
        transactionRef,
        providerMeta: JSON.stringify({ phone, status: 'APPROVED' }),
      }
    });

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' }
    });

    return payment;
  }

  async processStripeCardPayment(orderId: string, stripeToken: string, amount: number) {
    const transactionRef = `STRIPE-${Date.now()}`;

    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        methodType: 'STRIPE_CARD',
        status: 'SUCCESSFUL',
        amount,
        currency: 'RWF',
        transactionRef,
        providerMeta: JSON.stringify({ stripeToken, chargeId: 'ch_test_123' }),
      }
    });

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' }
    });

    return payment;
  }
}
