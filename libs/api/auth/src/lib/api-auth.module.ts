import { ApiDataAccessDbModule } from '@helpdesk/api/data-access-db';
import { ApiUsersModule } from '@helpdesk/api/users';
import { SharedConfigModule } from '@helpdesk/shared/config';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ApiUsersModule,
    ApiDataAccessDbModule,

    PassportModule,
    JwtModule.registerAsync({
      imports: [SharedConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('jwt.secret'),
        signOptions: { expiresIn: configService.getOrThrow('jwt.expiresIn') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class ApiAuthModule {}
