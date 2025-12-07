import type { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { TYPES } from '../container/types.js';
import { Controller } from './controller.js';
import { PinoLoggerService } from '../logger/logger.js';
import { FavoriteService } from '../services/favorite.js';
import type { OfferDB } from '../db/models/offer.js';
import type { OfferListItemDto } from '../dto/offer.js';
import { HttpError } from '../errors/http-error.js';

type OfferWithId = OfferDB & { _id?: unknown };

@injectable()
export class FavoriteController extends Controller {
  constructor(
    @inject(TYPES.Logger) logger: PinoLoggerService,
    @inject(TYPES.FavoriteService) private readonly favorites: FavoriteService
  ) {
    super(logger, '/favorites');

    this.addRoute({
      method: 'get',
      path: '/',
      handlers: [asyncHandler(this.list.bind(this))]
    });

    this.addRoute({
      method: 'put',
      path: '/:offerId',
      handlers: [asyncHandler(this.add.bind(this))]
    });

    this.addRoute({
      method: 'delete',
      path: '/:offerId',
      handlers: [asyncHandler(this.remove.bind(this))]
    });
  }

  private getUserIdFromQuery(req: Request): string {
    const userId = typeof req.query.userId === 'string' ? req.query.userId : '';
    if (!userId) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'userId query param is required');
    }
    return userId;
  }

  private async list(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const userId = this.getUserIdFromQuery(req);
    const offers = await this.favorites.list(userId);
    const dtos = offers.map((offer) => this.toListItemDto(offer));
    this.ok(res, dtos);
  }

  private async add(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const userId = this.getUserIdFromQuery(req);
    const { offerId } = req.params;
    await this.favorites.add(userId, offerId);
    this.noContent(res);
  }

  private async remove(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const userId = this.getUserIdFromQuery(req);
    const { offerId } = req.params;
    await this.favorites.remove(userId, offerId);
    this.noContent(res);
  }

  private toListItemDto(offer: OfferDB): OfferListItemDto {
    const withId = offer as OfferWithId;
    const id = withId._id ? String(withId._id) : '';

    return {
      id,
      price: offer.price,
      title: offer.title,
      type: offer.type,
      isFavorite: offer.isFavorite,
      postDate: offer.postDate instanceof Date ? offer.postDate.toISOString() : String(offer.postDate),
      city: offer.city,
      previewImage: offer.previewImage,
      isPremium: offer.isPremium,
      rating: offer.rating,
      commentsCount: offer.commentsCount
    };
  }
}
