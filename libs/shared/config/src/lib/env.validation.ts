// libs/shared/config/src/lib/env.validation.ts
import { plainToClass } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  DIRECT_URL!: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN!: string;

  @IsNumber()
  @IsNotEmpty()
  BCRYPT_SALT_ROUNDS!: number;

  @IsString()
  @IsNotEmpty()
  REDIS_URL!: string;

  @IsNumber()
  @IsNotEmpty()
  REDIS_TTL!: number;

  @IsString()
  @IsNotEmpty()
  MAIL_HOST!: string;

  @IsNumber()
  @IsNotEmpty()
  MAIL_PORT!: number;

  @IsString()
  @IsNotEmpty()
  MAIL_USER!: string;

  @IsString()
  @IsNotEmpty()
  MAIL_PASS!: string;

  @IsString()
  @IsNotEmpty()
  MAIL_FROM!: string;

  @IsString()
  @IsNotEmpty()
  GEMINI_API_KEY!: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      `Config validation error:\n${errors
        .map((err) => Object.values(err.constraints || {}).join(', '))
        .join('\n')}`,
    );
  }

  return validatedConfig;
}
