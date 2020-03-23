import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '~config/config.module';
import { RateLimiterMiddleware } from '~middleware/rate_limiter.middleware';
import { MoviesController } from '~movies/movies.controller';
import { CommentsController } from '~comments/comments.controller';
import { OmdbClientModule } from '~omdb/client/omdb_client.module';
import { MoviesModule } from '~movies/movies.module';
import { CommentsModule } from '~comments/comments.module';
import { Movie } from '~entities/movie.entity';
import { Comment } from '~entities/comment.entity';
import { AuthModule } from '~auth/auth.module';
import { UsersModule } from '~users/users.module';
import { AuthController } from '~auth/auth.controller';
import { UsersController } from '~users/users.controller';
import { User } from '~entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.OMDB_MOVIE_API_DB_SERVICE_HOST ? process.env.OMDB_MOVIE_API_DB_SERVICE_HOST : 'movies-db-api',
      port: process.env.OMDB_MOVIE_API_DB_SERVICE_PORT ? parseInt(process.env.OMDB_MOVIE_API_DB_SERVICE_PORT, 10) : 3306,
      username: 'user',
      password: 'password',
      database: 'omdb-movie-api-dev',
      extra: {
        charset: 'utf8mb4_unicode_ci'
      },
      synchronize: true,
      entities: [Movie, Comment, User]
    }),
    ConfigModule,
    OmdbClientModule,
    MoviesModule,
    CommentsModule,
    AuthModule,
    UsersModule],
  controllers: [MoviesController, CommentsController, AuthController, UsersController]
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
