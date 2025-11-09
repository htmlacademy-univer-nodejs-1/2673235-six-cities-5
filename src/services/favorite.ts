import { inject, injectable } from 'inversify';
import { TYPES } from '../container/types.js';
import { IFavoriteRepository, IOfferRepository } from '../db/repositories/interfaces.js';
import { OfferDB } from '../db/models/offer.js';

@injectable()
export class FavoriteService {
  constructor(
    @inject(TYPES.FavoriteRepository) private readonly favs: IFavoriteRepository,
    @inject(TYPES.OfferRepository) private readonly offers: IOfferRepository
  ) {}

  async add(userId: string, offerId: string) {
    await this.favs.add(userId, offerId);
  }

  async remove(userId: string, offerId: string) {
    await this.favs.remove(userId, offerId);
  }

  async list(userId: string): Promise<OfferDB[]> {
    const ids = await this.favs.findOfferIdsByUser(userId);
    if (!ids.length) {
      return [];
    }
    return this.offers.listByIds(ids);
  }
}
