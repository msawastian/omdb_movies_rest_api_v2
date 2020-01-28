import { MoviesController } from "./movies.controller";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Movie } from "../entities/movie.entity";
import { MoviesService } from "./movies.service";
import { MovieDTO } from "../dtos/movie/movie.dto";

describe('Movies Controller', () => {
  let moviesController: MoviesController;
  let moviesService;

  const createMockMoviesService = () => ({
    fetchAll: jest.fn()
  })

  beforeEach(async () => {
    moviesService = createMockMoviesService();

    const module = await Test.createTestingModule(
      {
        providers: [
          {
            provide: getRepositoryToken(Movie),
            useValue: {}
          },
          MoviesService
        ],
        controllers: [MoviesController]
      }
    )
    .overrideProvider(MoviesService)
    .useValue(moviesService)
    .compile();

    moviesController = module.get<MoviesController>(MoviesController);
  })

  describe('Fetch all Movies', () => {
    
    it('should return an array of MovieDTOs', async () => {
      const movie = new Movie();
      jest.spyOn(moviesService, 'fetchAll').mockImplementation(async () => [movie]);
      const results = await moviesController.fetchAll();
      
      expect(results).toBeInstanceOf(Array);
      results.map(result => {
        expect(result).toBeInstanceOf(MovieDTO);
      })
    });

    it('should return an array with proper length', async () => {
      const movie = new Movie();
      jest.spyOn(moviesService, 'fetchAll').mockImplementation(async () => [movie]);
      const results = await moviesController.fetchAll();

      expect(results).toHaveLength(1);
    });

    it('should call MovieService.fetchAll() only once', async () => {
      const spy = jest.spyOn(moviesService, 'fetchAll').mockImplementation(async () => []);
      await moviesController.fetchAll();

      expect(spy).toBeCalledTimes(1);
    });
  })
});