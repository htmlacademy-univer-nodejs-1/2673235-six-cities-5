import { inject, injectable } from 'inversify';
import { TYPES } from '../container/types.js';
import { ICommentRepository } from '../db/repositories/interfaces.js';
import { CommentDB } from '../db/models/comment.js';
import { OfferService } from './offer.js';

@injectable()
export class CommentService {
  constructor(
    @inject(TYPES.CommentRepository) private readonly comments: ICommentRepository,
    @inject(TYPES.OfferService) private readonly offers: OfferService
  ) {}

  async createAndUpdateStats(data: Partial<CommentDB>) {
    const created = await this.comments.create(data);
    await this.offers.recalcStats(String(created.offer));
    return created;
  }

  findLastByOffer(offerId: string, limit: number) {
    return this.comments.findLastByOffer(offerId, limit);
  }
}
