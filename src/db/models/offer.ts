import { Schema, model, Model, Types } from 'mongoose';

type CityDB = 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf';
type HousingTypeDB = 'apartment' | 'house' | 'room' | 'hotel';
type AmenityDB =
  | 'Breakfast'
  | 'Air conditioning'
  | 'Laptop friendly workspace'
  | 'Baby seat'
  | 'Washer'
  | 'Towels'
  | 'Fridge';

export interface OfferDB {
  title: string;
  description: string;
  postDate: Date;
  city: CityDB;
  previewImage: string;
  photos: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingTypeDB;
  bedrooms: number;
  maxAdults: number;
  price: number;
  amenities: AmenityDB[];
  author: Types.ObjectId;
  commentsCount: number;
  coordinates: { latitude: number; longitude: number };
  createdAt: Date;
  updatedAt: Date;
}

const CoordinatesSchema = new Schema(
  {
    latitude: Number,
    longitude: Number
  },
  { _id: false }
);

const offerDefinition: Record<string, unknown> = {
  title: String,
  description: String,
  postDate: Date,
  city: String,
  previewImage: String,
  photos: [String],
  isPremium: Boolean,
  isFavorite: Boolean,
  rating: Number,
  type: String,
  bedrooms: Number,
  maxAdults: Number,
  price: Number,
  amenities: [String],
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  commentsCount: Number,
  coordinates: CoordinatesSchema
};

const OfferSchema = new Schema<any>(offerDefinition as any, { timestamps: true });


export const OfferModel = model('Offer', OfferSchema) as unknown as Model<OfferDB>;
