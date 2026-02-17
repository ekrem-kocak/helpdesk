'use client';

import { useQuery } from '@tanstack/react-query';
import type { ApiPaginatedResponse, Ticket } from '@helpdesk/shared/interfaces';
import { apiClient } from '../lib/api-client';

interface UseTicketsOptions {
  /**
   * React Query enabled flag.
   * Allows disabling the query in cases like conditional fetching.
   */
  enabled?: boolean;
}

/**
 * Shared hook for fetching tickets.
 * Kept in src/hooks so it can be reused
 * across different routes and components.
 */
export function useTickets(options?: UseTicketsOptions) {
  const { enabled = true } = options ?? {};

  const query = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data } =
        await apiClient.get<ApiPaginatedResponse<Ticket>>('/tickets');
      return data.data;
    },
    enabled,
  });

  return {
    tickets: query.data ?? [],
    ...query,
  };
}
