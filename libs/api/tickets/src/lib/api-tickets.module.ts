import { ApiCacheModule } from '@helpdesk/api/cache';
import { ApiDataAccessDbModule } from '@helpdesk/api/data-access-db';
import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  imports: [ApiDataAccessDbModule, ApiCacheModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class ApiTicketsModule {}
