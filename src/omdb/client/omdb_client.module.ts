import { HttpModule, Module } from '@nestjs/common';

import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { OmdbClientService } from './omdb_client.service';
import { UtilitiesModule } from '../utilities/utilities.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../../entities/movie.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    ConfigModule,
    UtilitiesModule,
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.getConfig('OMDB_API_URL'),
        params: { apikey: configService.getConfig('OMDB_API_KEY') }
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  exports: [OmdbClientService],
  providers: [OmdbClientService],
})
export class OmdbClientModule { }
