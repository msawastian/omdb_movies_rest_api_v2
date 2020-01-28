import { Controller, Get } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentDTO } from "../dtos/comment.dto";

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async fetchAll(): Promise<CommentDTO[]> {
    const comments = await this.commentsService.fetchAll();
    return Promise.all(comments.map(comment => comment.serialize()));
  }
}