import mongoose, { Document, Schema, Model, models } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  title: string;
  body: string;
  type:
    | 'ORDER_RESERVED'
    | 'ORDER_PAID'
    | 'READY_FOR_PICKUP'
    | 'ORDER_COMPLETED'
    | 'OFFER_ALERT'
    | 'PROMOTION'
    | 'SYSTEM';
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'ORDER_RESERVED',
        'ORDER_PAID',
        'READY_FOR_PICKUP',
        'ORDER_COMPLETED',
        'OFFER_ALERT',
        'PROMOTION',
        'SYSTEM',
      ],
      required: true,
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Notification: Model<INotification> =
  models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
