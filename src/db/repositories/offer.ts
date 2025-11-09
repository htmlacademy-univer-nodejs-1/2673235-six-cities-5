import { Model } from 'mongoose';
import { OfferDB } from '../models/offer.js';
import { IOfferRepository, WithId } from './interfaces.js';

export class OfferRepository implements IOfferRepository {
  constructor(private readonly model: Model<OfferDB>) {}

  async create(data: Partial<OfferDB>): Promise<WithId<OfferDB>> {
    const doc = new this.model(data);
    return (await doc.save()) as unknown as WithId<OfferDB>;
  }

  async findById(id: string): Promise<WithId<OfferDB> | null> {
    const doc = await this.model.findById(id).exec();
    return doc as unknown as WithId<OfferDB> | null;
  }
}
