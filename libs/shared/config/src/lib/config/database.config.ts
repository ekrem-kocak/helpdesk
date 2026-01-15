import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  url: string;
  directUrl: string;
}

export default registerAs<DatabaseConfig>('database', () => ({
  url: process.env['DATABASE_URL'] as string,
  directUrl: process.env['DIRECT_URL'] as string,
}));
