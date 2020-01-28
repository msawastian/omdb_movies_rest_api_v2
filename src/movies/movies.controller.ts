import { Controller, Get, Post, HttpCode, HttpStatus, UsePipes, ValidationPipe, Body } from "@nestjs/common";
import { MoviesService } from "./movies.service";
import { MovieDTO } from "../dtos/movie/movie.dto";
import { AddMovieDTO } from "../dtos/movie/add_movie.dto";
import { OmdbClientService } from "../omdb/client/omdb_client.service";

@Controller('movies')
export class MoviesController {

  constructor(
    private readonly movieService: MoviesService,
    private readonly omdbClientService: OmdbClientService
  ) {}

  @Get()
  async fetchAll(): Promise<MovieDTO[]> {
    const movies = await this.movieService.fetchAll();
    return movies.map(movie => movie.serialize());
  }

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(new ValidationPipe())
  delayedFetch(@Body() addMovieDTO: AddMovieDTO): void {
    this.omdbClientService.addMovieToDB(addMovieDTO);
  }
}