import { registerAs } from '@nestjs/config';

export interface RedisConfig {
  url: string;
}

export default registerAs<RedisConfig>('redis', () => ({
  url: process.env['REDIS_URL'] as string,
  ttl: parseInt(process.env['REDIS_TTL'] || '60000', 10),
}));
