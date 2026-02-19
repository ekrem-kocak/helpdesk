import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '@helpdesk/shared/interfaces';

/**
 * Guard that prevents regular users from changing ticket status.
 * Only SUPPORT and ADMIN roles can modify ticket status.
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

    if (body?.status && user.role === Role.USER) {
      throw new ForbiddenException('Users cannot change ticket status');
    }

    return true;
  }
}
