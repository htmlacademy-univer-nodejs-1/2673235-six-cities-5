import { Types } from 'mongoose';
import { UserDB } from '../models/user.js';
import { OfferDB } from '../models/offer.js';
import { CommentDB } from '../models/comment.js';

export type WithId<T> = T & { _id: Types.ObjectId };

export interface IUserRepository {
  create(data: Partial<UserDB>): Promise<WithId<UserDB>>;
  findById(id: string | Types.ObjectId): Promise<WithId<UserDB> | null>;
  findByEmail(email: string): Promise<WithId<UserDB> | null>;
  updateAvatar(
    id: string | Types.ObjectId,
    avatarUrl: string
  ): Promise<WithId<UserDB> | null>;
}

export interface IOfferRepository {
  create(data: Partial<OfferDB>): Promise<OfferDB>;
  updateById(id: string | Types.ObjectId, data: Partial<OfferDB>): Promise<OfferDB | null>;
  removeById(id: string | Types.ObjectId): Promise<void>;
  findById(id: string | Types.ObjectId): Promise<OfferDB | null>;
  list(limit: number, city?: OfferDB['city']): Promise<OfferDB[]>;
  listByIds(ids: (string | Types.ObjectId)[]): Promise<OfferDB[]>;
  listPremiumByCity(city: OfferDB['city'], limit: number): Promise<OfferDB[]>;
  updateStats(id: string | Types.ObjectId, rating: number, commentsCount: number): Promise<void>;
}

export interface ICommentRepository {
  create(data: Partial<CommentDB>): Promise<CommentDB>;
  findLastByOffer(offerId: string | Types.ObjectId, limit: number): Promise<CommentDB[]>;
  calcAvgAndCount(offerId: string | Types.ObjectId): Promise<{ avg: number; count: number }>;
  deleteByOffer(offerId: string | Types.ObjectId): Promise<void>;
}

export interface IFavoriteRepository {
  add(userId: string | Types.ObjectId, offerId: string | Types.ObjectId): Promise<void>;
  remove(userId: string | Types.ObjectId, offerId: string | Types.ObjectId): Promise<void>;
  findOfferIdsByUser(userId: string | Types.ObjectId): Promise<Types.ObjectId[]>;
}
