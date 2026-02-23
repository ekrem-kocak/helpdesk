import { ApiAiModule } from '@helpdesk/api/ai';
import { ApiCacheModule } from '@helpdesk/api/cache';
import { ApiDataAccessDbModule } from '@helpdesk/api/data-access-db';
import { ApiQueueModule } from '@helpdesk/api/queue';
import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TicketOwnershipGuard } from './guards/ticket-ownership.guard';
import { CanChangeStatusGuard } from './guards/can-change-status.guard';

@Module({
  imports: [ApiDataAccessDbModule, ApiCacheModule, ApiQueueModule, ApiAiModule],
  controllers: [TicketController],
  providers: [TicketService, TicketOwnershipGuard, CanChangeStatusGuard],
})
export class ApiTicketsModule {}
