import { UserEntity } from '@helpdesk/api/users';
import { Priority, Status, Ticket, User } from '@helpdesk/shared/interfaces';
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

  @ApiProperty({ type: () => UserEntity })
  @Type(() => UserEntity)
  user!: UserEntity;

  @ApiProperty({ nullable: true })
  aiSummary!: string | null;

  @ApiProperty({ nullable: true })
  aiSuggestedReply!: string | null;

  @ApiProperty({ nullable: true })
  deletedAt: Date | null = null;

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}
