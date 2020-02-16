import { Controller, Get, Post, UsePipes, ValidationPipe, Body, Delete, Param, HttpCode, HttpStatus } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentDTO } from "~dtos/comment/comment.dto";
import { SaveCommentDTO } from "~dtos/comment/save_comment.dto";

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Get()
  async fetchAll(): Promise<CommentDTO[]> {
    const comments = await this.commentsService.fetchAll();
    return Promise.all(comments.map(comment => comment.serialize()));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async save(@Body() saveCommentDTO: SaveCommentDTO) {
    await this.commentsService.save(saveCommentDTO);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.commentsService.remove(id);
  }
}