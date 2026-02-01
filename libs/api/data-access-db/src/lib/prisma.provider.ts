import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import {
  autoFilterSoftDeletedExtension,
  softDeleteExtension,
} from './prisma.extensions';
import { DatabaseConfig } from '@helpdesk/api/shared';

@Injectable()
export class PrismaProvider
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private static initialized = false;

  constructor(private readonly configService: ConfigService) {
    const databaseUrl =
      configService.getOrThrow<DatabaseConfig>('database.url');

    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });
    super({ adapter });
  }

  async onModuleInit() {
    if (!PrismaProvider.initialized) {
      PrismaProvider.initialized = true;
      await this.$connect();
    }
  }

  async onModuleDestroy() {
    if (PrismaProvider.initialized) {
      PrismaProvider.initialized = false;
      await this.$disconnect();
    }
  }

  withExtensions() {
    return this.$extends(softDeleteExtension).$extends(
      autoFilterSoftDeletedExtension,
    );
  }
}
