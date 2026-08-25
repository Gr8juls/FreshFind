import mongoose, { Document, Schema, Model, models } from 'mongoose';

export interface IFavorite extends Document {
  userId: string;
  businessId: string;
  createdAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    userId: { type: String, required: true, index: true },
    businessId: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

FavoriteSchema.index({ userId: 1, businessId: 1 }, { unique: true });

const Favorite: Model<IFavorite> = models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);

export default Favorite;
