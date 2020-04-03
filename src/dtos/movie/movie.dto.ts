export class MovieDTO {
  imdbID: string;
  title: string;
  year: string | null;
  rated: string | null;
  released: string | null;
  genre: string | null;
  director: string | null;
  writer: string | null;
  actors: string | null;
  plot: string | null;
  language: string | null;
  country: string | null;
  awards: string | null;
  poster: string | null;
  metascore: number | null;
  imdbRating: number | null;
  imdbVotes: number | null;
  type: string | null;
  dvd: string | null;
  boxOffice: string | null;
  production: string | null;
  website: string | null;

  constructor(init?: Partial<MovieDTO>) {
    Object.assign(this, init);
  }
}
