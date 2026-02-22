import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PageOptionsDto } from '@helpdesk/api/shared';
import { Priority, Status } from '@helpdesk/shared/interfaces';

export enum TicketOrderBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  TITLE = 'title',
  STATUS = 'status',
  PRIORITY = 'priority',
}

export class TicketPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: TicketOrderBy,
    default: TicketOrderBy.CREATED_AT,
  })
  @IsEnum(TicketOrderBy)
  @IsOptional()
  readonly orderBy?: TicketOrderBy = TicketOrderBy.CREATED_AT;

  @ApiPropertyOptional({ description: 'Search in title and description' })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  readonly search?: string;

  @ApiPropertyOptional({ enum: Status })
  @IsEnum(Status)
  @IsOptional()
  readonly status?: Status;

  @ApiPropertyOptional({ enum: Priority })
  @IsEnum(Priority)
  @IsOptional()
  readonly priority?: Priority;
}
