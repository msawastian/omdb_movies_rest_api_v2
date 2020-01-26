import { HttpModule, Module } from '@nestjs/common';

import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { OmdbClientService } from './omdb_client.service';


@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.getConfig('OMDB_API_URL'),
        params: { apikey: configService.getConfig('OMDB_API_KEY') }
      }),
      imports: [ConfigModule],
      extraProviders: [ConfigService],
    }),
  ],
  exports: [OmdbClientService],
  providers: [OmdbClientService],
})
export class OmdbClientModule { }
