import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Keyv } from 'keyv';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (configService: ConfigService) => ({
        store: new Keyv({
          store: new KeyvRedis(configService.getOrThrow<string>('redis.url')),
          ttl: configService.getOrThrow<number>('redis.ttl'),
        }),
      }),
    }),
  ],
})
export class ApiCacheModule {}
