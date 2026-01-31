import { AiService } from '@helpdesk/api/ai';
import { Priority, PrismaService } from '@helpdesk/api/data-access-db';
import { QueueService } from '@helpdesk/api/queue';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queueService: QueueService,
    private readonly aiService: AiService,
  ) {}

  async create(userId: string, createTicketDto: CreateTicketDto) {
    const analysis = await this.aiService.analyzeTicket(
      createTicketDto.title,
      createTicketDto.description,
    );

    const ticket = await this.prisma.ticket.create({
      data: {
        title: createTicketDto.title,
        description: createTicketDto.description,
        priority: createTicketDto.priority || (analysis.priority as Priority),
        user: {
          connect: { id: userId },
        },
        aiSuggestedReply: analysis.suggestedReply,
        aiSummary: analysis.summary,
      },
      include: {
        user: true, // return the user who created the ticket
      },
    });

    await this.queueService.addTicketCreatedJob(
      ticket.user.name ?? 'User',
      ticket.user.email,
      ticket.id,
      ticket.title,
    );

    return ticket;
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

  async delete(id: string) {
    return this.prisma.ticket.softDelete({
      where: { id },
    });
  }
}
