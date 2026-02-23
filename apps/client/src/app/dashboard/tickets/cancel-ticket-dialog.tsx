'use client';

import { useState } from 'react';
import axios from 'axios';
import type { Ticket } from '@helpdesk/shared/interfaces';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@helpdesk/shared/ui';
import { Ban, Loader2 } from 'lucide-react';
import { useCancelTicket } from '@client/hooks/use-cancel-ticket';

interface CancelTicketDialogProps {
  ticket: Ticket;
  trigger?: React.ReactNode;
}

export function CancelTicketDialog({
  ticket,
  trigger,
}: CancelTicketDialogProps) {
  const [open, setOpen] = useState(false);
  const cancelMutation = useCancelTicket();

  const handleCancel = () => {
    cancelMutation.mutate(
      { id: ticket.id },
      {
        onSuccess: () => {
          setOpen(false);
        },
        onError: (error: unknown) => {
          // Error is handled by isError check in render
          console.error('Failed to cancel ticket:', error);
        },
      },
    );
  };

  const defaultTrigger = (
    <Button variant="destructive" size="sm" className="gap-2">
      <Ban className="h-4 w-4" />
      Cancel Ticket
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Cancel Ticket</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this ticket? This action will mark
            the ticket as cancelled and it cannot be edited afterwards.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted rounded-lg p-4">
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Ticket ID:</span>
              <span className="ml-2 font-mono font-medium">
                #{ticket.id.slice(0, 8)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Title:</span>
              <span className="ml-2 font-medium">{ticket.title}</span>
            </div>
          </div>
        </div>

        {cancelMutation.isError && (
          <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-lg border px-3 py-2 text-sm">
            {axios.isAxiosError(cancelMutation.error)
              ? cancelMutation.error.response?.data?.message ||
                'Failed to cancel ticket. Please try again.'
              : 'Failed to cancel ticket. Please try again.'}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={cancelMutation.isPending}
          >
            Keep Ticket
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <Ban className="h-4 w-4" />
                Yes, Cancel Ticket
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
