'use client';

import { useQuery } from '@tanstack/react-query';
import type {
  ApiPaginatedResponse,
  ApiResponse,
  Ticket,
} from '@helpdesk/shared/interfaces';
import { apiClient } from '@client/lib/api-client';
import type { TicketListParams } from '@client/lib/ticket-params';
import {
  ticketListParamsToSearch,
  DEFAULT_TICKET_LIST_PARAMS,
} from '@client/lib/ticket-params';

interface UseTicketsOptions {
  params?: TicketListParams | null;
  enabled?: boolean;
}

export function useTickets(options?: UseTicketsOptions) {
  const { params = null, enabled = true } = options ?? {};

  const resolved = {
    ...DEFAULT_TICKET_LIST_PARAMS,
    ...params,
  };
  const queryParams = ticketListParamsToSearch(resolved);

  const query = useQuery({
    queryKey: ['tickets', queryParams],
    queryFn: async (): Promise<ApiPaginatedResponse<Ticket>> => {
      const { data } = await apiClient.get<ApiPaginatedResponse<Ticket>>(
        '/tickets',
        { params: queryParams },
      );
      return data;
    },
    enabled,
  });

  const tickets = query.data?.data ?? [];
  const meta = query.data?.meta;

  return {
    tickets,
    meta: meta ?? undefined,
    ...query,
  };
}

interface UseMyTicketsOptions {
  enabled?: boolean;
}

export function useMyTickets(options?: UseMyTicketsOptions) {
  const { enabled = true } = options ?? {};

  const query = useQuery({
    queryKey: ['tickets', 'my-tickets'],
    queryFn: async (): Promise<Ticket[]> => {
      const { data } = await apiClient.get<ApiResponse<Ticket[]>>(
        '/tickets/my-tickets',
      );
      return Array.isArray(data?.data) ? data.data : [];
    },
    enabled,
  });

  return {
    tickets: query.data ?? [],
    ...query,
  };
}
