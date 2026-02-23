import { AiService } from '@helpdesk/api/ai';
import { Prisma, PrismaService, Ticket } from '@helpdesk/api/data-access-db';
import { QueueService } from '@helpdesk/api/queue';
import { PageDto, PageMetaDto } from '@helpdesk/api/shared';
import { Priority, Role, User } from '@helpdesk/shared/interfaces';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketPageOptionsDto } from './dto/ticket-page-options.dto';
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
        user: true,
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

  async findAll(
    pageOptionsDto: TicketPageOptionsDto,
    user: User,
  ): Promise<PageDto<Ticket>> {
    const where: Prisma.TicketWhereInput = {};

    if (user.role === Role.USER) {
      where.userId = user.id;
    }

    if (pageOptionsDto.status != null) {
      where.status = pageOptionsDto.status;
    }
    if (pageOptionsDto.priority != null) {
      where.priority = pageOptionsDto.priority;
    }
    if (pageOptionsDto.search?.trim()) {
      const term = pageOptionsDto.search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ];
    }

    const orderByField = pageOptionsDto.orderBy ?? 'createdAt';
    const orderBy = {
      [orderByField]: pageOptionsDto.order,
    } as Prisma.TicketOrderByWithRelationInput;

    const [data, itemCount] = await this.prisma.$transaction([
      this.prisma.ticket.findMany({
        where,
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        orderBy,
        include: {
          user: true,
        },
      }),
      this.prisma.ticket.count({ where }),
    ]);

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(data, pageMetaDto);
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
    const ticket = await this.prisma.ticket.findFirst({
      where: { id, deletedAt: null },
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
    const existing = await this.prisma.ticket.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Ticket not found');
    }
    return this.prisma.ticket.update({
      where: { id },
      data: updateTicketDto,
      include: {
        user: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      select: { id: true, deletedAt: true },
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    if (ticket.deletedAt) {
      throw new NotFoundException('Ticket not found');
    }
    await this.prisma.ticket.softDelete({ where: { id } });
  }
}
