import type { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';
import { TYPES } from '../container/types.js';
import { Controller } from './controller.js';
import { PinoLoggerService } from '../logger/logger.js';
import { CommentService } from '../services/comment.js';
import { OfferService } from '../services/offer.js';
import type { IUserRepository, WithId } from '../db/repositories/interfaces.js';
import type { CommentDB } from '../db/models/comment.js';
import type { UserDB } from '../db/models/user.js';
import type { CommentDto } from '../dto/comment.js';
import type { UserPublicDto } from '../dto/user.js';
import { ValidateObjectIdMiddleware } from '../middlewares/validate-object-id.js';
import { ValidateDtoMiddleware } from '../middlewares/validate-dto.js';
import { CommentCreateDto } from '../dto/comment.js';
import { DocumentExistsMiddleware } from '../middlewares/document-exists.js';

type CommentWithId = CommentDB & { _id?: unknown };

@injectable()
export class CommentController extends Controller {
  constructor(
    @inject(TYPES.Logger) logger: PinoLoggerService,
    @inject(TYPES.CommentService) private readonly comments: CommentService,
    @inject(TYPES.OfferService) private readonly offers: OfferService,
    @inject(TYPES.UserRepository) private readonly users: IUserRepository
  ) {
    super(logger, '/offers');

    this.addRoute({
      method: 'get',
      path: '/:offerId/comments',
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware('offerId', this.offers, 'Offer not found')
      ],
      handlers: [asyncHandler(this.index.bind(this))]
    });

    this.addRoute({
      method: 'post',
      path: '/:offerId/comments',
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(CommentCreateDto),
        new DocumentExistsMiddleware('offerId', this.offers, 'Offer not found')
      ],
      handlers: [asyncHandler(this.create.bind(this))]
    });
  }

  private async index(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { offerId } = req.params;

    const items = await this.comments.findLastByOffer(offerId, 50);
    const dtos = await Promise.all(items.map((c) => this.toCommentDto(c)));
    this.ok(res, dtos);
  }

  private async create(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { offerId } = req.params;
    const payload = req.body as CommentCreateDto;

    const data: Partial<CommentDB> = {
      text: payload.text,
      rating: payload.rating,
      offer: new Types.ObjectId(offerId)
    };

    const created = await this.comments.createAndUpdateStats(data);
    const dto = await this.toCommentDto(created);
    this.created(res, dto);
  }

  private async toCommentDto(comment: CommentDB): Promise<CommentDto> {
    const withId = comment as CommentWithId;
    const id = withId._id ? String(withId._id) : '';

    let user: WithId<UserDB> | null = null;
    if (comment.author) {
      user = await this.users.findById(comment.author);
    }

    const authorDto = this.toUserPublic(user);

    return {
      id,
      text: comment.text,
      rating: comment.rating,
      author: authorDto,
      createdAt:
        comment.createdAt instanceof Date
          ? comment.createdAt.toISOString()
          : new Date(comment.createdAt).toISOString()
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
