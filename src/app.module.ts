import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataModule } from './data/data.module';
import { BitstampGateway } from './bitstamp.gateway';
import { CacheService } from './cache/cache.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    DataModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          store: redisStore,
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, BitstampGateway, CacheService],
})
export class AppModule {}
