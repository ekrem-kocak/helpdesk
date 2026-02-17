'use client';

import { Loader2 } from 'lucide-react';
import { DataTable } from '../../../components/data-table';
import { useAuthStore } from '../../../store/auth.store';
import { isUserRole } from '../../../lib/auth';
import { CreateTicketDialog } from './create-ticket-dialog';
import { UserTicketsView } from './user-tickets-view';
import { getColumns } from './columns';
import { useTickets } from '../../../hooks/use-tickets';

export default function TicketsPage() {
  const user = useAuthStore((state) => state.user);
  const isUser = isUserRole(user);

  const { tickets, isLoading, isError, error } = useTickets();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-4">
        Tickets are loading with an error.
        {error instanceof Error && (
          <p className="mt-1 text-sm opacity-70">{error.message}</p>
        )}
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-foreground text-lg font-semibold tracking-tight">
              My Tickets
            </h2>
            <p className="text-muted-foreground text-sm">
              View your support tickets and create new ones.
            </p>
          </div>
          <CreateTicketDialog />
        </div>
        <UserTicketsView
          tickets={tickets}
          searchPlaceholder="Search tickets..."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-foreground text-lg font-semibold tracking-tight">
            All Tickets
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage all support tickets or create a new one.
          </p>
        </div>
        <CreateTicketDialog />
      </div>
      <DataTable
        columns={getColumns(user)}
        data={tickets}
        searchKey="title"
        searchPlaceholder="Search by title..."
      />
    </div>
  );
}
