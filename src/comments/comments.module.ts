import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "../entities/comment.entity";
import { Movie } from "../entities/movie.entity";
import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Movie])],
  providers: [CommentsService],
  controllers: [CommentsController]
})
export class CommentsModule {}