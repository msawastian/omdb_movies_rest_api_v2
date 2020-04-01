import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoviesController } from './movies.controller';
import { Movie } from '~entities/movie.entity';
import { MovieDTO } from '~dtos/movie/movie.dto';
import { AddMovieDTO } from '~dtos/movie/add_movie.dto';
import { OmdbClientService } from '~omdb/client/omdb_client.service';
import { MoviesService } from './movies.service';

describe('Movies Controller', () => {
  let moviesController: MoviesController;
  let moviesService;
  let omdbClientService;

  const createMockMoviesService = () => ({
    fetchAll: jest.fn(),
  });

  const createMockOmdbClientService = () => ({
    addMovieToDB: jest.fn(),
  });

  beforeEach(async () => {
    moviesService = createMockMoviesService();
    omdbClientService = createMockOmdbClientService();

    const module = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Movie),
          useValue: {},
        },
        MoviesService,
        OmdbClientService,
      ],
      controllers: [MoviesController],
    })
      .overrideProvider(MoviesService)
      .useValue(moviesService)
      .overrideProvider(OmdbClientService)
      .useValue(omdbClientService)
      .compile();

    moviesController = module.get<MoviesController>(MoviesController);
  });

  describe('Fetch all Movies', () => {
    it('should return an array of MovieDTOs', async () => {
      const movie = new Movie();
      jest
        .spyOn(moviesService, 'fetchAll')
        .mockImplementation(async () => [movie]);
      const results = await moviesController.fetchAll();

      expect(results).toBeInstanceOf(Array);
      results.map((result) => {
        expect(result).toBeInstanceOf(MovieDTO);
      });
    });

    it('should return an array with proper length', async () => {
      const movie = new Movie();
      jest
        .spyOn(moviesService, 'fetchAll')
        .mockImplementation(async () => [movie]);
      const results = await moviesController.fetchAll();

      expect(results).toHaveLength(1);
    });

    it('should call MovieService.fetchAll() only once', async () => {
      const spy = jest
        .spyOn(moviesService, 'fetchAll')
        .mockImplementation(async () => []);
      await moviesController.fetchAll();

      expect(spy).toBeCalledTimes(1);
    });

    it('should call MovieService.fetchAll() with no parameters', async () => {
      const spy = jest
        .spyOn(moviesService, 'fetchAll')
        .mockImplementation(async () => []);
      await moviesController.fetchAll();

      expect(spy).toHaveBeenCalledWith();
    });
  });

  describe('Add a Movie to the DB', () => {
    it('should return undefined', async () => {
      const mockAddMovieDTO = new AddMovieDTO({ title: 'Die Hard' });
      jest
        .spyOn(omdbClientService, 'addMovieToDB')
        .mockImplementation(async () => null);
      const response = await moviesController.delayedFetch(mockAddMovieDTO);

      expect(response).toBeUndefined();
    });

    it('should call OmdbClientService.addMovieToDB() only once', async () => {
      const mockAddMovieDTO = new AddMovieDTO({ title: 'Die Hard' });
      const spy = jest
        .spyOn(omdbClientService, 'addMovieToDB')
        .mockImplementation(async () => []);
      await moviesController.delayedFetch(mockAddMovieDTO);

      expect(spy).toBeCalledTimes(1);
    });

    it('should call OmdbClientService.addMovieToDB() with an argument >mockAddMovieDTO<', async () => {
      const mockAddMovieDTO = new AddMovieDTO({ title: 'Die Hard' });
      const spy = jest
        .spyOn(omdbClientService, 'addMovieToDB')
        .mockImplementation(async () => []);
      await moviesController.delayedFetch(mockAddMovieDTO);

      expect(spy).toHaveBeenCalledWith(mockAddMovieDTO);
    });
  });
});
