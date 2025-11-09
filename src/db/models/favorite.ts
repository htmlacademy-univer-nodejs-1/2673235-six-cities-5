import { Schema, model, Model, Types } from 'mongoose';

export interface FavoriteDB {
  user: Types.ObjectId;
  offer: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    offer: { type: Schema.Types.ObjectId, ref: 'Offer', index: true }
  },
  { timestamps: true }
);

FavoriteSchema.index({ user: 1, offer: 1 }, { unique: true });

export const FavoriteModel = model('Favorite', FavoriteSchema) as unknown as Model<FavoriteDB>;
