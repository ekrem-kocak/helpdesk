import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

export default registerAs<DatabaseConfig>('mail', () => ({
  host: process.env['MAIL_HOST'] as string,
  port: parseInt(process.env['MAIL_PORT'] || '587', 10),
  user: process.env['MAIL_USER'] as string,
  pass: process.env['MAIL_PASS'] as string,
  from: process.env['MAIL_FROM'] as string,
}));
