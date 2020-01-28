import { Controller, Get, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { MoviesService } from "./movies.service";
import { MovieDTO } from "src/dtos/movie.dto";

@Controller('movies')
export class MoviesController {

  constructor(
    private readonly movieService: MoviesService
  ) {}

  @Get()
  async fetchAll(): Promise<MovieDTO[]> {
    const movies = await this.movieService.fetchAll();
    return movies.map(movie => movie.serialize());
  }
}