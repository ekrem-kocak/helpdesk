'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse, Ticket } from '@helpdesk/shared/interfaces';
import { apiClient } from '../lib/api-client';

interface RestoreTicketVariables {
  id: string;
}

export function useRestoreTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
    }: RestoreTicketVariables): Promise<ApiResponse<Ticket>> => {
      const { data } = await apiClient.post<ApiResponse<Ticket>>(
        `/tickets/${id}/restore`,
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({
        queryKey: ['ticket', variables.id],
      });
    },
  });
}
