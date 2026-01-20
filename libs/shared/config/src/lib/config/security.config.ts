import { registerAs } from '@nestjs/config';

export interface SecurityConfig {
  bcryptSaltRounds: number;
}

export default registerAs<SecurityConfig>('security', () => ({
  bcryptSaltRounds: parseInt(process.env['BCRYPT_SALT_ROUNDS'] || '10', 10),
}));
