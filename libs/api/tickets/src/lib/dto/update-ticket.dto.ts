import { Status } from '@helpdesk/api/data-access-db';
import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateTicketDto } from './create-ticket.dto';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
