import { Schema, model, Model } from 'mongoose';

export type UserTypeDB = 'regular' | 'pro';

export interface UserDB {
  name: string;
  email: string;
  avatarUrl?: string;
  password?: string;
  type: UserTypeDB;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, index: true, unique: true },
    avatarUrl: String,
    password: String,
    type: String
  },
  { timestamps: true }
);

export const UserModel = model('User', UserSchema) as unknown as Model<UserDB>;
