import {
  ApiPaginatedResponse,
  CurrentUser,
  JwtAuthGuard,
} from '@helpdesk/api/shared';
import { PageDto, PageOptionsDto } from '@helpdesk/api/shared';
import { UserEntity } from '@helpdesk/api/users';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketEntity } from './entities/ticket.entity';
import { TicketService } from './ticket.service';

@ApiTags('Tickets')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ticket' })
  async create(
    @CurrentUser() user: UserEntity,
    @Body() createTicketDto: CreateTicketDto,
  ) {
    const ticket = await this.ticketService.create(user.id, createTicketDto);
    return new TicketEntity(ticket);
  }

  // @UseInterceptors(CacheInterceptor)
  // @CacheKey('all-tickets')
  // @CacheTTL(30000)
  @Get()
  @ApiPaginatedResponse(TicketEntity, 'Paginated list of tickets')
  @ApiOperation({ summary: 'Get all tickets (Paginated)' })
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<TicketEntity>> {
    const tickets = await this.ticketService.findAll(pageOptionsDto);

    return new PageDto(
      tickets.data.map((ticket) => new TicketEntity(ticket)),
      tickets.meta,
    );
  }

  @Get('my-tickets')
  @ApiOperation({ summary: 'Get all tickets for the current user' })
  async findAllByUserId(@CurrentUser() user: UserEntity) {
    const tickets = await this.ticketService.findAllByUserId(user.id);
    return tickets.map((ticket) => new TicketEntity(ticket));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a ticket by ID' })
  async findOneById(@Param('id') id: string) {
    const ticket = await this.ticketService.findOneById(id);
    return new TicketEntity(ticket);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ticket by ID' })
  async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    const ticket = await this.ticketService.update(id, updateTicketDto);
    return new TicketEntity(ticket);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ticket by ID' })
  async delete(@Param('id') id: string) {
    return this.ticketService.delete(id);
  }
}
