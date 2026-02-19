import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@helpdesk/api/data-access-db';
import { Role, Status } from '@helpdesk/shared/interfaces';

/**
 * Guard that validates ticket ownership and edit permissions based on user role and ticket status.
 *
 * Permission Rules:
 * - ADMIN: Can edit all tickets regardless of status
 * - SUPPORT: Can edit all tickets except CLOSED ones
 * - USER: Can only edit their own OPEN tickets
 */
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

    if (user.role === Role.SUPPORT) {
      if (ticket.status === Status.CLOSED) {
        throw new ForbiddenException(
          'Closed tickets can only be edited by admins',
        );
      }
      return true;
    }

    if (user.role === Role.USER) {
      if (ticket.userId !== user.id) {
        throw new ForbiddenException('You can only edit your own tickets');
      }

      if (ticket.status !== Status.OPEN) {
        throw new ForbiddenException(
          'You can only edit tickets with OPEN status',
        );
      }

      return true;
    }

    return false;
  }
}
