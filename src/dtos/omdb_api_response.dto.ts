import { Expose, Exclude } from 'class-transformer';
import { IsDefined, IsEmpty, IsNumberString, IsString, IsEmail, IsBooleanString, IsUrl } from 'class-validator';


export class OmdbApiResponseDTO {

  @IsDefined()
  @IsString()
  @Expose()
  Title: string;

  @IsDefined()
  @IsString()
  @Expose()
  Year: string;

  @IsDefined()
  @IsString()
  @Expose()
  Rated: string;

  @IsDefined()
  @IsString()
  @Expose()
  Released: string;

  @IsDefined()
  @IsString()
  @Expose()
  Runtime: string;

  @IsDefined()
  @IsString()
  @Expose()
  Genre: string;

  @IsDefined()
  @IsString()
  @Expose()
  Director: string;

  @IsDefined()
  @IsString()
  @Expose()
  Writer: string;

  @IsDefined()
  @IsString()
  @Expose()
  Actors: string;

  @IsDefined()
  @IsString()
  @Expose()
  Plot: string;

  @IsDefined()
  @IsString()
  @Expose()
  Language: string;

  @IsDefined()
  @IsString()
  @Expose()
  Country: string;

  @IsDefined()
  @IsString()
  @Expose()
  Awards: string;

  @IsDefined()
  @IsUrl()
  @Expose()
  Poster: string;

  @IsDefined()
  @IsNumberString()
  @Expose()
  Metascore: string;

  @IsDefined()
  @IsNumberString()
  @Expose()
  imdbRating: string;

  @IsDefined()
  @IsString()
  @Expose()
  imdbVotes: string;

  @IsDefined()
  @IsString()
  @Expose()
  imdbID: string;

  @IsDefined()
  @IsString()
  @Expose()
  Type: string;

  @IsDefined()
  @IsString()
  @Expose()
  DVD: string;

  @IsDefined()
  @IsString()
  @Expose()
  BoxOffice: string;
  
  @IsDefined()
  @IsString()
  @Expose()
  Production: string;

  @IsDefined()
  @IsString()
  @Expose()
  Website: string;

  @IsEmpty()
  @Exclude()
  readonly Error?: string;
}