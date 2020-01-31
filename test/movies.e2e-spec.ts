import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import request from 'supertest';
import { Movie } from "~entities/movie.entity";
import { MoviesService } from "~movies/movies.service";
import { OmdbClientService } from "~omdb/client/omdb_client.service";
import { MoviesController } from "~movies/movies.controller";
import { HttpStatus, INestApplication } from "@nestjs/common";

describe('Movies Controller E2E Tests', () => {
  let app: INestApplication;
  let moviesService;
  let omdbClientService;

  const createMockMoviesService = () => ({
    fetchAll: jest.fn()
  })

  const createMockOmdbClientService = () => ({
    addMovieToDB: jest.fn()
  })

  beforeEach(async () => {
    moviesService = createMockMoviesService();
    omdbClientService = createMockOmdbClientService();

    const module = await Test.createTestingModule(
      {
        providers: [
          {
            provide: getRepositoryToken(Movie),
            useValue: {}
          },
          MoviesService,
          OmdbClientService
        ],
        controllers: [MoviesController]
      }
    )
      .overrideProvider(MoviesService)
      .useValue(moviesService)
      .overrideProvider(OmdbClientService)
      .useValue(omdbClientService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  })

  describe('GET /movies', () => {
    it('should return an empty array', async () => {
      jest.spyOn(moviesService, 'fetchAll').mockImplementation(async () => []);
      return request(app.getHttpServer())
        .get('/movies')
        .expect(HttpStatus.OK)
        .expect([]);
    });

    it('should return a MovieDTO', async () => {
      const movies = [new Movie({
        imdbID: 'id',
        title: 'title'
      })];

      jest.spyOn(moviesService, 'fetchAll').mockImplementation(async () => movies);
      return request(app.getHttpServer())
        .get('/movies')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const [_movie] = body;
          expect(_movie).toHaveProperty('imdbID');
          expect(_movie).toHaveProperty('title');
        });
    });
  });

  describe('POST /movies', () => {
    it('should accept request (title)', async () => {
      const body = { title: 'Test movie' };
      jest.spyOn(omdbClientService, 'addMovieToDB').mockImplementation(async () => null);

      return request(app.getHttpServer())
        .post('/movies')
        .send(body)
        .expect(HttpStatus.ACCEPTED);
    });

    it('should accept request (imdbID)', async () => {
      const body = { imdbID: 'ID' };
      jest.spyOn(omdbClientService, 'addMovieToDB').mockImplementation(async () => undefined);

      return request(app.getHttpServer())
        .post('/movies')
        .send(body)
        .expect(HttpStatus.ACCEPTED);
    });

    it('should return an error when body is missing both required properties', async () => {
      const body = {};
      jest.spyOn(omdbClientService, 'addMovieToDB').mockImplementation(async () => undefined);

      return request(app.getHttpServer())
        .post('/movies')
        .send(body)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return an error when required property data type is invalid', async () => {
      const body = { imdbID: 1 };
      jest.spyOn(omdbClientService, 'addMovieToDB').mockImplementation(async () => undefined);

      return request(app.getHttpServer())
        .post('/movies')
        .send(body)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  afterAll(async () => {
    await app.close();
  });
})
