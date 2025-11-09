import { Model } from 'mongoose';
import { UserDB } from '../models/user.js';
import { IUserRepository, WithId } from './interfaces.js';

export class UserRepository implements IUserRepository {
  constructor(private readonly model: Model<UserDB>) {}

  async create(data: Partial<UserDB>): Promise<WithId<UserDB>> {
    const doc = new this.model(data);
    return (await doc.save()) as unknown as WithId<UserDB>;
  }

  async findById(id: string): Promise<WithId<UserDB> | null> {
    const doc = await this.model.findById(id).exec();
    return doc as unknown as WithId<UserDB> | null;
  }

  async findByEmail(email: string): Promise<WithId<UserDB> | null> {
    const doc = await this.model.findOne({ email }).exec();
    return doc as unknown as WithId<UserDB> | null;
  }
}
