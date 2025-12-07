import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';
import type { UserPublicDto } from './user.js';

export class CoordinatesDto {
  @IsNumber()
    latitude!: number;

  @IsNumber()
    longitude!: number;
}

export class OfferCreateDto {
  @IsString()
  @Length(10, 100)
    title!: string;

  @IsString()
  @Length(20, 1024)
    description!: string;

  @IsString()
    postDate!: string;

  @IsString()
    city!: 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf';

  @IsUrl()
    previewImage!: string;

  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsUrl({}, { each: true })
    photos!: string[];

  @IsBoolean()
    isPremium!: boolean;

  @IsBoolean()
    isFavorite!: boolean;

  @IsNumber()
  @Min(1)
  @Max(5)
    rating!: number;

  @IsString()
    type!: 'apartment' | 'house' | 'room' | 'hotel';

  @IsInt()
  @Min(1)
  @Max(8)
    bedrooms!: number;

  @IsInt()
  @Min(1)
  @Max(10)
    maxAdults!: number;

  @IsInt()
  @Min(100)
  @Max(100000)
    price!: number;

  @IsArray()
  @IsString({ each: true })
    amenities!: Array<
    | 'Breakfast'
    | 'Air conditioning'
    | 'Laptop friendly workspace'
    | 'Baby seat'
    | 'Washer'
    | 'Towels'
    | 'Fridge'
  >;

  @Type(() => CoordinatesDto)
    coordinates!: CoordinatesDto;

  @IsOptional()
  @IsString()
    authorId?: string;
}

export class OfferUpdateDto {
  @IsOptional()
  @IsString()
  @Length(10, 100)
    title?: string;

  @IsOptional()
  @IsString()
  @Length(20, 1024)
    description?: string;

  @IsOptional()
  @IsString()
    postDate?: string;

  @IsOptional()
  @IsString()
    city?: 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf';

  @IsOptional()
  @IsUrl()
    previewImage?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
    photos?: string[];

  @IsOptional()
  @IsBoolean()
    isPremium?: boolean;

  @IsOptional()
  @IsBoolean()
    isFavorite?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
    rating?: number;

  @IsOptional()
  @IsString()
    type?: 'apartment' | 'house' | 'room' | 'hotel';

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
    bedrooms?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
    maxAdults?: number;

  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(100000)
    price?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
    amenities?: Array<
    | 'Breakfast'
    | 'Air conditioning'
    | 'Laptop friendly workspace'
    | 'Baby seat'
    | 'Washer'
    | 'Towels'
    | 'Fridge'
  >;

  @IsOptional()
  @Type(() => CoordinatesDto)
    coordinates?: CoordinatesDto;
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
