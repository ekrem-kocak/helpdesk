import { UsersService } from '@helpdesk/api/users';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthMessages } from '../constants/constants/auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.usersService.findOneById(payload.sub);

    if (!user) {
      throw new UnauthorizedException(AuthMessages.USER_NOT_FOUND);
    }

    return user;
  }
}
