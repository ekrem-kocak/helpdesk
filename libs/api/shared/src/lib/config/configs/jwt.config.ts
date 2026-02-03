import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export default registerAs<JwtConfig>('jwt', () => ({
  secret: process.env['JWT_SECRET'] as string,
  expiresIn: process.env['JWT_EXPIRES_IN'] as string,
  refreshSecret: process.env['REFRESH_TOKEN_SECRET'] as string,
  refreshExpiresIn: process.env['REFRESH_TOKEN_EXPIRES_IN'] as string,
}));
