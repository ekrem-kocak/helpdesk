import { ApiAuthModule } from '@helpdesk/api/auth';
import { ApiTicketsModule } from '@helpdesk/api/tickets';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ApiAuthModule, ApiTicketsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
