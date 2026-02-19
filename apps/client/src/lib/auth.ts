import { Role, Status, Ticket } from '@helpdesk/shared/interfaces';

/** Minimal user shape for role checks (e.g. AuthUser from store). */
export type UserWithRole = { role: Role } | null | undefined;

/** User with ID for ownership checks. */
export type UserWithOwnership = { id: string; role: Role } | null | undefined;

/** True when the user has the USER role (no admin/support privileges). */
export function isUserRole(user: UserWithRole): boolean {
  return user?.role === Role.USER;
}

/** True when the user can manage ticket actions (e.g. table row actions). */
export function canManageTicketActions(user: UserWithRole): boolean {
  return user != null && user.role !== Role.USER;
}

/**
 * Check if user has permission to edit a ticket based on their role and ownership.
 * This determines visibility of the edit button.
 *
 * Rules:
 * - USER: Can edit only their own tickets
 * - SUPPORT: Can edit all tickets
 * - ADMIN: Can edit all tickets
 */
export function canEditTicketByRole(
  user: UserWithOwnership,
  ticket: Pick<Ticket, 'userId'> | null | undefined,
): boolean {
  if (!user || !ticket) return false;

  if (user.role === Role.ADMIN || user.role === Role.SUPPORT) {
    return true;
  }

  if (user.role === Role.USER) {
    return user.id === ticket.userId;
  }

  return false;
}

/**
 * Check if user can edit a ticket based on its current status.
 * This determines if the edit button should be disabled.
 *
 * Rules:
 * - USER: Can only edit OPEN tickets
 * - SUPPORT: Can edit all except CLOSED tickets
 * - ADMIN: Can edit all tickets (including CLOSED)
 */
export function canEditTicketByStatus(
  user: UserWithRole,
  ticket: Pick<Ticket, 'status'> | null | undefined,
): boolean {
  if (!user || !ticket) return false;

  if (user.role === Role.ADMIN) {
    return true;
  }

  if (user.role === Role.SUPPORT) {
    return ticket.status !== Status.CLOSED;
  }

  if (user.role === Role.USER) {
    return ticket.status === Status.OPEN;
  }

  return false;
}

/**
 * Get the reason why a ticket edit is disabled.
 * Returns empty string if edit is allowed.
 */
export function getTicketEditDisabledReason(
  user: UserWithRole,
  ticket: Pick<Ticket, 'status'> | null | undefined,
): string {
  if (!user || !ticket) return '';

  if (user.role === Role.USER && ticket.status !== Status.OPEN) {
    return 'You can only edit tickets with OPEN status';
  }

  if (user.role === Role.SUPPORT && ticket.status === Status.CLOSED) {
    return 'Closed tickets cannot be edited';
  }

  return '';
}
