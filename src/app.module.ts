import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ConfigModule } from '~config/config.module';
import { RateLimiterMiddleware } from '~middleware/rate_limiter.middleware';
import { MoviesController } from '~movies/movies.controller';
import { CommentsController } from '~comments/comments.controller';
import { OmdbClientModule } from '~omdb/client/omdb_client.module';
import { MoviesModule } from '~movies/movies.module';
import { CommentsModule } from '~comments/comments.module';
import { Movie } from '~entities/movie.entity';
import { Comment } from '~entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.OMDB_MOVIE_API_DB_SERVICE_HOST ? process.env.OMDB_MOVIE_API_DB_SERVICE_HOST : 'movies-db-api',
      port: process.env.OMDB_MOVIE_API_DB_SERVICE_PORT ? parseInt(process.env.OMDB_MOVIE_API_DB_SERVICE_PORT, 10) : 3306,
      username: 'user',
      password: 'password',
      database: 'omdb-movie-api-dev',
      synchronize: true,
      entities: [Movie, Comment]
    }),
    ConfigModule,
    OmdbClientModule,
    MoviesModule,
    CommentsModule],
  controllers: [MoviesController, CommentsController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimiterMiddleware)
      .forRoutes({
        path: '*', method: RequestMethod.ALL
      });
  }
}
