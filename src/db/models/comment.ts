import { Schema, model, Model, Types } from 'mongoose';

export interface CommentDB {
  text: string;
  rating: number;
  offer: Types.ObjectId;
  author?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema(
  {
    text: String,
    rating: Number,
    offer: { type: Schema.Types.ObjectId, ref: 'Offer' },
    author: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const CommentModel = model('Comment', CommentSchema) as unknown as Model<CommentDB>;
