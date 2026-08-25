import mongoose, { Document, Schema, Model, models, Types } from 'mongoose';

// ─── Embedded sub-schemas ───────────────────────────────────────────────────

const BusinessLocationSchema = new Schema(
  {
    addressLine1: String,
    addressLine2: String,
    city: String,
    district: String,
    country: { type: String, default: 'Rwanda' },
    latitude: Number,
    longitude: Number,
  },
  { _id: false }
);

// ─── Business Document ──────────────────────────────────────────────────────

export interface IBusiness extends Document {
  _id: Types.ObjectId;
  ownerId: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  phone: string;
  email: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  location?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    district?: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const BusinessSchema = new Schema<IBusiness>(
  {
    ownerId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    logoUrl: String,
    bannerUrl: String,
    phone: { type: String, required: true },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING_APPROVAL',
      index: true,
    },
    isVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0.0 },
    totalReviews: { type: Number, default: 0 },
    location: { type: BusinessLocationSchema },
    deletedAt: Date,
  },
  { timestamps: true }
);

const Business: Model<IBusiness> = models.Business || mongoose.model<IBusiness>('Business', BusinessSchema);

export default Business;
