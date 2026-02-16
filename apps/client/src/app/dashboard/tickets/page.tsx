'use client';

import { useQuery } from '@tanstack/react-query';
import {
  type ApiPaginatedResponse,
  type Ticket,
} from '@helpdesk/shared/interfaces';
import { apiClient } from '../../../lib/api-client';
import { DataTable } from '../../../components/data-table';
import { Loader2 } from 'lucide-react';
import { getColumns } from './columns';
import { useAuthStore } from '../../../store/auth.store';

export default function TicketsPage() {
  const user = useAuthStore((state) => state.user);

  const {
    data: tickets = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data } =
        await apiClient.get<ApiPaginatedResponse<Ticket>>('/tickets');
      return data.data;
    },
  });

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

  return (
    <div className="space-y-6">
      <DataTable
        columns={getColumns(user?.role)}
        data={tickets}
        searchKey="title"
        searchPlaceholder="Search by title..."
      />
    </div>
  );
}
