import { Model, Types } from 'mongoose';
import { IFavoriteRepository } from './interfaces.js';
import { FavoriteDB } from '../models/favorite.js';

export class FavoriteRepository implements IFavoriteRepository {
  constructor(private readonly model: Model<FavoriteDB>) {}

  async add(userId: string | Types.ObjectId, offerId: string | Types.ObjectId): Promise<void> {
    await this.model.updateOne(
      { user: userId, offer: offerId },
      { $setOnInsert: { user: userId, offer: offerId } },
      { upsert: true }
    );
  }

  async remove(userId: string | Types.ObjectId, offerId: string | Types.ObjectId): Promise<void> {
    await this.model.deleteOne({ user: userId, offer: offerId });
  }

  async findOfferIdsByUser(userId: string | Types.ObjectId): Promise<Types.ObjectId[]> {
    const rows = await this.model
      .find({ user: userId })
      .select('offer -_id')
      .lean();

    const typedRows = rows as Array<{ offer: Types.ObjectId }>;
    return typedRows.map((row) => row.offer);
  }
}
