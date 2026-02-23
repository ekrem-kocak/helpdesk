'use client';

import { useState } from 'react';
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
import { Loader2, Trash2 } from 'lucide-react';
import { useDeleteTicket } from '@client/hooks/use-delete-ticket';
import { getErrorMessage } from '@client/lib/errors';

type DeleteTicketDialogProps =
  | {
      ticket: Ticket;
      open: boolean;
      onOpenChange: (open: boolean) => void;
      trigger?: React.ReactNode;
      onDeleted?: () => void;
    }
  | {
      ticket: Ticket;
      open?: undefined;
      onOpenChange?: undefined;
      trigger?: React.ReactNode;
      onDeleted?: () => void;
    };

export function DeleteTicketDialog(props: DeleteTicketDialogProps) {
  const {
    ticket,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
    trigger,
    onDeleted,
  } = props;

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;

  if (isControlled && !controlledOnOpenChange) {
    throw new Error(
      'DeleteTicketDialog: onOpenChange is required when open is provided.',
    );
  }

  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setInternalOpen;

  const deleteMutation = useDeleteTicket();

  const handleDelete = () => {
    deleteMutation.mutate(
      { id: ticket.id },
      {
        onSuccess: () => {
          setOpen(false);
          onDeleted?.();
        },
        onError: (error) => {
          console.error('Delete ticket failed:', getErrorMessage(error));
        },
      },
    );
  };

  const defaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-2"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Delete Ticket
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Delete Ticket</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this ticket? This will soft-delete
            the ticket and it will no longer appear in lists. This action is
            reserved for administrators.
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

        {deleteMutation.isError && (
          <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-lg border px-3 py-2 text-sm">
            {getErrorMessage(deleteMutation.error)}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Yes, Delete Ticket
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
