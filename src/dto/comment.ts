import { IsInt, IsString, Length, Max, Min } from 'class-validator';
import type { UserPublicDto } from './user.js';

export class CommentCreateDto {
  @IsString()
  @Length(5, 1024)
    text!: string;

  @IsInt()
  @Min(1)
  @Max(5)
    rating!: number;
}

export interface CommentDto {
  id: string;
  text: string;
  rating: number;
  author: UserPublicDto;
  createdAt: string;
}
