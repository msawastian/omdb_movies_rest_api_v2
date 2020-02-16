import { Injectable, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "~entities/comment.entity";
import { Movie } from "~entities/movie.entity";
import { SaveCommentDTO } from "~dtos/comment/save_comment.dto";
import { AppError } from "~error/app.error";
import { CommonErrors } from "~error/common_errors";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepo: Repository<Comment>,
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>
  ) { }

  async fetchAll(order: 'ASC' | 'DESC' = 'ASC'): Promise<Comment[]> {
    return this.commentsRepo.find(
      {
        order: {
          id: order
        }
      }
    );
  }

  async save(saveCommentDTO: SaveCommentDTO): Promise<Comment> {
    const movie = await this.movieRepo.findOne(saveCommentDTO.imdbId);

    if (movie === undefined) {
      return Promise.reject(new AppError(
        CommonErrors.ENTITY_NOT_FOUND,
        HttpStatus.NOT_FOUND,
        `Movie with IMDB ID: ${saveCommentDTO.imdbId} does not exist`,
        true
      ))
    }

    const comment = Comment.deserialize(saveCommentDTO, movie);

    return this.commentsRepo.save(comment);
  }

  async remove(id: number) {
    return this.commentsRepo.delete(id)
  }
}