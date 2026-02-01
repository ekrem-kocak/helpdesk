import { Role, User } from '@helpdesk/api/data-access-db';
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

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
