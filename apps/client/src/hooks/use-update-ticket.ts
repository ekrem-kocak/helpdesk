'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  ApiResponse,
  Ticket,
  Priority,
  Status,
} from '@helpdesk/shared/interfaces';
import { apiClient } from '@client/lib/api-client';

interface UpdateTicketVariables {
  id: string;
  data: {
    title?: string;
    description?: string;
    priority?: Priority;
    status?: Status;
  };
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateTicketVariables) => {
      const response = await apiClient.patch<ApiResponse<Ticket>>(
        `/tickets/${id}`,
        data,
      );
      return response.data.data;
    },
    onSuccess: (updatedTicket) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', updatedTicket.id] });
    },
  });
}
