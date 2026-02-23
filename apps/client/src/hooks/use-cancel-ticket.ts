'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse, Ticket } from '@helpdesk/shared/interfaces';
import { Status } from '@helpdesk/shared/interfaces';
import { apiClient } from '@client/lib/api-client';

interface CancelTicketVariables {
  id: string;
}

/**
 * Hook for cancelling a ticket.
 * Changes the ticket status to CANCELLED.
 * Only available for eligible tickets based on user role and ticket status.
 */
export function useCancelTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: CancelTicketVariables) => {
      const response = await apiClient.patch<ApiResponse<Ticket>>(
        `/tickets/${id}`,
        { status: Status.CANCELLED },
      );
      return response.data.data;
    },
    onSuccess: (cancelledTicket) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({
        queryKey: ['ticket', cancelledTicket.id],
      });
    },
  });
}
