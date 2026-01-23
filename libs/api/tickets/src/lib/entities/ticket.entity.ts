import { Priority, Status, Ticket } from '@helpdesk/api/data-access-db';
import { UserEntity } from '@helpdesk/api/users';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TicketEntity implements Ticket {
  @ApiProperty()
  description!: string;

  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ enum: Status })
  status!: Status;

  @ApiProperty({ enum: Priority })
  priority!: Priority;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ type: UserEntity })
  @Type(() => UserEntity)
  user!: UserEntity;

  constructor(partial: Partial<TicketEntity>) {
    Object.assign(this, partial);
  }
}
