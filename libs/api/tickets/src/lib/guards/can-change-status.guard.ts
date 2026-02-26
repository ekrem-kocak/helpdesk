import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Role, Status } from '@helpdesk/shared/interfaces';

/** Enforces allowed status transitions per role. Requires request.ticket from TicketOwnershipGuard. */
@Injectable()
export class CanChangeStatusGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const body = request.body;
    const ticket = request.ticket;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!body?.status) {
      return true;
    }

    const targetStatus = body.status as Status;
    const validStatuses = Object.values(Status);
    if (!validStatuses.includes(targetStatus)) {
      throw new ForbiddenException(`Invalid status value: ${body.status}`);
    }

    if (user.role === Role.ADMIN) {
      return true;
    }

    if (!ticket) {
      throw new ForbiddenException('Ticket not found for status validation');
    }

    const currentStatus = ticket.status as Status;

    if (currentStatus === targetStatus) {
      return true;
    }

    if (user.role === Role.USER) {
      if (currentStatus === Status.OPEN && targetStatus === Status.CANCELLED) {
        return true;
      }
      throw new ForbiddenException(
        'Regular users can only cancel OPEN tickets.',
      );
    }

    if (user.role === Role.SUPPORT) {
      if (
        currentStatus === Status.CLOSED ||
        currentStatus === Status.CANCELLED
      ) {
        throw new ForbiddenException(
          'Support cannot modify CLOSED or CANCELLED tickets.',
        );
      }

      const validSupportTransitions: Record<Status, Status[]> = {
        [Status.OPEN]: [Status.IN_PROGRESS, Status.RESOLVED, Status.CANCELLED],
        [Status.IN_PROGRESS]: [Status.OPEN, Status.RESOLVED, Status.CANCELLED],
        [Status.RESOLVED]: [Status.IN_PROGRESS, Status.CLOSED],
        [Status.CANCELLED]: [],
        [Status.CLOSED]: [],
      };

      if (!validSupportTransitions[currentStatus]?.includes(targetStatus)) {
        throw new ForbiddenException(
          `Invalid status transition from ${currentStatus} to ${targetStatus} for Support role.`,
        );
      }
      return true;
    }

    return false;
  }
}
