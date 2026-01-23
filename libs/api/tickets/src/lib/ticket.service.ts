import { Priority, PrismaService } from '@helpdesk/api/data-access-db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createTicketDto: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: {
        title: createTicketDto.title,
        description: createTicketDto.description,
        priority: createTicketDto.priority || Priority.MEDIUM,
        user: {
          connect: { id: userId },
        },
      },
      include: {
        user: true, // return the user who created the ticket
      },
    });
  }

  async findAll() {
    return this.prisma.ticket.findMany({
      include: {
        user: true,
      },
    });
  }

  async findAllByUserId(userId: string) {
    return this.prisma.ticket.findMany({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  async findOneById(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    return this.prisma.ticket.update({
      where: { id },
      data: updateTicketDto,
    });
  }
}
