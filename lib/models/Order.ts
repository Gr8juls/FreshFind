import mongoose, { Document, Schema, Model, models } from 'mongoose';

// ─── Sub-schemas ────────────────────────────────────────────────────────────

const OrderItemSchema = new Schema(
  {
    offerId: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { _id: true }
);

const QRPickupCodeSchema = new Schema(
  {
    qrToken: { type: String, required: true, unique: true },
    qrImageUrl: { type: String, required: true },
    isScanned: { type: Boolean, default: false },
    scannedAt: Date,
    scannedBy: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const EnvironmentalImpactSchema = new Schema(
  {
    foodWeightKg: Number,
    co2SavedKg: Number,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// ─── Order Document ──────────────────────────────────────────────────────────

export interface IOrder extends Document {
  _id: string;
  orderNumber: string;
  userId: string;
  status:
    | 'RESERVED'
    | 'PAYMENT_PENDING'
    | 'PAID'
    | 'READY_FOR_PICKUP'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'EXPIRED';
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  couponId?: string;
  reservedUntil: Date;
  collectedAt?: Date;
  cancelledAt?: Date;
  items: {
    _id: string;
    offerId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  qrCode?: {
    qrToken: string;
    qrImageUrl: string;
    isScanned: boolean;
    scannedAt?: Date;
    scannedBy?: string;
    createdAt: Date;
  };
  impact?: {
    foodWeightKg?: number;
    co2SavedKg?: number;
    createdAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['RESERVED', 'PAYMENT_PENDING', 'PAID', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED', 'EXPIRED'],
      default: 'RESERVED',
      index: true,
    },
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    couponId: String,
    reservedUntil: { type: Date, required: true },
    collectedAt: Date,
    cancelledAt: Date,
    items: { type: [OrderItemSchema], default: [] },
    qrCode: QRPickupCodeSchema,
    impact: EnvironmentalImpactSchema,
  },
  { timestamps: true }
);

const Order: Model<IOrder> = models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
