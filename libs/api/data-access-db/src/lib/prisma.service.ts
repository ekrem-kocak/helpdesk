import { DatabaseConfig } from '@helpdesk/shared/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly configService: ConfigService) {
    const databaseUrl =
      configService.getOrThrow<DatabaseConfig>('database')?.url;

    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });
    super({ adapter });
  }
}
