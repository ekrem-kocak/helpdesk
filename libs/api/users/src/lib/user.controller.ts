import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiPaginatedResponse,
  JwtAuthGuard,
  RolesGuard,
  Roles,
} from '@helpdesk/api/shared';
import { Role } from '@helpdesk/shared/interfaces';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from '@helpdesk/api/shared';
import { UserEntity } from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users (Paginated)' })
  @ApiPaginatedResponse(UserEntity, 'Paginated list of users')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserEntity>> {
    const users = await this.usersService.findAll(pageOptionsDto);

    return new PageDto(
      users.data.map((user) => new UserEntity(user)),
      users.meta,
    );
  }
}
