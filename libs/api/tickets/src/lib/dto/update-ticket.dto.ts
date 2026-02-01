import { Status } from '@helpdesk/shared/interfaces';
import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateTicketDto } from './create-ticket.dto';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
