import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { RateLimiterMiddleware } from './middleware/rate_limiter.middleware';
import { MoviesController } from './movies/movies.controller';
import { CommentsController } from './comments/comments.controller';
import { OmdbClientModule } from './omdb/client/omdb_client.module';
import { MoviesModule } from './movies/movies.module';
import { CommentsModule } from './comments/comments.module';
import { Movie } from './entities/movie.entity';
import { Comment } from './entities/comment.entity';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      // host: 'movies-db-api',
      host: 'localhost',
      port: 3306,
      username: 'user',
      password: 'password',
      database: 'omdb-movie-api-dev',
      synchronize: true,
      entities: [Movie, Comment]
    }),
    ConfigModule,
    OmdbClientModule,
    MoviesModule,
    CommentsModule,
    LoggerModule
  ],
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
