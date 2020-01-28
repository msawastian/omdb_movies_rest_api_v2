import { Injectable } from "@nestjs/common";
import { MovieDTO } from "src/dtos/movie/movie.dto";
import { OmdbApiResponseDTO } from "src/dtos/omdb_api_response.dto";

@Injectable()
export class TransformerService {

  constructor(private readonly nullString: string) {}

  private parseNull(str: string): string | null {
    return str === this.nullString ? null : str;
  }

  private parseInt(str: string): number | null {
    const parsedInt = parseInt(str, 10);
    return Number.isFinite(parsedInt) ? parsedInt : null;
  }

  private parseFloat(str: string): number | null {
    const parsedFloat = this.parseFloat(str);
    return Number.isFinite(parsedFloat) ? parsedFloat : null;
  }

  private parseDecimalSeparator(str: string): string {
    return str.replace(/,/g, '');
  }

  transform(omdbRes: OmdbApiResponseDTO): MovieDTO {
    return new MovieDTO(
      {
        imdbID: omdbRes.imdbId,
        title: omdbRes.Title,
        year: this.parseNull(omdbRes.Year),
        rated: this.parseNull(omdbRes.Rated),
        released: this.parseNull(omdbRes.Released),
        genre: this.parseNull(omdbRes.Genre),
        director: this.parseNull(omdbRes.Director),
        writer: this.parseNull(omdbRes.Writer),
        actors: this.parseNull(omdbRes.Actors),
        plot: this.parseNull(omdbRes.Plot),
        language: this.parseNull(omdbRes.Language),
        country: this.parseNull(omdbRes.Country),
        awards: this.parseNull(omdbRes.Awards),
        poster: this.parseNull(omdbRes.Poster),
        metascore: this.parseInt(omdbRes.Metascore),
        imdbRating: this.parseFloat(omdbRes.imdbRating),
        imdbVotes: this.parseInt(this.parseDecimalSeparator(omdbRes.imdbVotes)),
        type: this.parseNull(omdbRes.Type),
        dvd: this.parseNull(omdbRes.DVD),
        boxOffice: this.parseNull(omdbRes.BoxOffice),
        production: this.parseNull(omdbRes.Production),
        website: this.parseNull(omdbRes.Website)
      }
    );
  }
  
}