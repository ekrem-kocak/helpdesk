'use client';

import { useQuery } from '@tanstack/react-query';
import type { ApiResponse, Ticket } from '@helpdesk/shared/interfaces';
import { apiClient } from '@client/lib/api-client';

interface UseTicketOptions {
  enabled?: boolean;
}

export function useTicket(id: string, options?: UseTicketOptions) {
  const { enabled = true } = options ?? {};

  const query = useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Ticket>>(
        `/tickets/${id}`,
      );
      return data.data;
    },
    enabled: enabled && !!id,
  });

  return {
    ticket: query.data,
    ...query,
  };
}
