import mongoose, { Document, Schema, Model, models } from 'mongoose';

// ─── Sub-schemas (embedded documents) ──────────────────────────────────────

const UserWalletSchema = new Schema(
  {
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'RWF' },
  },
  { _id: true }
);

const LoyaltyAccountSchema = new Schema(
  {
    points: { type: Number, default: 0 },
    badgeTier: { type: String, default: 'Eco Novice' },
    mealsRescued: { type: Number, default: 0 },
    co2SavedKg: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// ─── Main User Schema ───────────────────────────────────────────────────────

export interface IUser extends Document {
  _id: string;
  email: string;
  passwordHash?: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: 'CUSTOMER' | 'BUSINESS_OWNER' | 'BUSINESS_MANAGER' | 'BUSINESS_STAFF' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'DELETED';
  emailVerified: boolean;
  phoneVerified: boolean;
  googleId?: string;
  appleId?: string;
  wallet?: {
    _id: string;
    balance: number;
    currency: string;
  };
  loyaltyAccount?: {
    _id: string;
    points: number;
    badgeTier: string;
    mealsRescued: number;
    co2SavedKg: number;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String },
    fullName: { type: String, required: true },
    phone: { type: String, sparse: true, unique: true },
    avatarUrl: { type: String },
    role: {
      type: String,
      enum: ['CUSTOMER', 'BUSINESS_OWNER', 'BUSINESS_MANAGER', 'BUSINESS_STAFF', 'ADMIN', 'SUPER_ADMIN'],
      default: 'CUSTOMER',
      index: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'DELETED'],
      default: 'ACTIVE',
    },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    googleId: { type: String, sparse: true, unique: true },
    appleId: { type: String, sparse: true, unique: true },
    wallet: { type: UserWalletSchema, default: null },
    loyaltyAccount: { type: LoyaltyAccountSchema, default: null },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Expose _id as id
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
