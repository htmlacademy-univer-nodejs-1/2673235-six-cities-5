import type { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { TYPES } from '../container/types.js';
import { Controller } from './controller.js';
import { PinoLoggerService } from '../logger/logger.js';
import { OfferService } from '../services/offer.js';
import type { IUserRepository, WithId } from '../db/repositories/interfaces.js';
import type { OfferDB } from '../db/models/offer.js';
import type { UserDB } from '../db/models/user.js';
import { OfferCreateDto, OfferUpdateDto } from '../dto/offer.js';
import type { OfferListItemDto, OfferFullDto } from '../dto/offer.js';
import type { UserPublicDto } from '../dto/user.js';
import { HttpError } from '../errors/http-error.js';
import { ValidateObjectIdMiddleware } from '../middlewares/validate-object-id.js';
import { ValidateDtoMiddleware } from '../middlewares/validate-dto.js';

type OfferWithId = OfferDB & { _id?: unknown };

@injectable()
export class OfferController extends Controller {
  constructor(
    @inject(TYPES.Logger) logger: PinoLoggerService,
    @inject(TYPES.OfferService) private readonly offers: OfferService,
    @inject(TYPES.UserRepository) private readonly users: IUserRepository
  ) {
    super(logger, '/offers');

    this.addRoute({
      method: 'get',
      path: '/',
      handlers: [asyncHandler(this.list.bind(this))]
    });

    this.addRoute({
      method: 'post',
      path: '/',
      middlewares: [new ValidateDtoMiddleware(OfferCreateDto)],
      handlers: [asyncHandler(this.create.bind(this))]
    });

    this.addRoute({
      method: 'get',
      path: '/premium',
      handlers: [asyncHandler(this.listPremium.bind(this))]
    });

    this.addRoute({
      method: 'get',
      path: '/:offerId',
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
      handlers: [asyncHandler(this.getById.bind(this))]
    });

    this.addRoute({
      method: 'patch',
      path: '/:offerId',
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(OfferUpdateDto)
      ],
      handlers: [asyncHandler(this.update.bind(this))]
    });

    this.addRoute({
      method: 'delete',
      path: '/:offerId',
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
      handlers: [asyncHandler(this.remove.bind(this))]
    });
  }

  private async list(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { city, limit } = req.query;

    const limitRaw = typeof limit === 'string' ? Number(limit) : 60;
    const limitValue = Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : 60;

    const cityValue =
      typeof city === 'string' && city.length
        ? (city as OfferDB['city'])
        : undefined;

    const items = await this.offers.list(limitValue, cityValue);
    const dtos = items.map((offer) => this.toListItemDto(offer));
    this.ok(res, dtos);
  }

  private async create(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const payload = req.body as OfferCreateDto;

    if (!payload.authorId || !Types.ObjectId.isValid(payload.authorId)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'authorId is required and must be a valid ObjectId'
      );
    }

    const authorObjectId = new Types.ObjectId(payload.authorId);

    const data: Partial<OfferDB> = {
      title: payload.title,
      description: payload.description,
      postDate: new Date(payload.postDate || new Date().toISOString()),
      city: payload.city,
      previewImage: payload.previewImage,
      photos: payload.photos,
      isPremium: payload.isPremium,
      isFavorite: payload.isFavorite,
      rating: payload.rating,
      type: payload.type,
      bedrooms: payload.bedrooms,
      maxAdults: payload.maxAdults,
      price: payload.price,
      amenities: payload.amenities,
      coordinates: payload.coordinates,
      author: authorObjectId,
      commentsCount: 0
    };

    const created = await this.offers.create(data);
    const dto = await this.toFullDto(created);
    this.created(res, dto);
  }

  private async listPremium(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { city } = req.query;
    if (typeof city !== 'string' || !city.length) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'city query param is required');
    }

    const items = await this.offers.listPremiumByCity(city as OfferDB['city'], 3);
    const dtos = items.map((offer) => this.toListItemDto(offer));
    this.ok(res, dtos);
  }

  private async getById(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { offerId } = req.params;
    const offer = await this.offers.getById(offerId);
    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found');
    }
    const dto = await this.toFullDto(offer);
    this.ok(res, dto);
  }

  private async update(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { offerId } = req.params;
    const payload = req.body as OfferUpdateDto;

    const data: Partial<OfferDB> = {};

    if (typeof payload.title === 'string') {
      data.title = payload.title;
    }
    if (typeof payload.description === 'string') {
      data.description = payload.description;
    }
    if (typeof payload.postDate === 'string') {
      data.postDate = new Date(payload.postDate);
    }
    if (typeof payload.city === 'string') {
      data.city = payload.city as OfferDB['city'];
    }
    if (typeof payload.previewImage === 'string') {
      data.previewImage = payload.previewImage;
    }
    if (Array.isArray(payload.photos)) {
      data.photos = payload.photos;
    }
    if (typeof payload.isPremium === 'boolean') {
      data.isPremium = payload.isPremium;
    }
    if (typeof payload.isFavorite === 'boolean') {
      data.isFavorite = payload.isFavorite;
    }
    if (typeof payload.rating === 'number') {
      data.rating = payload.rating;
    }
    if (typeof payload.type === 'string') {
      data.type = payload.type as OfferDB['type'];
    }
    if (typeof payload.bedrooms === 'number') {
      data.bedrooms = payload.bedrooms;
    }
    if (typeof payload.maxAdults === 'number') {
      data.maxAdults = payload.maxAdults;
    }
    if (typeof payload.price === 'number') {
      data.price = payload.price;
    }
    if (Array.isArray(payload.amenities)) {
      data.amenities = payload.amenities as OfferDB['amenities'];
    }
    if (payload.coordinates) {
      data.coordinates = payload.coordinates;
    }

    const updated = await this.offers.update(offerId, data);
    if (!updated) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found');
    }

    const dto = await this.toFullDto(updated);
    this.ok(res, dto);
  }

  private async remove(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { offerId } = req.params;
    await this.offers.remove(offerId);
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
      postDate:
        offer.postDate instanceof Date
          ? offer.postDate.toISOString()
          : String(offer.postDate),
      city: offer.city,
      previewImage: offer.previewImage,
      isPremium: offer.isPremium,
      rating: offer.rating,
      commentsCount: offer.commentsCount
    };
  }

  private async toFullDto(offer: OfferDB): Promise<OfferFullDto> {
    const base = this.toListItemDto(offer);
    const user = await this.users.findById(offer.author);
    const authorDto = this.toUserPublic(user);

    return {
      ...base,
      description: offer.description,
      photos: offer.photos,
      bedrooms: offer.bedrooms,
      maxAdults: offer.maxAdults,
      amenities: offer.amenities,
      author: authorDto,
      coordinates: offer.coordinates
    };
  }

  private toUserPublic(user: WithId<UserDB> | null): UserPublicDto {
    if (!user) {
      return {
        id: '',
        name: '',
        email: '',
        type: 'regular'
      };
    }

    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      type: user.type
    };
  }
}
