import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Priority, Role, Status } from '@helpdesk/shared/interfaces';

/** Enforces allowed priority modifications per role. Requires request.ticket from TicketOwnershipGuard. */
@Injectable()
export class CanChangePriorityGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const body = request.body;
    const ticket = request.ticket;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // If changing priority is not requested, bypass this guard completely
    if (body?.priority === undefined) {
      return true;
    }

    const targetPriority = body.priority as Priority;
    const validPriorities = Object.values(Priority);
    if (!validPriorities.includes(targetPriority)) {
      throw new ForbiddenException(`Invalid priority value: ${body.priority}`);
    }

    if (user.role === Role.ADMIN) {
      return true; // Admins can change priority anytime
    }

    if (user.role === Role.USER) {
      throw new ForbiddenException('Regular users cannot change priority.');
    }

    if (!ticket) {
      throw new ForbiddenException('Ticket not found for priority validation');
    }

    const currentStatus = ticket.status as Status;

    if (user.role === Role.SUPPORT) {
      if (
        currentStatus === Status.CLOSED ||
        currentStatus === Status.CANCELLED
      ) {
        throw new ForbiddenException(
          'Support cannot modify priority of CLOSED or CANCELLED tickets.',
        );
      }
      return true;
    }

    return false;
  }
}
