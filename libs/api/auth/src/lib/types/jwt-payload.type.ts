import { Role } from '@helpdesk/shared/interfaces';

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
  jti?: string; // may not exist in Access Token, so it's optional
};
