import { Role, User } from '@helpdesk/api/data-access-db';
import { ApiProperty } from '@nestjs/swagger';
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
  password!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ enum: Role })
  role!: Role;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
