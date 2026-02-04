import { ApiDataAccessDbModule } from '@helpdesk/api/data-access-db';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  imports: [ApiDataAccessDbModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class ApiUsersModule {}
