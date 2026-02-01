import { Role, User } from '@helpdesk/shared/interfaces';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string | null;

  // Exclude password from JSON response
  @Exclude()
  @ApiHideProperty()
  password!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ enum: Role })
  role!: Role;

  @ApiProperty({ nullable: true })
  deletedAt: Date | null = null;

  // We use 'any' due to enum conflicts (Prisma vs Shared)
  constructor(partial: any) {
    Object.assign(this, partial);
  }
}
