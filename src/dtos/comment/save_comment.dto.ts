import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Min,
  Max,
  IsNumber,
} from 'class-validator';

export class SaveCommentDTO {
  @IsString()
  @IsNotEmpty()
  imdbId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  user: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  text: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(10)
  rating: number;

  constructor(init?: Partial<SaveCommentDTO>) {
    Object.assign(this, init);
  }
}
