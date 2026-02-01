import { SharedConfigModule } from '@helpdesk/api/shared';
import { Module } from '@nestjs/common';
import { PrismaProvider } from './prisma.provider';
import { PrismaService } from './prisma.service';

@Module({
  imports: [SharedConfigModule],
  providers: [PrismaService, PrismaProvider],
  exports: [PrismaService],
})
export class ApiDataAccessDbModule {}
