import { Types } from 'mongoose';
import { UserDB } from '../models/user.js';
import { OfferDB } from '../models/offer.js';

export type WithId<T> = T & { _id: Types.ObjectId };

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<WithId<T>>;
  findById(id: string): Promise<WithId<T> | null>;
}

export interface IUserRepository extends IBaseRepository<UserDB> {
  findByEmail(email: string): Promise<WithId<UserDB> | null>;
}

export interface IOfferRepository extends IBaseRepository<OfferDB> {}
