import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "../entities/comment.entity";

@Injectable()
export class CommentsService {

  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepo: Repository<Comment>,
  ) {}

  async fetchAll(order: 'ASC' | 'DESC' = 'ASC'): Promise<Comment[]> {
    return this.commentsRepo.find(
      {
        order: {
          id: order
        }
      }
    );
  }
}