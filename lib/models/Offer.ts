import mongoose, { Document, Schema, Model, models } from 'mongoose';

export interface IOffer extends Document {
  _id: string;
  businessId: string;
  categoryId?: string;
  categoryName?: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  quantityTotal: number;
  quantityAvailable: number;
  pickupStart: Date;
  pickupEnd: Date;
  pickupInstructions?: string;
  status: 'DRAFT' | 'ACTIVE' | 'SOLD_OUT' | 'EXPIRED' | 'CANCELLED';
  isVegetarian: boolean;
  isVegan: boolean;
  isHalal: boolean;
  isGlutenFree: boolean;
  aiPredictedDemand?: number;
  aiSuggestedPrice?: number;
  images: { imageUrl: string; isPrimary: boolean }[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const OfferImageSchema = new Schema(
  {
    imageUrl: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const OfferSchema = new Schema<IOffer>(
  {
    businessId: { type: String, required: true, index: true },
    categoryId: String,
    categoryName: String,
    title: { type: String, required: true },
    description: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    quantityTotal: { type: Number, required: true },
    quantityAvailable: { type: Number, required: true },
    pickupStart: { type: Date, required: true },
    pickupEnd: { type: Date, required: true, index: true },
    pickupInstructions: String,
    status: {
      type: String,
      enum: ['DRAFT', 'ACTIVE', 'SOLD_OUT', 'EXPIRED', 'CANCELLED'],
      default: 'ACTIVE',
      index: true,
    },
    isVegetarian: { type: Boolean, default: false },
    isVegan: { type: Boolean, default: false },
    isHalal: { type: Boolean, default: false },
    isGlutenFree: { type: Boolean, default: false },
    aiPredictedDemand: Number,
    aiSuggestedPrice: Number,
    images: { type: [OfferImageSchema], default: [] },
    deletedAt: Date,
  },
  { timestamps: true }
);

// Compound index for geo-nearby queries by status + pickup window
OfferSchema.index({ status: 1, pickupEnd: 1, quantityAvailable: 1 });

const Offer: Model<IOffer> = models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);

export default Offer;
