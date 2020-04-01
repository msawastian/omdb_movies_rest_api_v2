import { ValidateIf, IsNotEmpty, IsString } from 'class-validator';

export class AddMovieDTO {
  @ValidateIf((o) => o.title === undefined)
  @IsNotEmpty()
  @IsString()
  imdbID?: string;

  @ValidateIf((o) => o.imdbID === undefined)
  @IsNotEmpty()
  @IsString()
  title?: string;

  constructor(init?: Partial<AddMovieDTO>) {
    Object.assign(this, init);
  }
}
