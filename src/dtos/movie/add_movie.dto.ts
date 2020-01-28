import { ValidateIf, IsNotEmpty } from "class-validator";

export class AddMovieDTO {

  @ValidateIf(o => o.title === undefined)
  @IsNotEmpty()
  imdbId?: string;

  @ValidateIf(o => o.imdbId === undefined)
  @IsNotEmpty()
  title?: string;

  constructor(partial?: Partial<AddMovieDTO>) {
    Object.assign(this, partial);
  }
}