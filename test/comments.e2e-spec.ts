import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Movie } from '~entities/movie.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Comment } from '~entities/comment.entity';
import { CommentsService } from '~comments/comments.service';
import { CommentsController } from '~comments/comments.controller';
import { JwtAuthGuard } from '~auth/guards/jwt-auth.guard';

describe('Movies Controller E2E Tests', () => {
  let app: INestApplication;
  let commentsService;

  const createMockCommentsService = () => ({
    fetchAll: jest.fn(),
    save: jest.fn(),
  });

  beforeEach(async () => {
    commentsService = createMockCommentsService();

    const module = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Movie),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: {},
        },
        CommentsService,
        JwtAuthGuard,


      ],
      controllers: [CommentsController],
    })
      .overrideProvider(CommentsService)
      .useValue(commentsService)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true  })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  describe('GET /comments', () => {
    const prepareTestComment = (
      id: number = 0,
      user: string = 'user',
      text: string = 'text',
      rating: number = 1,
      imdbID: string = 'id'
    ) => {
      const comment = new Comment({ id, user, text, rating });
      comment.movie = Promise.resolve(new Movie({ imdbID }));

      return comment;
    };

    it('should return an empty array', async () => {
      jest
        .spyOn(commentsService, 'fetchAll')
        .mockImplementation(async () => []);
      return request(app.getHttpServer())
        .get('/comments')
        .expect(HttpStatus.OK)
        .expect([]);
    });

    it('should return a serialized comment', async () => {
      const comment = prepareTestComment();
      const commentDTO = await comment.serialize();
      jest
        .spyOn(commentsService, 'fetchAll')
        .mockImplementation(async () => [comment]);

      return request(app.getHttpServer())
        .get('/comments')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const [_comment] = body;
          expect(_comment).toMatchObject(commentDTO);
        });
    });

    it('should return a CommentDTO', async () => {
      const comment = prepareTestComment();
      jest
        .spyOn(commentsService, 'fetchAll')
        .mockImplementation(async () => [comment]);

      return request(app.getHttpServer())
        .get('/comments')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const [_comment] = body;
          expect(_comment).toHaveProperty('id');
          expect(_comment).toHaveProperty('user');
          expect(_comment).toHaveProperty('text');
          expect(_comment).toHaveProperty('rating');
        });
    });
  });

  describe('POST /comments', () => {
    const prepareTestCommentSaveBody = (
      imdbId: string = 'id',
      user: string = 'user',
      text: string = 'text',
      rating: number = 1
    ) => {
      return { imdbId, user, text, rating };
    };

    it('should create a comment', async () => {
      const payload = prepareTestCommentSaveBody();
      jest
        .spyOn(commentsService, 'save')
        .mockImplementation(async () => new Comment());

      return request(app.getHttpServer())
        .post('/comments')
        .send(payload)
        .expect(HttpStatus.CREATED);
    });

    it('should return an error when body is missing the required properties', async () => {
      const payload = {};
      jest
        .spyOn(commentsService, 'save')
        .mockImplementation(async () => new Comment());

      return request(app.getHttpServer())
        .post('/comments')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return an error when required property data type is invalid', async () => {
      const payload = { imdbId: 0, user: 0, text: 0, rating: 'abc' };
      jest
        .spyOn(commentsService, 'save')
        .mockImplementation(async () => new Comment());

      return request(app.getHttpServer())
        .post('/comments')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return an error when the comment is empty', async () => {
      const text = '';
      const payload = prepareTestCommentSaveBody('id', 'user', text);
      jest
        .spyOn(commentsService, 'save')
        .mockImplementation(async () => new Comment());

      return request(app.getHttpServer())
        .post('/comments')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return an error when comment is too long', async () => {
      const text =
        'Cupcake ipsum dolor sit amet gummi bears halvah liquorice oat cake. Brownie cookie brownie cookie. Sweet chupa chups gingerbread dessert tart. Sweet roll cookie jelly beans lemon drops pudding donut chocolate donut. Sweet roll sweet jelly-o croissant dragée chocolate bar jelly beans dessert dessert. Chupa chups topping chocolate bar apple pie macaroon carrot cake gummi bears. Muffin topping halvah gummi bears jelly-o cupcake cake sesame snaps apple pie. Cake cake carrot cake toffee powder. Sugar plum croissant cake chupa chups pie. Pastry tiramisu liquorice donut lollipop pie. Candy canes chocolate bar ice cream chocolate cake bonbon. Marzipan cookie candy canes ice cream cotton candy tiramisu tiramisu gummi bears macaroon. Fruitcake icing pie jujubes cotton candy muffin powder tiramisu powder. Soufflé dragée macaroon liquorice tiramisu biscuit topping halvah.';
      const payload = prepareTestCommentSaveBody('id', 'user', text);
      jest
        .spyOn(commentsService, 'save')
        .mockImplementation(async () => new Comment());

      return request(app.getHttpServer())
        .post('/comments')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return an error when the user name is too long', async () => {
      const user = '';
      const payload = prepareTestCommentSaveBody('id', user);
      jest
        .spyOn(commentsService, 'save')
        .mockImplementation(async () => new Comment());

      return request(app.getHttpServer())
        .post('/comments')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return an error when rating is too low', async () => {
      const payload = prepareTestCommentSaveBody('id', 'user', 'text', 0);
      jest
        .spyOn(commentsService, 'save')
        .mockImplementation(async () => new Comment());

      return request(app.getHttpServer())
        .post('/comments')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return an error when rating is too high', async () => {
      const payload = prepareTestCommentSaveBody('id', 'user', 'text', 11);
      jest
        .spyOn(commentsService, 'save')
        .mockImplementation(async () => new Comment());

      return request(app.getHttpServer())
        .post('/comments')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
