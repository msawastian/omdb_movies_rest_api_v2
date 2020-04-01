import { HttpService, Injectable, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AppError } from '~error/app.error';
import { CommonErrors } from '~error/common_errors';
import { AddMovieDTO } from '~dtos/movie/add_movie.dto';
import { OmdbApiResponseDTO } from '~dtos/omdb_api_response.dto';
import { MovieDTO } from '~dtos/movie/movie.dto';
import { Movie } from '~entities/movie.entity';
import { TransformerService } from '../utilities/transformer.service';
import { ConfigService } from '~config/config.service';

@Injectable()
export class OmdbClientService {
  private readonly logger: Logger = new Logger(OmdbClientService.name);

  constructor(
    private readonly http: HttpService,
    private readonly transformerService: TransformerService,
    private readonly configService: ConfigService,
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>
  ) {}

  private getByMovieTitle(title: string): Observable<any> {
    return this.http.get('/', {
      params: {
        t: title,
        apikey: this.configService.getConfig('OMDB_API_KEY'),
      },
    });
  }

  private getByImdbID(imdbID: string): Observable<any> {
    return this.http.get('/', {
      params: {
        i: imdbID,
        apikey: this.configService.getConfig('OMDB_API_KEY'),
      },
    });
  }

  private getMovieDetails(dto: AddMovieDTO): Promise<AxiosResponse<any>> {
    const { imdbID, title } = dto;

    if (imdbID !== undefined) {
      return this.getByImdbID(imdbID).toPromise();
    }

    if (title !== undefined) {
      return this.getByMovieTitle(title).toPromise();
    }

    return Promise.reject(
      new AppError(
        CommonErrors.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
        'Request object invalid',
        true
      )
    );
  }

  async addMovieToDB(dto: AddMovieDTO): Promise<void> {
    try {
      const { data } = await this.getMovieDetails(dto);
      const omdbResponse: OmdbApiResponseDTO = plainToClass(
        OmdbApiResponseDTO,
        data
      );

      const errors = await validate(omdbResponse);

      if (errors.length > 0) {
        if (omdbResponse.Error) {
          return Promise.reject(
            new AppError(
              CommonErrors.OMDB_API_ERROR,
              HttpStatus.INTERNAL_SERVER_ERROR,
              omdbResponse.Error,
              true
            )
          );
        }
        return Promise.reject(
          new AppError(
            CommonErrors.VALIDATION_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR,
            errors.toString(),
            true
          )
        );
      }

      const movieDTO: MovieDTO = this.transformerService.transform(
        omdbResponse
      );
      const movie: Movie = plainToClass(Movie, movieDTO);
      await this.movieRepo.save(movie);
    } catch (error) {
      this.logger.error(error.toString());
    }
  }
}
