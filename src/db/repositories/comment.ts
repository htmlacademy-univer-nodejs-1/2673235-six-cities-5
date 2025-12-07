import { Model, Types } from 'mongoose';
import { CommentDB } from '../models/comment.js';
import { ICommentRepository } from './interfaces.js';

export class CommentRepository implements ICommentRepository {
  constructor(private readonly model: Model<CommentDB>) {}

  async create(data: Partial<CommentDB>): Promise<CommentDB> {
    const doc = await this.model.create(data);
    return doc.toObject();
  }

  async findLastByOffer(offerId: string | Types.ObjectId, limit: number): Promise<CommentDB[]> {
    const docs = await this.model
      .find({ offer: offerId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return docs as CommentDB[];
  }

  async calcAvgAndCount(offerId: string | Types.ObjectId): Promise<{ avg: number; count: number }> {
    const normalizedOfferId =
      typeof offerId === 'string' ? new Types.ObjectId(offerId) : offerId;

    const res = await this.model.aggregate([
      { $match: { offer: normalizedOfferId } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    const row = (res[0] as { avg?: number; count?: number }) || { avg: 0, count: 0 };
    return { avg: row.avg || 0, count: row.count || 0 };
  }

  async deleteByOffer(offerId: string | Types.ObjectId): Promise<void> {
    await this.model.deleteMany({ offer: offerId });
  }
}
