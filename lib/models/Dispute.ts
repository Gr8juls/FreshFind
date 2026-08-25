import mongoose, { Document, Schema, Model, models, Types } from 'mongoose';

export interface IDispute extends Document {
  _id: Types.ObjectId;
  orderId: string;
  orderNumber?: string; // denormalized for quick display
  userId: string;
  reason: string;
  description: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DisputeSchema = new Schema<IDispute>(
  {
    orderId: { type: String, required: true, index: true },
    orderNumber: String,
    userId: { type: String, required: true, index: true },
    reason: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'],
      default: 'OPEN',
    },
    resolution: String,
  },
  { timestamps: true }
);

const Dispute: Model<IDispute> = models.Dispute || mongoose.model<IDispute>('Dispute', DisputeSchema);

export default Dispute;
