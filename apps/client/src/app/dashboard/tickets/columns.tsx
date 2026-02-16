'use client';

import { createColumnHelper } from '@tanstack/react-table';
import {
  type Ticket,
  type Status as TicketStatus,
  type Priority as TicketPriority,
  Role,
} from '@helpdesk/shared/interfaces';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@helpdesk/shared/ui';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

// ============================================
// STATUS & PRIORITY CONFIG (exported for use in UserTicketsView)
// ============================================

export const statusConfig: Record<
  TicketStatus,
  { label: string; className: string }
> = {
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

export const priorityConfig: Record<
  TicketPriority,
  { label: string; className: string }
> = {
  LOW: { label: 'Low', className: 'text-muted-foreground' },
  MEDIUM: { label: 'Medium', className: 'text-yellow-600' },
  HIGH: { label: 'High', className: 'text-orange-600 font-semibold' },
  URGENT: { label: 'Urgent', className: 'text-red-600 font-bold' },
};

// ============================================
// SORTABLE HEADER HELPER
// ============================================

function SortableHeader({
  column,
  label,
}: {
  column: {
    toggleSorting: (desc?: boolean) => void;
    getIsSorted: () => false | 'asc' | 'desc';
  };
  label: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {label}
      <ArrowUpDown className="ml-2 h-3 w-3" />
    </Button>
  );
}

// ============================================
// COLUMN DEFINITIONS (Type-safe with createColumnHelper)
// ============================================

const columnHelper = createColumnHelper<Ticket>();

export const getColumns = (userRole: Role | undefined) => [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => (
      <span className="text-muted-foreground font-mono text-xs">
        #{info.getValue()}
      </span>
    ),
    enableSorting: false,
  }),

  columnHelper.accessor('title', {
    header: ({ column }) => <SortableHeader column={column} label="Title" />,
    cell: (info) => (
      <span className="block max-w-[300px] truncate font-medium">
        {info.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const config = statusConfig[info.getValue()];
      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
    filterFn: 'equals',
  }),

  columnHelper.accessor('priority', {
    header: ({ column }) => <SortableHeader column={column} label="Priority" />,
    cell: (info) => {
      const config = priorityConfig[info.getValue()];
      return <span className={config.className}>{config.label}</span>;
    },
  }),

  columnHelper.accessor('createdAt', {
    header: ({ column }) => (
      <SortableHeader column={column} label="Created At" />
    ),
    cell: (info) => (
      <span className="text-muted-foreground text-sm">
        {new Date(info.getValue()).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </span>
    ),
  }),

  columnHelper.display({
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const ticket = row.original;

      if (userRole === Role.USER) {
        return null;
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(ticket.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];
