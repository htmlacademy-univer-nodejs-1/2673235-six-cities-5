import type { UserPublicDto } from './user.js';

export interface OfferCreateDto {
  title: string;
  description: string;
  postDate: string;
  city: 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf';
  previewImage: string;
  photos: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: 'apartment' | 'house' | 'room' | 'hotel';
  bedrooms: number;
  maxAdults: number;
  price: number;
  amenities: Array<
    | 'Breakfast'
    | 'Air conditioning'
    | 'Laptop friendly workspace'
    | 'Baby seat'
    | 'Washer'
    | 'Towels'
    | 'Fridge'
  >;
  coordinates: { latitude: number; longitude: number };
  authorId?: string;
}

export interface OfferUpdateDto {
  title?: string;
  description?: string;
  postDate?: string;
  city?: 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf';
  previewImage?: string;
  photos?: string[];
  isPremium?: boolean;
  isFavorite?: boolean;
  rating?: number;
  type?: 'apartment' | 'house' | 'room' | 'hotel';
  bedrooms?: number;
  maxAdults?: number;
  price?: number;
  amenities?: Array<
    | 'Breakfast'
    | 'Air conditioning'
    | 'Laptop friendly workspace'
    | 'Baby seat'
    | 'Washer'
    | 'Towels'
    | 'Fridge'
  >;
  coordinates?: { latitude: number; longitude: number };
}

export interface OfferListItemDto {
  id: string;
  price: number;
  title: string;
  type: 'apartment' | 'house' | 'room' | 'hotel';
  isFavorite: boolean;
  postDate: string;
  city: 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf';
  previewImage: string;
  isPremium: boolean;
  rating: number;
  commentsCount: number;
}

export interface OfferFullDto extends OfferListItemDto {
  description: string;
  photos: string[];
  bedrooms: number;
  maxAdults: number;
  amenities: Array<
    | 'Breakfast'
    | 'Air conditioning'
    | 'Laptop friendly workspace'
    | 'Baby seat'
    | 'Washer'
    | 'Towels'
    | 'Fridge'
  >;
  author: UserPublicDto;
  coordinates: { latitude: number; longitude: number };
}
