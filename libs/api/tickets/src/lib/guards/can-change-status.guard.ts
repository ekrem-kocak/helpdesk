import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Role, Status } from '@helpdesk/shared/interfaces';

/**
 * Guard that prevents regular users from changing ticket status.
 *
 * Permission Rules:
 * - USER: Can only change status to CANCELLED (cancelling their own ticket)
 * - SUPPORT/ADMIN: Can change ticket status to any value
 */
@Injectable()
export class CanChangeStatusGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const body = request.body;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // If no status change is requested, allow the request
    // This guard only validates status changes, not other field updates
    if (!body?.status) {
      return true;
    }

    // USER role can only change status to CANCELLED
    if (user.role === Role.USER && body.status !== Status.CANCELLED) {
      throw new ForbiddenException(
        'Regular users can only cancel tickets. For other status changes, please contact support.',
      );
    }

    return true;
  }
}
