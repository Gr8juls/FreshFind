import mongoose, { Document, Schema, Model, models } from 'mongoose';

export interface IPayment extends Document {
  orderId: string;
  methodType: 'STRIPE_CARD' | 'MTN_MOMO' | 'AIRTEL_MONEY' | 'WALLET' | 'APPLE_PAY' | 'GOOGLE_PAY';
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'REFUNDED';
  amount: number;
  currency: string;
  transactionRef: string;
  providerMeta?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    methodType: {
      type: String,
      enum: ['STRIPE_CARD', 'MTN_MOMO', 'AIRTEL_MONEY', 'WALLET', 'APPLE_PAY', 'GOOGLE_PAY'],
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESSFUL', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'RWF' },
    transactionRef: { type: String, required: true, unique: true },
    providerMeta: String,
  },
  { timestamps: true }
);

const Payment: Model<IPayment> = models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
