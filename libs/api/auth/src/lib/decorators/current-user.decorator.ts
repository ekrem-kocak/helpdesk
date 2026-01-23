import { UserEntity } from '@helpdesk/api/users';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    // The user object returned from the validate method in JwtStrategy is passed here.
    return new UserEntity(request.user);
  },
);
