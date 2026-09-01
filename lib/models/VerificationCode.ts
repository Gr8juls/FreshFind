import mongoose, { Document, Schema, Model, models, Types } from 'mongoose';

export interface IVerificationCode extends Document {
  _id: Types.ObjectId;
  identifier: string; // email (lowercased) or phone number (E.164)
  codeHash: string; // bcrypt hash or SHA256 hash of the 6-digit code
  type: 'EMAIL' | 'PHONE';
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationCodeSchema = new Schema<IVerificationCode>(
  {
    identifier: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['EMAIL', 'PHONE'],
      default: 'EMAIL',
    },
    attempts: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // MongoDB TTL index: automatically deletes document when expiresAt is reached
    },
  },
  {
    timestamps: true,
  }
);

const VerificationCode: Model<IVerificationCode> =
  models.VerificationCode || mongoose.model<IVerificationCode>('VerificationCode', VerificationCodeSchema);

export default VerificationCode;
