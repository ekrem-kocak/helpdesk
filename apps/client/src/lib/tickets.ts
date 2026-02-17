import type { Status, Priority } from '@helpdesk/shared/interfaces';

export type StatusConfig = Record<Status, { label: string; className: string }>;

export type PriorityConfig = Record<
  Priority,
  { label: string; className: string }
>;

/** Single source of truth for ticket status display (table, cards, badges). */
export const statusConfig: StatusConfig = {
  OPEN: {
    label: 'Open',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  RESOLVED: {
    label: 'Resolved',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  CLOSED: {
    label: 'Closed',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
};

/** Single source of truth for ticket priority display. */
export const priorityConfig: PriorityConfig = {
  LOW: { label: 'Low', className: 'text-muted-foreground' },
  MEDIUM: { label: 'Medium', className: 'text-yellow-600' },
  HIGH: { label: 'High', className: 'text-orange-600 font-semibold' },
  URGENT: { label: 'Urgent', className: 'text-red-600 font-bold' },
};
