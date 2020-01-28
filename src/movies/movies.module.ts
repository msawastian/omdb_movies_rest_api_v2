import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MoviesService } from "./movies.service";
import { MoviesController } from "./movies.controller";
import { Movie } from "../entities/movie.entity";
import { OmdbClientModule } from "src/omdb/client/omdb_client.module";

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), OmdbClientModule],
  providers: [MoviesService],
  controllers: [MoviesController],
  exports: [MoviesService]
})
export class MoviesModule {}