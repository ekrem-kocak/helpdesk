import { SharedConfigModule } from '@helpdesk/shared/config';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  imports: [SharedConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class ApiDataAccessDbModule {}
