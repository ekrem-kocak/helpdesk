import { ApiCacheModule } from '@helpdesk/api/cache';
import { ApiDataAccessDbModule } from '@helpdesk/api/data-access-db';
import { ApiQueueModule } from '@helpdesk/api/queue';
import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  imports: [ApiDataAccessDbModule, ApiCacheModule, ApiQueueModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class ApiTicketsModule {}
