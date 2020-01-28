import { HttpService, Injectable, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AddMovieDTO } from 'src/dtos/movie/add_movie.dto';
import { AppError } from 'src/error/app.error';
import { CommonErrors } from 'src/error/common_errors';
import { AxiosResponse } from 'axios';
import { OmdbApiResponseDTO } from 'src/dtos/omdb_api_response.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { TransformerService } from '../responder/transformer.service';
import { MovieDTO } from 'src/dtos/movie/movie.dto';
import { Movie } from 'src/entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OmdbClientService {
    constructor(
        private readonly http: HttpService,
        private readonly transformerService: TransformerService,
        @InjectRepository(Movie)
        private readonly movieRepo: Repository<Movie>
    ) { }

    private getByMovieTitle(title: string): Observable<any> {
        return this.http.get('/', { params: { t: title } });
    }

    private getByImdbID(imdbID: string): Observable<any> {
        return this.http.get('/', { params: { i: imdbID } });
    }

    private getMovieDetails(dto: AddMovieDTO): Promise<AxiosResponse<any>> {
        const { imdbId, title } = dto;

        if (imdbId !== undefined) {
            return this.getByImdbID(imdbId).toPromise();
        }

        if (title !== undefined) {
            return this.getByMovieTitle(title).toPromise();
        }

        return Promise.reject(new AppError(
            CommonErrors.BAD_REQUEST,
            HttpStatus.BAD_REQUEST,
            'Request object invalid',
            true
        ))
    }

    async addMovieToDB(dto: AddMovieDTO): Promise<void> {

        
        const { data } = await this.getMovieDetails(dto);
        const omdbResponse: OmdbApiResponseDTO = plainToClass(OmdbApiResponseDTO, data);
        const errors = await validate(omdbResponse);

        if (errors.length > 0) {
            if (omdbResponse.Error) {
                return Promise.reject(new AppError(
                    CommonErrors.OMDB_API_ERROR,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    omdbResponse.Error,
                    true
                ))
            }

            return Promise.reject(new AppError(
                CommonErrors.VALIDATION_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
                'OMDB API response failed validation',
                true
            ))
        }

        const movieDTO: MovieDTO = this.transformerService.transform(omdbResponse);
        const movie: Movie = plainToClass(Movie, movieDTO);

        await this.movieRepo.save(movie);
    }
}

