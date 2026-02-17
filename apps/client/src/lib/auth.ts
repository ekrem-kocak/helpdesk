import { Role } from '@helpdesk/shared/interfaces';

/** Minimal user shape for role checks (e.g. AuthUser from store). */
export type UserWithRole = { role: Role } | null | undefined;

/** True when the user has the USER role (no admin/support privileges). */
export function isUserRole(user: UserWithRole): boolean {
  return user?.role === Role.USER;
}

/** True when the user can manage ticket actions (e.g. table row actions). */
export function canManageTicketActions(user: UserWithRole): boolean {
  return user != null && user.role !== Role.USER;
}
