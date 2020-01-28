import { CommentsController } from "./comments.controller";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CommentsService } from "./comments.service";
import { CommentDTO } from "../dtos/comment.dto";
import { Comment } from "../entities/comment.entity";
import { Movie } from "../entities/movie.entity";

describe('Comments Controller', () => {
  let commentsController: CommentsController;
  let commentsService;

  const createMockCommentsService = () => ({
    fetchAll: jest.fn()
  });

  beforeEach(async () => {
    commentsService = createMockCommentsService();

    const module = await Test.createTestingModule(
      {
        providers: [
          {
            provide: getRepositoryToken(Comment),
            useValue: {}
          },
          CommentsService
        ],
        controllers: [CommentsController]
      }
    )
      .overrideProvider(CommentsService)
      .useValue(commentsService)
      .compile();

      commentsController = module.get<CommentsController>(CommentsController);
  });

  describe('Fetch all Comments', () => {
    const prepareTestComment = () => {
      const comment = new Comment();
      comment.movie = Promise.resolve(new Movie());

      return comment;
    }

    it ('should return an array of CommentDTOs', async () => {
      const comment = prepareTestComment();
      jest.spyOn(commentsService, 'fetchAll').mockImplementation(async () => [comment]);
      const results = await commentsController.fetchAll();

      expect(results).toBeInstanceOf(Array);
      results.map(comment => {
        expect(comment).toBeInstanceOf(CommentDTO);
      })
    });
    
    it('should return an array with proper length', async () => {
      const comment = prepareTestComment();
      jest.spyOn(commentsService, 'fetchAll').mockImplementation(async () => [comment]);
      const results = await commentsController.fetchAll();

      expect(results).toHaveLength(1);
    });

    it('should call CommentsService.fetchAll() only once', async () => {
      const spy = jest.spyOn(commentsService, 'fetchAll').mockImplementation(async () => []);
      await commentsController.fetchAll();

      expect(spy).toBeCalledTimes(1);
    })
  });
});