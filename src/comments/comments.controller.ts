import { Controller, Get, Post, UsePipes, ValidationPipe, Body, Delete, Param, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentDTO } from "~dtos/comment/comment.dto";
import { SaveCommentDTO } from "~dtos/comment/save_comment.dto";
import { JwtAuthGuard } from "~auth/guards/jwt-auth.guard";

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async fetchAll(): Promise<CommentDTO[]> {
    const comments = await this.commentsService.fetchAll();
    return Promise.all(comments.map(comment => comment.serialize()));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  async save(@Body() saveCommentDTO: SaveCommentDTO) {
    await this.commentsService.save(saveCommentDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.commentsService.remove(id);
  }
}