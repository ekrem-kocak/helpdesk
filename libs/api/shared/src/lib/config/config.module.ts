import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import aiConfig from './configs/ai.config';
import databaseConfig from './configs/database.config';
import jwtConfig from './configs/jwt.config';
import mailConfig from './configs/mail.config';
import redisConfig from './configs/redis.config';
import securityConfig from './configs/security.config';
import { validate } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        jwtConfig,
        securityConfig,
        redisConfig,
        mailConfig,
        aiConfig,
      ],
      validate: validate,
    }),
  ],
  exports: [],
})
export class SharedConfigModule {}
