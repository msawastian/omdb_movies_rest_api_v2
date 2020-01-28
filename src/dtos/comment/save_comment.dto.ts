import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class SaveCommentDTO {

  @IsString()
  @IsNotEmpty()
  imdbId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  user: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  text: string

  constructor(init?: Partial<SaveCommentDTO>) {
    Object.assign(this, init);
  }
}