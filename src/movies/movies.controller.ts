import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieDTO } from '~dtos/movie/movie.dto';
import { AddMovieDTO } from '~dtos/movie/add_movie.dto';
import { OmdbClientService } from '~omdb/client/omdb_client.service';
import { JwtAuthGuard } from '~auth/guards/jwt-auth.guard';

@Controller('movies')
export class MoviesController {
  constructor(
    private readonly movieService: MoviesService,
    private readonly omdbClientService: OmdbClientService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async fetchAll(): Promise<MovieDTO[]> {
    const movies = await this.movieService.fetchAll();
    return movies.map((movie) => movie.serialize());
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(new ValidationPipe())
  delayedFetch(@Body() addMovieDTO: AddMovieDTO): void {
    this.omdbClientService.addMovieToDB(addMovieDTO);
  }
}
