'use client';

import Link from 'next/link';
import { createColumnHelper } from '@tanstack/react-table';
import type { Ticket } from '@helpdesk/shared/interfaces';
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
import { canManageTicketActions, type UserWithRole } from '@client/lib/auth';
import { formatDate } from '@client/lib/format';
import { priorityConfig, statusConfig } from '@client/lib/tickets';

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

const columnHelper = createColumnHelper<Ticket>();

export const getColumns = (user: UserWithRole) => [
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
      <Link
        href={`/dashboard/tickets/${info.row.original.id}`}
        className="hover:text-primary block max-w-75 truncate font-medium transition-colors hover:underline"
      >
        {info.getValue()}
      </Link>
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
        {formatDate(info.getValue())}
      </span>
    ),
  }),

  columnHelper.display({
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const ticket = row.original;

      if (!canManageTicketActions(user)) {
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
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/tickets/${ticket.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => {
                e.preventDefault();
                console.warn('Delete not implemented yet');
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];
