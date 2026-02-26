import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@helpdesk/api/data-access-db';
import { Role, Status } from '@helpdesk/shared/interfaces';

/** Validates ownership and edit permissions by role; USER may only edit own OPEN tickets (title/description/status). */
@Injectable()
export class TicketOwnershipGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const ticketId = request.params.id;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.role === Role.ADMIN) {
      return true;
    }

    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    request.ticket = ticket;

    if (user.role === Role.SUPPORT) {
      if (
        ticket.status === Status.CLOSED ||
        ticket.status === Status.CANCELLED
      ) {
        throw new ForbiddenException(
          'Final state tickets (Closed/Cancelled) can only be edited by admins',
        );
      }
      return true;
    }

    if (user.role === Role.USER) {
      if (ticket.userId !== user.id) {
        throw new ForbiddenException('You can only edit your own tickets');
      }

      const body = request.body || {};

      if (ticket.status !== Status.OPEN) {
        throw new ForbiddenException('You can only edit OPEN tickets.');
      }

      const allowedKeys = ['title', 'description', 'status'];
      const bodyKeys = Object.keys(body);
      const hasForbiddenFields = bodyKeys.some(
        (key) => !allowedKeys.includes(key),
      );

      if (hasForbiddenFields) {
        throw new ForbiddenException(
          'You cannot update priority or internal fields as a regular user.',
        );
      }

      return true;
    }

    return false;
  }
}
