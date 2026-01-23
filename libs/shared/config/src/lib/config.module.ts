import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import securityConfig from './config/security.config';
import { validate } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, securityConfig, redisConfig],
      validate: validate,
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (configService: ConfigService) => ({
        // stores: [
        //   new KeyvRedis({
        //     url: configService.getOrThrow<string>('redis.url'),
        //   }),
        // ],
        url: configService.getOrThrow<string>('redis.url'),
        ttl: configService.getOrThrow<number>('redis.ttl'),
      }),
    }),
  ],
  exports: [],
})
export class SharedConfigModule {}
