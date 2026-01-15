import { DatabaseConfig } from '@helpdesk/shared/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly configService: ConfigService) {
    const databaseUrl = configService.get<DatabaseConfig>('database')?.url;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not set');
    }
    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });
    super({ adapter });
  }
}
