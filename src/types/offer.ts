import { Amenity, City, Coordinates, HousingType } from './common.js';
import type { User } from './user.js';

export interface Offer {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  previewImage: string;
  photos: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  amenities: Amenity[];
  author: User;
  commentsCount: number;
  coordinates: Coordinates;
}
