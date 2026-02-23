'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@client/lib/api-client';

interface DeleteTicketVariables {
  id: string;
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteTicketVariables) => {
      await apiClient.delete(`/tickets/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({
        queryKey: ['ticket', variables.id],
      });
    },
  });
}
